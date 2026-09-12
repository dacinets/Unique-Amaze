import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Chat API endpoint supporting multi-turn conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], market = 'ca', model = 'gemini-3.8-flash' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    let ai: GoogleGenAI;
    try {
      ai = getAI();
    } catch (err: any) {
      console.warn('Gemini API key error:', err.message);
      // Fallback response if GEMINI_API_KEY is not set yet in development
      res.json({
        reply: `Welcome to **Unique Amaze**! We engineer high-converting, intelligent digital flagships and AI-powered websites. \n\nOur flagship packages range from **${
          market === 'mw' ? 'MWK 500,000 to MWK 5,000,000+' : 'CAD $1,200 to CAD $6,000+'
        }**, delivering sub-1s load speeds and custom AI integrations. \n\n*(Note: To enable live real-time Gemini AI chat completions, please ensure your \`GEMINI_API_KEY\` is set in the AI Studio Settings > Secrets panel.)*\n\nWould you like to explore our **Services**, check the **Pricing & Packages**, or try our **2-Minute AI Project Planner**?`,
        modelUsed: 'studio-fallback',
      });
      return;
    }

    const marketContext =
      market === 'mw'
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
          market === 'mw' ? 'Malawi (MWK 500k – 5M)' : 'Canada (CAD $1,200 – $6,000+)'
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
