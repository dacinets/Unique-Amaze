import { ProjectCard, IndustryItem, PricingPackage, CarePlan, FAQCategory, Testimonial } from '../types';

export const LOGO_DATA_URI = "data:image/png;base64,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";

export const PROJECTS_DATA: ProjectCard[] = [
  {
    id: 'chestermere-massage',
    title: 'Chestermere Mobile Massage',
    category: 'Mobile Wellness Website',
    description: 'A seamless, calming appointment-booking journey engineered for in-home massage clients across Chestermere and Calgary.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
    liveUrl: 'https://chestermeremassage.com/',
    metrics: [
      { label: 'Booking Speed', value: '2 Taps' },
      { label: 'Conversion Lift', value: '+142%' },
      { label: 'Mobile Score', value: '98/100' }
    ],
    accentColor: '#008280'
  },
  {
    id: 'fire-claws',
    title: 'Fire Claws',
    category: 'Product Website',
    description: 'Cinematic, tactile product storytelling for heavy-duty outdoor fire handling tools with high-contrast visual authority.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=900&auto=format&fit=crop',
    liveUrl: 'https://fireclaws.ca/',
    metrics: [
      { label: 'Direct Inquiries', value: '+210%' },
      { label: 'Avg Session', value: '3.8m' },
      { label: 'Load Time', value: '0.8s' }
    ],
    accentColor: '#367588'
  },
  {
    id: 'belle-afrique',
    title: 'Belle Afrique Wellness',
    category: 'Private Wellness Brand',
    description: 'Quiet luxury digital presence for a premier appointment-only sanctuary, pairing botanical serenity with frictionless booking.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
    liveUrl: 'https://belleafriquemw.com/',
    metrics: [
      { label: 'Private Bookings', value: 'Full Waitlist' },
      { label: 'Client Feedback', value: '5.0 ★' },
      { label: 'Brand Recall', value: 'High' }
    ],
    accentColor: '#008280'
  },
  {
    id: 'elvc-church',
    title: 'Encounter Love Victory Church',
    category: 'Church Digital Presence',
    description: 'A welcoming, modern digital home connecting community members with live worship streams, media archives, and events.',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=80',
    liveUrl: 'https://www.elv.church/',
    metrics: [
      { label: 'Weekly Listeners', value: '3,200+' },
      { label: 'Event Registrations', value: '+88%' },
      { label: 'Media Uptime', value: '99.9%' }
    ],
    accentColor: '#367588'
  },
  {
    id: 'concept-lab',
    title: 'Unique Amaze Concept Lab',
    category: 'AI Website Experience',
    description: 'Our internal research laboratory exploring real-time Three.js shaders, generative user flows, and spatial computing UI.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    liveUrl: '#planner',
    metrics: [
      { label: 'Render Target', value: '120 FPS' },
      { label: 'Interaction Latency', value: '< 5ms' },
      { label: 'Experiments Live', value: '12' }
    ],
    accentColor: '#008280'
  },
  {
    id: 'future-card-1',
    title: 'Your Website Could Be Next',
    category: 'Reserved Future Project',
    description: 'We reserve a strictly limited number of bespoke client slots each quarter. Let’s design an intelligent digital experience for your brand.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
    isFutureCard: true,
    ctaText: 'Reserve Your Slot →',
    accentColor: '#367588'
  }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'trades',
    emoji: '🔧',
    name: 'Trades & Contractors',
    head: 'Turn “just looking” into booked jobs',
    lede: 'Contractors live and die by the quote request. We build sites that make it effortless to call, message, or book — and that rank when someone nearby searches at 11pm.',
    outcomes: ['Click-to-call & instant quote forms', 'Local SEO for “near me” searches', 'Project galleries that prove your work'],
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=760&q=70',
    alt: 'Contractor working with precision tools',
    smart: 'Instant quote request with automatic follow-up'
  },
  {
    id: 'wellness',
    emoji: '💆',
    name: 'Medical & Wellness',
    head: 'A calm, trustworthy first impression',
    lede: 'Patients choose with their gut. We craft serene, professional experiences with frictionless online booking and the credibility cues that earn the appointment.',
    outcomes: ['Online appointment booking', 'HIPAA/PIPEDA-conscious intake forms', 'Reassuring, accessible design'],
    img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=760&q=70',
    alt: 'Calm, spa-like wellness treatment room',
    smart: 'Online booking with reminders and intake forms'
  },
  {
    id: 'restaurants',
    emoji: '🍽️',
    name: 'Restaurants & Cafés',
    head: 'Make them hungry before they arrive',
    lede: 'Menus that load instantly, reservations in two taps, and photography that sells the room. Built phone-first, because that is where the table gets booked.',
    outcomes: ['Live menus + reservations', 'Mouth-watering visual design', 'Google Maps & reviews integration'],
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=760&q=70',
    alt: 'Warm, inviting café interior',
    smart: 'Live menu and two-tap reservations'
  },
  {
    id: 'real-estate',
    emoji: '🏠',
    name: 'Real Estate',
    head: 'Listings that sell the lifestyle',
    lede: 'Immersive property showcases, lead capture that actually converts, and a personal brand people remember long after the open house.',
    outcomes: ['Rich listing galleries & virtual tours', 'Smart lead-capture forms', 'Personal brand authority'],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=760&q=70',
    alt: 'Bright, modern architectural home interior',
    smart: 'Smart lead capture tied to each listing'
  },
  {
    id: 'retail',
    emoji: '🛍️',
    name: 'Retail Stores',
    head: 'Your shelf space on the open web',
    lede: 'Storefronts that look premium and turn browsers into buyers — whether they are shopping online or planning a visit to your physical store.',
    outcomes: ['Clean e-commerce or product catalog', 'Inventory & promotion highlights', 'In-store + online, unified'],
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=760&q=70',
    alt: 'Refined boutique retail display',
    smart: 'Product catalog with unified in-store and online sync'
  },
  {
    id: 'prof-services',
    emoji: '⚖️',
    name: 'Professional Services',
    head: 'Authority that wins the engagement',
    lede: 'For firms where trust is everything, a polished, credible presence that positions you as the obvious choice before the first call.',
    outcomes: ['Credibility-first design', 'Consultation booking', 'Case studies & results proof'],
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=70',
    alt: 'Refined professional office setting',
    smart: 'Consultation booking with qualification'
  },
  {
    id: 'consultants',
    emoji: '🎯',
    name: 'Consultants',
    head: 'Position yourself as the expert',
    lede: 'A site that articulates your value, captures qualified leads, and lets your insight do the selling while you focus on delivering client results.',
    outcomes: ['Clear value proposition', 'Lead magnets & nurture flows', 'Thought-leadership platform'],
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=760&q=70',
    alt: 'Focused strategy consultation',
    smart: 'Lead magnet delivery with automated nurture sequence'
  },
  {
    id: 'coaches',
    emoji: '🌱',
    name: 'Coaches',
    head: 'Turn your message into a movement',
    lede: 'Warm, personal sites that build know-like-trust and make signing up feel like the natural next step, not an intimidating leap.',
    outcomes: ['Story-driven personal brand', 'Program & session booking', 'Email list growth engine'],
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=760&q=70',
    alt: 'Warm, personal coaching moment',
    smart: 'Program sign-up with email list growth'
  },
  {
    id: 'manufacturing',
    emoji: '🏭',
    name: 'Small Manufacturers',
    head: 'Look as serious as your product',
    lede: 'B2B buyers vet you online first. We build a capable, modern presence with the spec depth and credibility that earns the RFQ.',
    outcomes: ['Capability & spec showcases', 'RFQ / contact funnels', 'Industrial-grade credibility'],
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=760&q=70',
    alt: 'Precision detail in a modern workshop',
    smart: 'RFQ funnel routed straight to your inbox'
  },
  {
    id: 'non-profits',
    emoji: '🤝',
    name: 'Non-Profits',
    head: 'Tell the story. Move people to give.',
    lede: 'Emotionally resonant sites that make donating, volunteering, and sharing effortless — so your mission travels further.',
    outcomes: ['Compelling impact storytelling', 'Donation & volunteer flows', 'Built to be shared on mobile'],
    img: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=760&q=70',
    alt: 'Community hands working together with purpose',
    smart: 'Donation and volunteer flows built to convert'
  }
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    eyebrow: 'For new & local ventures',
    bestFor: 'New businesses, personal brands, simple service websites, and high-impact landing pages.',
    priceCA: 'CAD $1,200 – $2,000',
    priceMW: 'MWK 500,000 – 1,200,000',
    features: [
      '1–3 clean, mobile-first responsive pages',
      'Ultra-fast load times (95+ score target)',
      'Clear business messaging and conversion layout',
      'Contact form or WhatsApp direct booking',
      'Basic on-page local SEO setup',
      'Domain setup & launch support'
    ]
  },
  {
    id: 'business',
    name: 'Business Website',
    eyebrow: '★ Most Popular',
    bestFor: 'Growing businesses that need a complete, authoritative digital presence to win customers.',
    priceCA: 'CAD $2,500 – $4,500',
    priceMW: 'MWK 1,500,000 – 3,000,000',
    isFeatured: true,
    features: [
      'Up to 6–8 custom designed pages',
      'Custom premium design tailored to your brand',
      'Service pages with dedicated conversion journeys',
      'Full Local SEO setup (Google Business integration)',
      'Contact / booking system integration',
      'Basic analytics & visitor insight tracking',
      'Priority launch support & handover training'
    ]
  },
  {
    id: 'intelligent',
    name: 'Intelligent Experience',
    eyebrow: 'For advanced digital flagships',
    bestFor: 'Businesses that want a more advanced, motion-rich, and AI-assisted digital experience.',
    priceCA: 'CAD $4,500 – $6,000',
    priceMW: 'MWK 3,500,000 – 5,000,000',
    features: [
      'Premium multi-page architecture',
      'Light motion or 3D-inspired interactive elements',
      'Smart forms or guided customer intake flow',
      'AI-assisted lead capture & qualification',
      'Automated email notification & CRM sync',
      'Comprehensive conversion optimization',
      'Technical SEO foundation & schema markup'
    ]
  },
  {
    id: 'custom',
    name: 'Custom / Complex',
    eyebrow: 'Scoped personally',
    bestFor: 'Projects that need advanced functionality beyond the normal package range.',
    priceCA: 'Request a Quote',
    priceMW: 'Request a Quote',
    isCustom: true,
    features: [
      'Advanced 3D or WebGL visual experiences',
      'Full-featured E-commerce and checkout',
      'Automated client booking or scheduling engines',
      'Membership or private client portals',
      'CRM integrations & custom business dashboards',
      'Complex multi-agent AI workflows',
      'Multi-location & franchise architectures'
    ]
  }
];

