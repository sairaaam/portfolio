export const fifaCards = [
  {
    id: 'cam',
    position: 'FRONTEND',
    rating: 94,
    cardType: 'gold',
    name: 'SARAVANA SAIRAM C',
    nation: '🇮🇳',
    club: 'React Ecosystem',
    accentColor: '#4fc3f7',
    bgGradient: 'linear-gradient(145deg, #0d1b2a 0%, #1a3a5c 50%, #0d1b2a 100%)',
    stats: [
      { label: 'UI', skill: 'Three.js', value: 95 },
      { label: 'FW', skill: 'React', value: 93 },
      { label: 'NEXT', skill: 'Next.js', value: 91 },
      { label: 'TS', skill: 'TypeScript', value: 90 },
      { label: 'MOB', skill: 'React Native', value: 88 },
      { label: 'CSS', skill: 'Tailwind CSS', value: 87 },
    ],
    slideFrom: 'left',
    triggerStart: 0.18,
    triggerEnd: 0.38,
    label: 'FRONTEND ENGINEER',
  },
  {
    id: 'cdm',
    position: 'AI / ML',
    rating: 91,
    cardType: 'silver',
    name: 'SARAVANA SAIRAM C',
    nation: '🇮🇳',
    club: 'Backend Systems',
    accentColor: '#81d4fa',
    bgGradient: 'linear-gradient(145deg, #0a1628 0%, #112244 50%, #0a1628 100%)',
    stats: [
      { label: 'API', skill: 'FastAPI', value: 92 },
      { label: 'LLM', skill: 'RAG / LLMs', value: 93 },
      { label: 'SVC', skill: 'NestJS', value: 90 },
      { label: 'DB', skill: 'PostgreSQL', value: 88 },
      { label: 'CACHE', skill: 'Redis', value: 85 },
      { label: 'QUEUE', skill: 'BullMQ', value: 84 },
    ],
    slideFrom: 'right',
    triggerStart: 0.40,
    triggerEnd: 0.60,
    label: 'BACKEND & AI ENGINEER',
  },
  {
    id: 'gk',
    position: 'DEVOPS',
    rating: 85,
    cardType: 'bronze',
    name: 'SARAVANA SAIRAM C',
    nation: '🇮🇳',
    club: 'Cloud Infrastructure',
    accentColor: '#b3e5fc',
    bgGradient: 'linear-gradient(145deg, #091520 0%, #0d2035 50%, #091520 100%)',
    stats: [
      { label: 'AWS', skill: 'AWS ECS/S3', value: 86 },
      { label: 'DOCK', skill: 'Docker', value: 85 },
      { label: 'GIT', skill: 'CI/CD', value: 90 },
      { label: 'GCP', skill: 'GCP', value: 83 },
      { label: 'SYS', skill: 'Linux', value: 84 },
      { label: 'DES', skill: 'Figma', value: 80 },
    ],
    slideFrom: 'left',
    triggerStart: 0.62,
    triggerEnd: 0.78,
    label: 'CLOUD & DEVOPS',
  },
]

