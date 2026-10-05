import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto, { randomUUID, createHash } from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Security headers middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Lazy-initialization pattern to guard against missing API key during startup
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const UNIQUE_AMAZE_KNOWLEDGE = `
YOU ARE THE "UNIQUE AMAZE AI CONCIERGE", THE OFFICIAL INTELLIGENT DIGITAL ADVISOR FOR UNIQUE AMAZE STUDIO.

=== ABOUT UNIQUE AMAZE ===
Unique Amaze is an elite boutique AI-powered web studio and digital experience agency. We specialize in engineering high-converting, intelligent digital flagships and bespoke websites for ambitious businesses.
Our philosophy: Zero bloat, instant load speeds (sub-1s First Contentful Paint, 98+ Lighthouse scores), architectural typography, refined spatial motion, and deep AI automation that turns casual visitors into paying clients.

Operating Hubs & Regional Markets:
1. Canada & North America: Alberta (Calgary, Chestermere, Edmonton), British Columbia, Ontario. Pricing in Canadian Dollars (CAD). Integrations with Interac, Stripe, and PIPEDA-compliant privacy intake.
2. Malawi & Regional Africa: Lilongwe, Blantyre, and across Malawi. Fair, localized pricing in Malawi Kwacha (MWK). Engineered specifically for sub-1.2s mobile loading on TNM & Airtel 4G networks, with Airtel Money, Mpamba, and WhatsApp direct conversions.

=== CORE SERVICES PROVIDED ===
1. High-Performance Website Design & Development:
   - Zero-bloat custom code (React, TypeScript, Tailwind, Vite).
   - Mobile-first, responsive layouts tested across all device sizes.
   - Built for extreme conversion with clear calls to action, friction-free forms, and high-contrast visual authority.
   - Technical SEO and Google Business profile optimization to dominate local search ("near me" queries).

2. Autonomous AI Agents & Smart Chatbots:
   - 24/7 client intake, qualification, and automated appointment scheduling.
   - Customized AI assistants trained on the client's business policies, services, and FAQs (just like this concierge!).
   - Automated quote calculators and CRM/email lead dispatch.

3. Spatial 3D & Immersive Interactive Experiences:
   - Lightweight Three.js, WebGL shaders, interactive product pedestals, and kinetic typography.
   - Hardware-accelerated fluid motion without data bloat or battery drain.

4. Strategic Brand Systems & Identity:
   - Bespoke architectural typography, high-contrast color systems, and modern digital brand guidelines.

5. Digital Flagships & Custom Business Platforms:
   - E-commerce storefronts, private client portals, membership systems, and multi-location business architectures.

=== TRANSPARENT PACKAGES & PRICING ===
1. Starter Website:
   - Best for: New ventures, personal brands, local contractors, and focused landing pages.
   - Pricing Canada: CAD $1,200 – $2,000
   - Pricing Malawi: MWK 500,000 – 1,200,000
   - Scope: 1–3 clean, ultra-fast pages (95+ score target), mobile-first layout, clear conversion flow, contact form or WhatsApp booking, local SEO setup, domain & launch support.

2. Business Website (★ Most Popular):
   - Best for: Growing businesses requiring an authoritative, complete presence to win clients.
   - Pricing Canada: CAD $2,500 – $4,500
   - Pricing Malawi: MWK 1,500,000 – 3,000,000
   - Scope: Up to 6–8 custom pages, dedicated service conversion journeys, full Local SEO (Google Business integration), booking/appointment system, visitor analytics, priority launch & handover training.

3. Intelligent Experience:
   - Best for: Forward-thinking brands seeking an AI-assisted, motion-rich digital flagship.
   - Pricing Canada: CAD $4,500 – $6,000
   - Pricing Malawi: MWK 3,500,000 – 5,000,000
   - Scope: Premium multi-page architecture, 3D/motion interactive elements, smart forms & guided intake, 24/7 AI lead qualification, automated CRM/email sync, schema markup & conversion optimization.

4. Custom / Complex Projects:
   - Best for: Advanced platforms, e-commerce, private client portals, complex multi-agent workflows.
   - Pricing: Custom scoped upon consultation / Request a Quote.

=== ONGOING CARE PLANS (MONTHLY MAINTENANCE) ===
- Essential Care: CAD $150 – $300/mo | MWK 100,000 – 200,000/mo (Managed cloud hosting, SSL, daily automated backups, security monitoring, minor content edits up to 2 hrs/mo).
- Growth Care (Recommended): CAD $400 – $800/mo | MWK 250,000 – 500,000/mo (Includes Essential Care + AI chatbot tuning & oversight, local SEO review, continuous speed optimization, up to 5 hrs revisions).
- Performance Care: CAD $1,000 – $2,000/mo | MWK 600,000 – 1,200,000/mo (Dedicated senior designer/developer hours, custom feature sprints, A/B conversion testing, priority 24/7 SLA).

=== PROVEN PORTFOLIO & CASE STUDIES ===
- Chestermere Mobile Massage (Chestermere & Calgary, AB): Seamless in-home massage booking platform with 2-tap scheduling. Results: +142% conversion lift, 98/100 mobile speed score.
- Fire Claws (Canada): Cinematic outdoor heavy tool website featuring tactile product storytelling. Results: +210% direct inquiry surge, 0.8s load speed.
- Belle Afrique Wellness (Lilongwe, Malawi): Quiet luxury private wellness sanctuary booking experience. Results: Full client waitlist, 5.0 rating.
- Encounter Love Victory Church (ELVC): Community worship hub with live streaming, media archives, and event registrations (3,200+ weekly listeners).
- Concept Lab: Unique Amaze's in-house laboratory demonstrating spatial computing, Three.js shaders, and interactive UI at 120 FPS.

=== PROJECT PROCESS & TIMELINE ===
- Total Turnaround: Typically 2 to 3 weeks for standard flagships.
- 4-Phase Delivery:
  * Phase 1: Architectural Blueprint & Strategy (1–2 days)
  * Phase 2: High-Fidelity Design & Interactive Prototype (3–5 days)
  * Phase 3: Zero-Bloat Engineering & Performance Hardening (5–7 days)
  * Phase 4: Quality Assurance, Security Audit & Live Launch (1–2 days)

=== NEXT STEPS FOR CLIENTS ===
1. Use the interactive "2-Minute AI Project Planner" available right in this app (in the Planner tab) to configure scope and get an instant custom quote estimate.
2. Book a free 20-minute Strategy Session via the Contact page or schedule link.
3. Message the studio directly via email (hello@uniqueamaze.com) or WhatsApp.

=== GUIDELINES FOR YOUR RESPONSES ===
- Tone: Professional, sophisticated, warmly welcoming, authoritative, and direct.
- Currency / Market: If the user indicates or is viewing from Malawi (or asks in MWK), emphasize the MWK pricing and local network optimizations (TNM/Airtel, Airtel Money/Mpamba). If from Canada or international, quote CAD $.
- Formatting: Use markdown formatting (bullet points, bold key terms) to keep answers clean and easy to scan.
- Avoid robotic clichés. Be genuine, helpful, and transparent.
`;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    studio: 'Unique Amaze',
    version: '1.0.0',
    capabilities: ['gemini-ai-concierge', 'interactive-planner', 'portfolio-telemetry'],
  });
});

