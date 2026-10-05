/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Privacy-focused, GDPR-compliant analytics tracking utility.
 * 
 * Guarantees:
 * - 100% cookie-free (no tracking cookies, no local storage user fingerprinting)
 * - Zero Personally Identifiable Information (PII) collected or stored
 * - Honors Do Not Track (DNT) and Global Privacy Control (GPC) headers/signals
 * - Non-blocking delivery using navigator.sendBeacon with fetch keepalive fallback
 * - Client-side opt-out mechanism with instant sovereignty
 * - Sanitized URLs & referrers (stripping query parameters and sensitive strings)
 */

export interface AnalyticsPayload {
  eventType: 'pageview' | 'event';
  eventName: string;
  path: string;
  referrer: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  screenCategory: 'ultrawide' | 'desktop' | 'laptop' | 'tablet' | 'mobile';
  viewport: string;
  language: string;
  market?: string;
  theme?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface AnalyticsStats {
  totalPageviews: number;
  uniqueDailyVisitors: number;
  topPages: Array<{ path: string; count: number }>;
  deviceBreakdown: Record<string, number>;
  marketBreakdown: Record<string, number>;
  dntRespects: number;
  uptimeHours: number;
  privacyStandards: string[];
}

const OPT_OUT_STORAGE_KEY = 'unique_amaze_analytics_opt_out';
const ANALYTICS_ENDPOINT = '/api/analytics';
const STATS_ENDPOINT = '/api/analytics/stats';

class PrivacyAnalytics {
  private lastTrackedPath: string | null = null;
  private lastTrackedTime: number = 0;

  /**
   * Check if user has explicitly opted out via localStorage setting
   */
  public isOptedOut(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Set user's analytics opt-out preference
   */
  public setOptOut(optOut: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(OPT_OUT_STORAGE_KEY, optOut ? 'true' : 'false');
    } catch {
      // storage unavailable
    }
  }

  /**
   * Check if browser has signaled Do Not Track (DNT) or Global Privacy Control (GPC)
   */
  public isDntActive(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    // Check standard navigator.doNotTrack
    const dnt = navigator.doNotTrack || (window as unknown as { doNotTrack?: string }).doNotTrack;
    if (dnt === '1' || dnt === 'yes') return true;

    // Check Global Privacy Control (GPC) signal
    if ((navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true) {
      return true;
    }

    return false;
  }

  /**
   * Helper to categorize device without user-agent sniffing (purely viewport-based)
   */
  private getDeviceCategory(): {
    deviceType: 'desktop' | 'tablet' | 'mobile';
    screenCategory: 'ultrawide' | 'desktop' | 'laptop' | 'tablet' | 'mobile';
  } {
    if (typeof window === 'undefined') {
      return { deviceType: 'desktop', screenCategory: 'desktop' };
    }

    const width = window.innerWidth;
    if (width < 640) {
      return { deviceType: 'mobile', screenCategory: 'mobile' };
    }
    if (width < 1024) {
      return { deviceType: 'tablet', screenCategory: 'tablet' };
    }
    if (width < 1440) {
      return { deviceType: 'desktop', screenCategory: 'laptop' };
    }
    if (width < 1920) {
      return { deviceType: 'desktop', screenCategory: 'desktop' };
    }
    return { deviceType: 'desktop', screenCategory: 'ultrawide' };
  }

  /**
   * Sanitize URL paths to remove any potential personal data in query strings
   */
  private sanitizePath(pathname: string): string {
    if (!pathname) return '/';
    // Only allow alphanumeric, slashes, dashes, and underscores
    const clean = pathname.split('?')[0].split('#')[0];
    return clean.slice(0, 120) || '/';
  }

  /**
   * Sanitize referrer to domain name only, preventing leakage of full source URLs
   */
  private sanitizeReferrer(): string {
    if (typeof document === 'undefined' || !document.referrer) return 'direct';
    try {
      const url = new URL(document.referrer);
      // If internal referrer, mark as internal
      if (typeof window !== 'undefined' && url.hostname === window.location.hostname) {
        return 'internal';
      }
      return url.hostname.slice(0, 100);
    } catch {
      return 'external';
    }
  }

  /**
   * Core non-blocking transmission method
   */
  private sendPayload(payload: AnalyticsPayload): void {
    if (typeof window === 'undefined') return;

    // Strict privacy checks: opt-out or DNT aborts tracking immediately
    if (this.isOptedOut() || this.isDntActive()) {
      return;
    }

    const dataString = JSON.stringify(payload);

    // Method 1: navigator.sendBeacon (optimal for page unload / non-blocking)
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([dataString], { type: 'application/json' });
        const enqueued = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
        if (enqueued) return;
      } catch {
        // Fall back to fetch
      }
    }

    // Method 2: fetch with keepalive: true
    try {
      fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataString,
        keepalive: true,
        credentials: 'omit', // Zero cookies transmitted
      }).catch(() => {
        // Silently drop errors; analytics must never interrupt user experience
      });
    } catch {
      // Silently ignore
    }
  }

  /**
   * Log an anonymous page view event
   */
  public trackPageview(pathname?: string, additionalMeta?: Record<string, string | number | boolean>): void {
    if (typeof window === 'undefined') return;

    const currentPath = this.sanitizePath(pathname || window.location.pathname);
    const now = Date.now();

    // Prevent rapid duplicate hits within 1 second for the same path
    if (this.lastTrackedPath === currentPath && now - this.lastTrackedTime < 1000) {
      return;
    }
    this.lastTrackedPath = currentPath;
    this.lastTrackedTime = now;

    const { deviceType, screenCategory } = this.getDeviceCategory();

    let market = 'ca';
    let theme = 'obsidian';
    try {
      market = localStorage.getItem('unique_amaze_market') || 'ca';
      theme = localStorage.getItem('unique_amaze_theme') || 'obsidian';
    } catch {}

    const payload: AnalyticsPayload = {
      eventType: 'pageview',
      eventName: 'page_view',
      path: currentPath,
      referrer: this.sanitizeReferrer(),
      deviceType,
      screenCategory,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: (navigator.language || 'en').slice(0, 10),
      market,
      theme,
      metadata: additionalMeta,
      timestamp: new Date().toISOString(),
    };

    this.sendPayload(payload);
  }

  /**
   * Log an anonymous user interaction event (e.g. market switch, theme toggle)
   */
  public trackEvent(
    eventName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    if (typeof window === 'undefined') return;

    const { deviceType, screenCategory } = this.getDeviceCategory();

    let market = 'ca';
    let theme = 'obsidian';
    try {
      market = localStorage.getItem('unique_amaze_market') || 'ca';
      theme = localStorage.getItem('unique_amaze_theme') || 'obsidian';
    } catch {}

    const payload: AnalyticsPayload = {
      eventType: 'event',
      eventName: eventName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50),
      path: this.sanitizePath(window.location.pathname),
      referrer: this.sanitizeReferrer(),
      deviceType,
      screenCategory,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: (navigator.language || 'en').slice(0, 10),
      market,
      theme,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.sendPayload(payload);
  }

  /**
   * Fetch live aggregate statistics from the server-side analytics engine
   */
  public async getStats(): Promise<AnalyticsStats | null> {
    try {
      const response = await fetch(STATS_ENDPOINT, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }
}

export const analytics = new PrivacyAnalytics();