export const CARE_PLANS: CarePlan[] = [
  {
    name: 'Essential Care',
    priceCAD: '$150 – $300 / mo',
    priceMWK: 'MWK 100,000 – 200,000 / mo',
    features: [
      'Managed cloud hosting + SSL certificate',
      'Daily automated backups & security monitoring',
      'Minor content updates & text edits (up to 2 hrs/mo)',
      'Monthly performance & analytics summary'
    ]
  },
  {
    name: 'Growth Care',
    priceCAD: '$400 – $800 / mo',
    priceMWK: 'MWK 250,000 – 500,000 / mo',
    recommended: true,
    features: [
      'Everything in Essential Care',
      'AI chatbot / intake assistant tuning & oversight',
      'Local SEO maintenance & ranking review',
      'Continuous speed & performance optimization',
      'Up to 5 hours of monthly design/feature revisions'
    ]
  },
  {
    name: 'Performance Care',
    priceCAD: '$1,000 – $2,000 / mo',
    priceMWK: 'MWK 650,000 – 1,300,000 / mo',
    features: [
      'Everything in Growth Care',
      'Ongoing conversion rate testing & UX tweaks',
      'Priority 24/7 technical incident support',
      'Direct WhatsApp access to your dedicated specialist',
      'Custom monthly reporting & growth strategy session'
    ]
  }
];

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 0,
    label: '01 // Start Here',
    items: [
      {
        q: 'What does Unique Amaze do?',
        a: 'We design and build premium, AI-ready websites for businesses that want to look credible, feel modern, and turn visitors into enquiries — from strategy and content structure through design, build, and launch.'
      },
      {
        q: 'Who do you work with?',
        a: 'Small and growing businesses, service providers, clinics, churches, NGOs, and organisations that rely on a strong, trustworthy online presence to win and keep customers.'
      },
      {
        q: 'Do you work with businesses in Canada and Malawi?',
        a: 'Yes. We serve both markets, with pricing set locally for each — Canadian clients in CAD, Malawian clients in MWK. Neither is a direct currency conversion of the other; both represent fair local value.'
      },
      {
        q: 'What makes Unique Amaze different?',
        a: 'You work directly with an experienced specialist from first call to launch — no hand-offs to junior interns — and every project follows the A.M.A.Z.E. Method™, blending strategy, premium design, and practical AI rather than off-the-shelf templates.'
      }
    ]
  },
  {
    id: 1,
    label: '02 // Services',
    items: [
      {
        q: 'Do you only build AI or 3D websites?',
        a: 'No. Advanced motion and AI are available when they serve the project, but they are never forced. Many businesses need a clean, fast, conversion-focused website first.'
      },
      {
        q: 'Can you build a simpler website?',
        a: 'Absolutely. The Starter package is built for exactly that — a focused, professional site that does its job beautifully without over-building.'
      },
      {
        q: 'Can you redesign my current website?',
        a: 'Yes. Redesigns are a core service. We modernise the design, improve speed and SEO, and rebuild the experience around your business goals.'
      },
      {
        q: 'Can you help with strategy, messaging, and content structure?',
        a: 'Yes. Clear positioning and content structure are part of every project, not an afterthought — often the difference between a nice site and one that genuinely converts.'
      }
    ]
  },
  {
    id: 2,
    label: '03 // Pricing',
    items: [
      {
        q: 'How much does a website cost?',
        a: 'Starter sites begin at CAD $1,200 (MWK 500,000). Most complete business sites land in the Business range ($2,500–$4,500 CAD / MWK 1.5M–3.0M). The pricing section shows the full breakdown for your market.'
      },
      {
        q: 'Why are Canada and Malawi priced differently?',
        a: 'Each market has its own local pricing based on local economic context — not a speculative currency conversion. You always see rates calibrated for your region.'
      },
      {
        q: 'What if my project is more complex than the listed packages?',
        a: 'Anything beyond the standard packages — ecommerce, custom client portals, advanced automation — is scoped personally and quoted after a discovery call.'
      },
      {
        q: 'Are care plans available?',
        a: 'Yes. Optional care plans cover hosting, security, updates, backups, SEO maintenance, and ongoing refinements. They are quoted separately from the build.'
      }
    ]
  },
  {
    id: 3,
    label: '04 // Process',
    items: [
      {
        q: 'What is the A.M.A.Z.E. Method™?',
        a: 'Our five-step approach: Assess, Map, Articulate, Zero Friction, Elevate — a clear path from understanding your business to launching and growing a site built with intent.'
      },
      {
        q: 'How long does a project usually take?',
        a: 'Starter sites take about 1–2 weeks, Business sites 2–4 weeks, and larger experiences 4–6 weeks. You will get a firm timeline after your strategy call.'
      },
      {
        q: 'What do you need from me to get started?',
        a: 'A short discovery conversation, any brand assets or content you have, and clarity on your main goal. We guide you through everything else.'
      },
      {
        q: 'How many revisions are included?',
        a: 'Each project includes structured revision rounds at key stages so your feedback shapes the result. The exact number is confirmed in your proposal.'
      }
    ]
  },
  {
    id: 4,
    label: '05 // Technical',
    items: [
      {
        q: 'Will my website be mobile-friendly?',
        a: 'Always. Every site is designed mobile-first and tested across devices, because that is where most of your visitors are.'
      },
      {
        q: 'Will my website be SEO-ready?',
        a: 'Yes. Clean structure, fast performance, and on-page SEO foundations are built in, with local SEO setup available for businesses that need to be found nearby.'
      },
      {
        q: 'Can you connect my domain, forms, WhatsApp, booking tools, or CRM?',
        a: 'Yes. Connecting your domain, enquiry forms, WhatsApp, booking tools, and common CRMs is part of a normal build or scoped as needed.'
      },
      {
        q: 'Will I own my website after launch?',
        a: 'Yes. Your website and its content are yours, and we make sure you are set up with full administrative access upon completion.'
      }
    ]
  },
  {
    id: 5,
    label: '06 // After Launch',
    items: [
      {
        q: 'Can you host and maintain the site?',
        a: 'Yes, through an optional care plan — so hosting, security, and updates are handled and your site stays fast and safe.'
      },
      {
        q: 'What happens after launch?',
        a: 'Most clients choose a care plan covering hosting, security, updates, SEO maintenance, and ongoing improvements, so the site keeps performing.'
      },
      {
        q: 'Can the site grow later?',
        a: 'Yes. Sites are built to extend — new pages, features, and integrations can be added as your business expands.'
      },
      {
        q: 'What happens after I send my Project Planner brief?',
        a: 'Your details and brief are prepared for our team. We follow up to book a free discovery call, refine the scope together, and share a firm proposal.'
      }
    ]
  }
];