// Check status of mockup files on disk
app.get('/api/mockup-status', (_req, res) => {
  const mockups = ['macbook_pro_mock_up.jpg', 'ipad_mock_up.jpg', 'iphone_pro_max_mock_up.jpg'];
  const status: Record<string, boolean> = {};

  for (const file of mockups) {
    const publicPath = path.join(process.cwd(), 'public', file);
    status[file] = fs.existsSync(publicPath);
  }

  res.json(status);
});

// Mockup image upload endpoint to directly save files into public/
app.post('/api/upload-mockup', (req, res) => {
  try {
    const { fileName, base64Data } = req.body;

    if (!fileName || !base64Data || typeof fileName !== 'string' || typeof base64Data !== 'string') {
      return res.status(400).json({ error: 'Valid fileName and base64Data are required.' });
    }

    const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '');
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
    const ext = path.extname(safeName).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({ error: 'Invalid file extension. Only images (.jpg, .png, .webp, .svg, .gif) are allowed.' });
    }

    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanedBase64, 'base64');

    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Payload exceeds maximum 10MB file limit.' });
    }

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const publicFilePath = path.join(publicDir, safeName);
    fs.writeFileSync(publicFilePath, buffer);

    // Also write to dist/ if present
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      const distFilePath = path.join(distDir, safeName);
      try {
        fs.writeFileSync(distFilePath, buffer);
      } catch (_) {}
    }

    console.log(`Saved mockup ${safeName} to ${publicFilePath} (${buffer.length} bytes)`);
    return res.json({ success: true, fileName: safeName, url: `/${safeName}?t=${Date.now()}` });
  } catch (err: any) {
    console.error('Error saving mockup file:', err);
    return res.status(500).json({ error: 'Failed to write mockup file to disk.' });
  }
});