export const projects = [

  {
    id: 1,
    title: 'MedAR — Explainable AI',
    tag: 'AI · AR · Computer Vision',
    color: '#4fc3f7',
    description: 'Hybrid CNN-ViT model achieving 95.99% diagnostic accuracy with real-time Grad-CAM heatmap overlays in an AR medical viewer.',
    screenshotLabel: null,

    role: 'AI Engineer & Full Stack Developer',
    duration: '6 months',
    year: '2024',
    status: 'Completed',
    team: 'Solo Project',

    techStack: [
      { category: 'AI / ML', items: ['EfficientNet-B0', 'ViT (6-layer)', 'PyTorch', 'Grad-CAM', 'AdamW', 'Mixed Precision', 'CLAHE'] },
      { category: 'Backend', items: ['FastAPI', 'PostgreSQL', 'Redis', 'JWT Auth', 'slowapi', 'DICOM Pipeline'] },
      { category: 'AR / Frontend', items: ['React Three Fiber', 'Three.js', 'WebXR', 'GLB Assets', 'WebSocket', 'OrbitControls'] },
      { category: 'Infrastructure', items: ['Docker', 'AWS', 'Vercel Blob', 'HIPAA Audit Logging'] },
    ],

    highlights: [
      '95.99% test accuracy on NIH Chest X-Ray dataset (reported in IEEE paper)',
      'Dual-backbone CNN-ViT fusion: EfficientNet-B0 + custom 6-layer ViT, ~15.6M parameters',
      'Cross-attention fusion with 8-head attention — ViT CLS token queries CNN multi-scale features',
      'Grad-CAM heatmaps returned as base64 inline in prediction JSON — no separate file serving',
      'DICOM preprocessing pipeline with windowing, MONOCHROME1 inversion, PHI exclusion',
      'Rate-limited FastAPI: 30 req/min single predict, 10 req/min batch (up to 10 images)',
      'HIPAA-style audit trail: every prediction logged via log_action() for traceability',
      '5 anatomical GLB models (heart, brain, lungs, kidneys, intestines) with real-time cross-section clipping',
      'Collaborative AR sessions: 8-character session code + WebSocket participant sync',
      'Trained on Colab T4 GPU with AMP, gradient clipping at 1.0, early stopping patience=7',
    ],

    summary: `MedAR is a clinical AI system combining a Hybrid CNN-ViT deep learning model with an augmented reality anatomy viewer for real-time diagnostic support.\n\nThe model architecture fuses EfficientNet-B0 (multi-scale spatial features at 3 indices) with a custom 6-layer Vision Transformer via 8-head cross-attention — ViT CLS token as query, CNN feature maps as key/value pairs — achieving 95.99% accuracy on pneumonia detection from chest X-rays.\n\nEvery prediction returns Grad-CAM heatmaps as base64 inline in the JSON response, with confidence-tiered explanations, DICOM preprocessing support, and full HIPAA-style audit logging.\n\nThe AR viewer renders 5 anatomical GLB models with real-time clipping planes, part isolation, opacity control, and collaborative sessions over WebSocket.`,

    screenshots: [
      '/screenshots/project-1/dashboardpage.png',
      '/screenshots/project-1/ar.png',
      '/screenshots/project-1/cross-section.png',
      '/screenshots/project-1/heart.png',
      '/screenshots/project-1/Login.png',
      '/screenshots/project-1/Courses.png',
    ],

    links: { live: null, demo: null },
  },

  {
    id: 2,
    title: 'ARIA — Algorithmic Trading',
    tag: 'Python · Quant Finance · NSE Derivatives',
    color: '#00d4ff',
    description: 'Institutional-grade algorithmic trading system for NSE index options (Nifty 50, Bank Nifty, Fin Nifty) with a 9-factor risk engine and SEBI-compliant execution.',
    screenshotLabel: null,

    role: 'Quantitative Engineer & Full Stack Developer',
    duration: '5 months',
    year: '2024',
    status: 'Paper Trading',
    team: 'Solo Project',

    techStack: [
      { category: 'Quantitative', items: ['Black-Scholes-Merton', 'Newton-Raphson IV', 'GEX Calibration', 'Walk-Forward Backtesting', '4-State Regime Classifier'] },
      { category: 'Market Signals', items: ['India VIX', 'Open Interest', 'Put-Call Ratio', 'Max Pain', 'Gamma Exposure'] },
      { category: 'Backend', items: ['Python', 'Flask REST API', 'WebSocket (TrueData)', 'Groww API', 'Sliding Window Rate Limiter'] },
      { category: 'Frontend', items: ['React', 'Live Market Dashboard', 'Regime Display', 'Real-time Risk Monitor'] },
    ],

    highlights: [
      'BSM pricing engine built from scratch with Newton-Raphson implied volatility extraction',
      '9-factor composite risk scoring before any order is placed',
      '4-state market regime classifier driving position sizing decisions',
      'SEBI-compliant: 10 orders/second sliding window rate limiter (not token bucket — avoids burst violation)',
      'India-specific GEX calibration — inverted SpotGamma sign convention for retail-dominated options market',
      'Parallel VIX fetch from 3 sources (NSE API, yfinance, nsepython) with 8-second hard timeout',
      'LIMIT-only order enforcement at construction level — market orders architecturally impossible',
      '5-year append-only SEBI audit trail with mandatory kill switch halting all activity instantly',
      '12 modules, 146+ unit tests, 30-session paper trading minimum before live capital deployment',
      'Walk-forward backtesting with 18-month rolling training windows',
    ],

    summary: `ARIA (Adaptive Risk Intelligence Architecture) is an institutional-grade algorithmic trading system for Indian NSE derivatives markets.\n\nThe system ingests live market data via TrueData WebSocket, runs every proposed trade through a 9-factor composite risk engine and a 4-state market regime classifier, then executes only when all quantitative signals align — with a mandatory kill switch for instant halt.\n\nKey engineering decisions reflect production-grade thinking: a sliding window rate limiter over token bucket (prevents SEBI's rolling 1-second burst violation), India-specific GEX sign convention inversion, and parallel VIX data fetching with hard timeouts. The BSM engine with Newton-Raphson IV extraction was implemented from scratch — no third-party pricing library dependencies.`,

    screenshots: [
      '/screenshots/project-2/aria-dashboard.png',
      '/screenshots/project-2/aria-signals.png',
      '/screenshots/project-2/aria-systems.png',
    ],

    links: { live: null, demo: null },
  },

  {
    id: 3,
    title: 'GD College LMS App',
    tag: 'Flutter · REST API · WordPress',
    color: '#81d4fa',
    description: "Cross-platform Flutter mobile app for GD College's e-learning platform — JWT auth, video lessons, interactive quizzes, and 20+ custom REST API endpoints.",
    screenshotLabel: null,

    role: 'Mobile Developer & API Integration Engineer',
    duration: '4 months',
    year: '2024',
    status: 'Live',
    team: 'Solo Project',

    techStack: [
      { category: 'Mobile', items: ['Flutter', 'Dart', 'Dio', 'SharedPreferences', 'WebView', 'Image Picker'] },
      { category: 'Auth & API', items: ['JWT Authentication', 'Auth Interceptor', 'Deep Linking', 'Multipart Upload', 'REST API'] },
      { category: 'Backend', items: ['WordPress', 'Tutor LMS', 'Custom REST Endpoints', 'Gumlet Video (DRM)'] },
    ],

    highlights: [
      '16 screens covering the complete student journey end-to-end',
      '20+ custom WordPress REST API endpoints integrated with Dio',
      'JWT auth with Dio interceptor for automatic token injection on every request',
      'WebView-embedded Gumlet video player with DRM-compatible lesson delivery',
      'In-memory lesson cache reducing redundant API calls during video navigation',
      'Interactive quiz engine with attempt history, scoring, and review submission',
      'Deep-link driven password reset flow from email to app without re-authentication',
      'Multipart file upload for profile photo from camera or gallery',
      'Persistent login state across sessions using SharedPreferences',
      '~7,000 lines of Dart across iOS and Android with a consistent design system',
    ],

    summary: `A full-featured Learning Management System mobile application built with Flutter for GD College, serving as the native iOS and Android client for the college's WordPress + Tutor LMS platform.\n\nThe app covers the complete student journey across 16 screens — JWT-authenticated login with persistent sessions, course browsing and enrollment, a full curriculum viewer with lessons and quizzes, interactive quiz engine with attempt history, and profile management with photo upload.\n\nAPI communication runs through a centralized Dio client with an auth interceptor that automatically injects JWT tokens on every request. Video lesson delivery uses a WebView-embedded Gumlet player with DRM support and an in-memory cache that eliminates redundant fetches during lesson navigation.`,

    screenshots: [
      '/screenshots/project-3/lms1.jpg',
      '/screenshots/project-3/lms2.jpg',
      '/screenshots/project-3/lms3.jpg',
      '/screenshots/project-3/lms4.jpg',
      '/screenshots/project-3/lms5.jpg',
      '/screenshots/project-3/lms6.jpg',
      '/screenshots/project-3/lms7.jpg',
    ],

    links: { live: null, demo: null },
  },

  {
    id: 4,
    title: 'GD College — Website',
    tag: 'WordPress · Elementor · PHP',
    color: '#b3e5fc',
    description: 'Institutional website for GD College — built with WordPress and Elementor across 15+ pages, with LeadSquared lead capture, SEO optimization, and a blog.',
    screenshotLabel: null,

    role: 'Web Developer',
    duration: '3 months',
    year: '2024',
    status: 'Live',
    team: 'Solo Project',

    techStack: [
      { category: 'Frontend', items: ['WordPress', 'Elementor', 'HTML', 'CSS', 'JavaScript'] },
      { category: 'Backend', items: ['PHP'] },
      { category: 'Infrastructure', items: ['GoDaddy Hosting', 'CDN', 'Cache'] },
    ],

    highlights: [
      'Built with WordPress and the Elementor page builder across 15+ pages',
      'LeadSquared form integrations for capturing prospective student leads',
      'SEO-optimized pages across all programs and institutional content',
      'Blog section for college news, events, and announcements',
      'Hosted on GoDaddy with CDN and server-side caching enabled',
    ],

    summary: `The GD College website is an institutional web presence built using WordPress with the Elementor page builder, covering 15+ pages across programs, admissions, and campus life.\n\nThird-party integrations include LeadSquared forms for capturing and routing prospective student inquiries. The site includes SEO optimization across all program and institutional pages, and a blog section for ongoing college content.\n\nHosted on GoDaddy with CDN and caching enabled for consistent performance for visitors across Canada and internationally.`,

    screenshots: [
      '/screenshots/project-4/gd1.png',
      '/screenshots/project-4/gd2.png',
      '/screenshots/project-4/gd3.png',
      '/screenshots/project-4/gd4.png',
    ],

    links: { live: null, demo: null },
  },

]

export const socialLinks = [
  { label: 'GitHub', sub: '→ sairaaam', url: 'https://github.com/sairaaam' },
  { label: 'LinkedIn', sub: "→ Let's Connect", url: 'https://www.linkedin.com/in/saravana-sairam/' },
  { label: 'Instagram', sub: '→ @sairam_101', url: 'https://www.instagram.com/sairam_101?igsh=MTZoaDluMW9ib2RyeA==' },
]