export const FAQ_ITEMS = [
  {
    q: 'What does Unique Amaze do?',
    a: 'We design and build premium, AI-ready websites for businesses that want to look credible, feel modern, and turn visitors into enquiries — from strategy and content structure through design, build, and launch.',
    category: 'general'
  },
  {
    q: 'What does “AI-powered website” actually mean for my business?',
    a: 'It means practical intelligence working quietly in the background: smart intake forms that guide visitors, conversational assistants trained on your services, automated lead qualification, and CRM synchronization — so your website works for you 24/7.',
    category: 'general'
  },
  {
    q: 'How does pricing work between Canada and Malawi?',
    a: 'We serve both markets with distinct local price books calibrated for real value — Canadian clients in CAD, Malawian clients in MWK. Neither is a speculative currency conversion of the other; both represent fair, accessible rates for their respective economies.',
    category: 'pricing'
  },
  {
    q: 'How long does a website project take?',
    a: 'Starter websites typically take 1–2 weeks. Business websites take 2–4 weeks. Complex intelligent experiences take 4–6 weeks. Because you work directly with a dedicated specialist, decisions and revisions happen quickly without agency bureaucracy.',
    category: 'process'
  },
  {
    q: 'What is the A.M.A.Z.E. Method™?',
    a: 'Our 5-step framework: Assess (diagnostic & goals), Map (journey & architecture), Articulate (brand voice & visual atmosphere), Zero Friction (high-performance build & smart forms), and Elevate (launch, SEO, and ongoing care).',
    category: 'process'
  },
  {
    q: 'Can you work with my existing brand, logo, and content?',
    a: 'Yes. We can elevate an existing brand or create something fresh. If you have content ready, we will refine it for conversions; if not, our content direction guidance will help you craft compelling copy.',
    category: 'general'
  },
  {
    q: 'What happens after the website launches?',
    a: 'We provide comprehensive handover training and zero-downtime deployment. Most clients choose an ongoing website care plan covering managed cloud hosting, automated daily backups, security monitoring, and regular updates.',
    category: 'process'
  },
  {
    q: 'How does the 1-to-1 specialist model work?',
    a: 'You collaborate directly with the person architecting, designing, and coding your site. No account managers playing telephone, no junior handoffs, and direct access when you have questions or ideas.',
    category: 'general'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'Rachel M.',
    role: 'Clinic Director',
    location: 'Wellness Clinic · Calgary, AB',
    quote: 'It finally feels like our website is working for us. The booking assistant answers questions at midnight and we wake up to confirmed appointments on our calendar.',
    rating: 5,
    initial: 'R'
  },
  {
    name: 'Daniel K.',
    role: 'Managing Partner',
    location: 'Mechanical Contractor · Chestermere, AB',
    quote: 'Working one-on-one with a specialist made all the difference. Premium look, blazing fast load times, and we are finally dominating local search results.',
    rating: 5,
    initial: 'D'
  },
  {
    name: 'Tendai B.',
    role: 'Founder',
    location: 'Boutique Hospitality · Blantyre, Malawi',
    quote: 'They understood our market in Malawi and built something genuinely world-class. Local pricing in Kwacha made it straightforward to say yes.',
    rating: 5,
    initial: 'T'
  }
];

export const STUDIO_MARKETS = [
  { city: 'CHESTERMERE', region: 'Alberta, Canada', tz: 'America/Edmonton', status: 'ACTIVE' },
  { city: 'CALGARY', region: 'Alberta, Canada', tz: 'America/Edmonton', status: 'ACTIVE' },
  { city: 'BLANTYRE', region: 'Southern Region, Malawi', tz: 'Africa/Blantyre', status: 'ACTIVE' },
  { city: 'LILONGWE', region: 'Central Region, Malawi', tz: 'Africa/Blantyre', status: 'ACTIVE' }
];