// Helper for audit logging (mirrors api_audit_logs in database/schema.sql)
function logAudit(endpoint: string, eventType: string, severity: 'info' | 'warning' | 'security' | 'error', details: any, req: express.Request) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ipHash = createHash('sha256').update(ip + (process.env.IP_SALT || 'uniqueamaze_salt')).digest('hex');
  const auditEntry = {
    event_uuid: randomUUID(),
    endpoint,
    method: req.method,
    event_type: eventType,
    severity,
    ip_hash: ipHash,
    user_agent: req.headers['user-agent']?.slice(0, 255) || 'unknown',
    details,
    timestamp: new Date().toISOString()
  };
  console.log(`[AUDIT:${severity.toUpperCase()}] ${endpoint} - ${eventType}:`, JSON.stringify(auditEntry));
}

// In-memory telemetry cache for active server runtime
const runtimeLeads: any[] = [];
const runtimePlannerSubmissions: any[] = [];

// ============================================================================
// PRIVACY-FOCUSED, GDPR-COMPLIANT ANALYTICS ENGINE (ZERO PII / COOKIE-FREE)
// ============================================================================
interface AnalyticsEventRecord {
  id: string;
  eventType: 'pageview' | 'event';
  eventName: string;
  path: string;
  referrer: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  screenCategory: string;
  market: 'ca' | 'mw';
  theme: 'obsidian' | 'lunar';
  timestamp: string;
}

const serverStartTime = Date.now();
let analyticsDay = new Date().toISOString().slice(0, 10);
const dailyVisitorHashes = new Set<string>();
const recentAnalyticsEvents: AnalyticsEventRecord[] = [];
const pageviewCounts: Record<string, number> = {
  '/': 1, // initialize with baseline
};
const referrerCounts: Record<string, number> = {
  direct: 1,
};
const deviceTypeCounts: Record<string, number> = { desktop: 0, tablet: 0, mobile: 0 };
const marketCounts: Record<string, number> = { ca: 0, mw: 0 };
let totalPageviewCounter = 0;
let dntRespectsCounter = 0;

function checkAndRotateDailySalt(): void {
  const currentDay = new Date().toISOString().slice(0, 10);
  if (currentDay !== analyticsDay) {
    analyticsDay = currentDay;
    dailyVisitorHashes.clear();
  }
}

// Ingest privacy-preserving traffic telemetry (zero cookies, zero PII)
app.post('/api/analytics', (req, res) => {
  try {
    checkAndRotateDailySalt();

    // 1. Honor Do Not Track (DNT) and Global Privacy Control (GPC)
    const dnt = req.headers['dnt'] === '1' || req.headers['sec-gpc'] === '1';
    if (dnt) {
      dntRespectsCounter++;
      return res.status(200).json({ success: true, tracked: false, reason: 'dnt_honored' });
    }

    const {
      eventType = 'pageview',
      eventName = 'page_view',
      path: reqPath = '/',
      referrer = 'direct',
      deviceType = 'desktop',
      screenCategory = 'desktop',
      market = 'ca',
      theme = 'obsidian',
      timestamp,
    } = req.body || {};

    // 2. Strict Input Sanitization & Zero-PII Guarantee
    const cleanPath = String(reqPath).split('?')[0].split('#')[0].replace(/[^a-zA-Z0-9_\-\/]/g, '').slice(0, 120) || '/';
    const cleanReferrer = String(referrer).replace(/[^a-zA-Z0-9.\-]/g, '').slice(0, 80) || 'direct';
    const cleanEventType = eventType === 'event' ? 'event' : 'pageview';
    const cleanEventName = String(eventName).replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 50) || 'page_view';
    const cleanDeviceType: 'desktop' | 'tablet' | 'mobile' =
      deviceType === 'mobile' || deviceType === 'tablet' ? deviceType : 'desktop';
    const cleanMarket: 'ca' | 'mw' = market === 'mw' ? 'mw' : 'ca';
    const cleanTheme: 'obsidian' | 'lunar' = theme === 'lunar' ? 'lunar' : 'obsidian';

    // 3. Ephemeral Daily Visitor Hash (resets at midnight UTC, irreversible, zero IP retention)
    const rawIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] || '').slice(0, 200);
    const dailySalt = createHash('sha256').update(analyticsDay + (process.env.ANALYTICS_SALT || 'uniqueamaze_privacy_salt')).digest('hex');
    const dayVisitorHash = createHash('sha256').update(rawIp + userAgent + dailySalt).digest('hex').slice(0, 16);
    dailyVisitorHashes.add(dayVisitorHash);

    // 4. Update Aggregate Counters
    if (cleanEventType === 'pageview') {
      totalPageviewCounter++;
      pageviewCounts[cleanPath] = (pageviewCounts[cleanPath] || 0) + 1;
      referrerCounts[cleanReferrer] = (referrerCounts[cleanReferrer] || 0) + 1;
      deviceTypeCounts[cleanDeviceType] = (deviceTypeCounts[cleanDeviceType] || 0) + 1;
      marketCounts[cleanMarket] = (marketCounts[cleanMarket] || 0) + 1;
    }

    // 5. Keep limited bounded ring buffer of recent anonymized records (max 1000)
    const record: AnalyticsEventRecord = {
      id: randomUUID(),
      eventType: cleanEventType,
      eventName: cleanEventName,
      path: cleanPath,
      referrer: cleanReferrer,
      deviceType: cleanDeviceType,
      screenCategory: String(screenCategory).slice(0, 20),
      market: cleanMarket,
      theme: cleanTheme,
      timestamp: timestamp && typeof timestamp === 'string' ? timestamp : new Date().toISOString(),
    };

    recentAnalyticsEvents.unshift(record);
    if (recentAnalyticsEvents.length > 1000) {
      recentAnalyticsEvents.pop();
    }

    return res.status(200).json({ success: true, tracked: true });
  } catch (err: any) {
    console.error('Error in /api/analytics:', err);
    return res.status(500).json({ error: 'Failed to process analytics event.' });
  }
});

// Read aggregate privacy metrics & stats (safe for public disclosure, zero PII)
app.get('/api/analytics/stats', (_req, res) => {
  checkAndRotateDailySalt();
  const uptimeHours = Number(((Date.now() - serverStartTime) / (1000 * 60 * 60)).toFixed(1));

  const topPages = Object.entries(pageviewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([p, count]) => ({ path: p, count }));

  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([r, count]) => ({ referrer: r, count }));

  res.json({
    totalPageviews: totalPageviewCounter,
    uniqueDailyVisitors: dailyVisitorHashes.size,
    topPages,
    topReferrers,
    deviceBreakdown: deviceTypeCounts,
    marketBreakdown: marketCounts,
    dntRespects: dntRespectsCounter,
    uptimeHours,
    privacyStandards: [
      'GDPR Compliant (Regulation EU 2016/679)',
      'ePrivacy Directive Compliant (100% Cookie-Free)',
      'Zero PII Stored or Transmitted',
      'Daily Rotating Cryptographic Salt',
      'Honors Do Not Track (DNT) & Global Privacy Control (GPC)',
      'No Cross-Site Profiling'
    ],
  });
});

// Contact form inquiry endpoint (mirrors contact_leads in database/schema.sql)
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, business_name, timeline, message, market = 'ca', website_url } = req.body;

    // Honeypot check: bot triggered website_url
    if (website_url && String(website_url).trim().length > 0) {
      logAudit('/api/contact', 'honeypot_triggered', 'security', { ip: req.ip }, req);
      return res.status(200).json({ success: true, message: 'Inquiry received' });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const leadUuid = randomUUID();
    const leadRecord = {
      lead_uuid: leadUuid,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : null,
      business_name: business_name ? String(business_name).trim() : null,
      market: market === 'mw' ? 'mw' : 'ca',
      timeline: timeline ? String(timeline).trim() : null,
      message: message ? String(message).trim() : null,
      created_at: new Date().toISOString()
    };

    runtimeLeads.push(leadRecord);
    logAudit('/api/contact', 'lead_created', 'info', { lead_uuid: leadUuid, market, email: email.slice(0, 3) + '***' }, req);

    return res.status(200).json({
      success: true,
      lead_uuid: leadUuid,
      message: 'Consultation inquiry received and queued for review.'
    });
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    logAudit('/api/contact', 'submission_error', 'error', { error: err.message }, req);
    return res.status(500).json({ error: 'Failed to process inquiry. Please email hello@uniqueamaze.com directly.' });
  }
});

// AI Planner Brief submission endpoint (mirrors planner_submissions in database/schema.sql)
app.post('/api/planner', (req, res) => {
  try {
    const { client_name, client_email, client_phone, business_name, market = 'ca', recommendation_tier, recommendation_price, recommendation_timeline, recommendation_confidence, generated_brief_text, answers } = req.body;

    if (!client_name || typeof client_name !== 'string' || client_name.trim().length === 0) {
      return res.status(400).json({ error: 'Client name is required.' });
    }
    if (!client_email || typeof client_email !== 'string' || !client_email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const submissionUuid = randomUUID();
    const plannerRecord = {
      submission_uuid: submissionUuid,
      client_name: client_name.trim(),
      client_email: client_email.trim(),
      client_phone: client_phone ? String(client_phone).trim() : null,
      business_name: business_name ? String(business_name).trim() : null,
      market: market === 'mw' ? 'mw' : 'ca',
      recommendation_tier: recommendation_tier || 'Business Website',
      recommendation_price: recommendation_price || 'CAD $2,500 – $4,500',
      recommendation_timeline: recommendation_timeline || '2–3 weeks',
      recommendation_confidence: recommendation_confidence || 95,
      answers: answers || {},
      created_at: new Date().toISOString()
    };

    runtimePlannerSubmissions.push(plannerRecord);
    logAudit('/api/planner', 'brief_generated', 'info', { submission_uuid: submissionUuid, tier: recommendation_tier }, req);

    return res.status(200).json({
      success: true,
      submission_uuid: submissionUuid,
      message: 'Project brief securely logged and dispatched.'
    });
  } catch (err: any) {
    console.error('Error in /api/planner:', err);
    logAudit('/api/planner', 'planner_error', 'error', { error: err.message }, req);
    return res.status(500).json({ error: 'Failed to store project brief.' });
  }
});

// Chat API endpoint supporting multi-turn conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], market = 'ca', model = 'gemini-3.8-flash' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'A valid non-empty message is required.' });
      return;
    }

    if (message.length > 4000) {
      res.status(400).json({ error: 'Message length exceeds maximum allowable 4000 characters.' });
      return;
    }

    const sanitizedMarket = market === 'mw' ? 'mw' : 'ca';

    let ai: GoogleGenAI;
    try {
      ai = getAI();
    } catch (err: any) {
      console.warn('Gemini API key error:', err.message);
      // Fallback response if GEMINI_API_KEY is not set yet in development
      res.json({
        reply: `Welcome to **Unique Amaze**! We engineer high-converting, intelligent digital flagships and AI-powered websites. \n\nOur flagship packages range from **${
          sanitizedMarket === 'mw' ? 'MWK 500,000 to MWK 5,000,000+' : 'CAD $1,200 to CAD $6,000+'
        }**, delivering sub-1s load speeds and custom AI integrations. \n\n*(Note: To enable live real-time Gemini AI chat completions, please ensure your \`GEMINI_API_KEY\` is set in the AI Studio Settings > Secrets panel.)*\n\nWould you like to explore our **Services**, check the **Pricing & Packages**, or try our **2-Minute AI Project Planner**?`,
        modelUsed: 'studio-fallback',
      });
      return;
    }

    const marketContext =
      sanitizedMarket === 'mw'
        ? 'Current user context: Malawi Market (pricing in MWK, TNM/Airtel network considerations, local payment methods).'
        : 'Current user context: Canadian/International Market (pricing in CAD, Interac/Stripe, Calgary/Chestermere/Alberta hub).';

    const systemInstruction = `${UNIQUE_AMAZE_KNOWLEDGE}\n\n${marketContext}\n\nCurrent User Question: Respond accurately, articulately, and directly to the user's inquiry based on the facts provided above.`;

    // Format previous conversation history + current message for the SDK
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (
          item &&
          (item.role === 'user' || item.role === 'model') &&
          Array.isArray(item.parts) &&
          item.parts[0]?.text
        ) {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.parts[0].text) }],
          });
        }
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Select requested model or default to gemini-3.1-flash-lite for ultra-responsive low-latency answers
    const selectedModel = model && model.includes('gemini') ? model : 'gemini-3.1-flash-lite';

    try {
      let response;
      let modelUsed = selectedModel;

      try {
        response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      } catch (primaryErr: any) {
        console.warn(`Primary model ${selectedModel} encountered an issue (${primaryErr?.message}). Falling back to gemini-3.1-flash-lite...`);
        if (selectedModel !== 'gemini-3.1-flash-lite') {
          modelUsed = 'gemini-3.1-flash-lite';
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
        } else {
          throw primaryErr;
        }
      }

      const reply = response?.text || 'I apologize, but I could not generate a response at this moment. Please try again or reach out to our team at hello@uniqueamaze.com.';

      res.json({
        reply,
        modelUsed,
      });
    } catch (apiError: any) {
      console.error('Error in Gemini API chat call:', apiError);

      // Fallback gracefully with contextual information from the studio knowledge base
      res.json({
        reply: `Thank you for asking about **Unique Amaze**! We provide custom high-performance website design, 24/7 AI agent integrations, and 3D spatial experiences for clients across ${
          sanitizedMarket === 'mw' ? 'Malawi (MWK 500k – 5M)' : 'Canada (CAD $1,200 – $6,000+)'
        }.\n\nOur team is ready to build an intelligent digital flagship with sub-1s load times for your business. You can also explore our **Pricing** tab or test our **2-Minute AI Project Planner** right now!`,
        modelUsed: 'studio-knowledge-fallback',
      });
    }
  } catch (err: any) {
    console.error('Server error in /api/chat:', err);
    res.status(500).json({
      error: 'An internal server error occurred while processing your chat request.',
    });
  }
});

// High-performance static image & asset caching middleware for mockups and public assets
app.use(express.static(path.join(process.cwd(), 'public'), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|webp|svg|gif|ico|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  }
}));

// Start the Express server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unique Amaze server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
