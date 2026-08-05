export const GODLY_ALTERNATIVES = [
  {
    id: "saasframe",
    name: "SaaSFrame",
    category: "Landing page inspiration",
    type: "SaaS Inspiration",
    url: "https://www.saasframe.io",
    rating: 4.9,
    tags: ["SaaS UI", "Landing Pages", "Dashboard Patterns", "2026 Trends"],
    description: "Curated library of high-performing SaaS landing pages, onboarding flows, and product UI patterns.",
    badge: "Top Match",
    accentColor: "from-blue-500/20 to-indigo-500/20",
    highlights: ["Interactive UI component filters", "Real user flow breakdowns", "Dark mode UI showcases"]
  },
  {
    id: "saaspo",
    name: "Saaspo",
    category: "Landing page inspiration",
    type: "SaaS Gallery",
    url: "https://saaspo.com",
    rating: 4.8,
    tags: ["Linear Aesthetic", "Minimalist", "Developer SaaS"],
    description: "Hand-picked collection of the best SaaS website designs with clean product-in-hero layouts.",
    badge: "Popular",
    accentColor: "from-purple-500/20 to-pink-500/20",
    highlights: ["Outcome-led headlines", "Minimal copy examples", "Dark mode first"]
  },
  {
    id: "landbook",
    name: "Land-book",
    category: "Landing page inspiration",
    type: "Design Gallery",
    url: "https://land-book.com",
    rating: 4.7,
    tags: ["Design System", "Portfolios", "Web Design"],
    description: "A showcase of web design inspiration for developers, creators, and SaaS founders.",
    badge: "Classic",
    accentColor: "from-emerald-500/20 to-teal-500/20",
    highlights: ["Daily updated showcase", "Full website screenshots", "Style category tagging"]
  },
  {
    id: "landingfolio",
    name: "Landingfolio",
    category: "Landing page inspiration",
    type: "Templates & Showcase",
    url: "https://landingfolio.com",
    rating: 4.9,
    tags: ["Linear-Style", "Tailwind UI", "Framer Templates"],
    description: "The best landing page design inspiration, component library, and responsive templates.",
    badge: "Essential",
    accentColor: "from-amber-500/20 to-orange-500/20",
    highlights: ["Component-level breakdowns", "Framer & Webflow clones", "High conversion patterns"]
  },
  {
    id: "linear-app",
    name: "Linear",
    category: "Linear-style aesthetic",
    type: "Gold Standard",
    url: "https://linear.app",
    rating: 5.0,
    tags: ["Linear Dark", "Keyboard Hotkeys", "Product-In-Hero", "Micro-animations"],
    description: "The benchmark for developer-focused SaaS design. Show, don't tell with outcome-led dark UI.",
    badge: "Benchmark",
    accentColor: "from-violet-500/20 to-indigo-600/20",
    highlights: ["True-gray background steps", "Subtle neon gradients", "Keyboard shortcuts UI"]
  },
  {
    id: "saasui",
    name: "SaaS UI",
    category: "Broader SaaS UI inspiration",
    type: "Component System",
    url: "https://www.saasui.design",
    rating: 4.8,
    tags: ["React Components", "Chakra UI", "TypeScript"],
    description: "An advanced React component library for building SaaS dashboards and landing pages fast.",
    badge: "Developer Tool",
    accentColor: "from-cyan-500/20 to-blue-500/20",
    highlights: ["Accessible dark primitives", "Pre-built auth & billing", "Theme token support"]
  },
  {
    id: "mobbin",
    name: "Mobbin",
    category: "Broader SaaS UI inspiration",
    type: "Mobile & Web UI",
    url: "https://mobbin.com",
    rating: 4.9,
    tags: ["Real App Flows", "SaaS Dashboards", "Design Systems"],
    description: "World's largest library of real-world iOS & Web application screens and user flows.",
    badge: "Industry Standard",
    accentColor: "from-rose-500/20 to-red-500/20",
    highlights: ["Screen step-by-step flows", "Filter by interaction", "Dark mode comparisons"]
  },
  {
    id: "framer",
    name: "Framer",
    category: "No-code landing page builders",
    type: "No-Code Builder",
    url: "https://framer.com",
    rating: 4.9,
    tags: ["No-Code", "3D Animations", "Linear Clones"],
    description: "Build production-ready Linear and Godly style websites with zero code and physics animations.",
    badge: "No-Code Leader",
    accentColor: "from-sky-500/20 to-indigo-500/20",
    highlights: ["Physics-based micro-interactions", "Instant publishing", "Figma to Framer import"]
  },
  {
    id: "spell",
    name: "Spell.sh",
    category: "Linear-style aesthetic",
    type: "Developer SaaS",
    url: "https://spell.sh",
    rating: 4.8,
    tags: ["Linear Dark", "AI SaaS", "Dense Chrome"],
    description: "Dark-first AI tool landing page with dense chrome, subtle neon glow, and fast load speed.",
    badge: "2026 Trend",
    accentColor: "from-emerald-500/20 to-lime-500/20",
    highlights: ["Flash-free dark load", "Monospace data tables", "Controlled accent pop"]
  },
  {
    id: "orbix",
    name: "Orbix",
    category: "Linear-style aesthetic",
    type: "SaaS Studio",
    url: "https://orbix.studio",
    rating: 4.7,
    tags: ["Dark Dashboard", "High Contrast", "Glassmorphic"],
    description: "Modern dark mode design patterns tailored for B2B developer tools and analytics platforms.",
    badge: "Cutting-Edge",
    accentColor: "from-fuchsia-500/20 to-purple-500/20",
    highlights: ["Surface elevation steps", "Dark-safe chart palettes", "Dense information layout"]
  }
];

export const DARK_MODE_PATTERNS_2026 = [
  {
    id: 1,
    title: "True-Gray Base Surfaces",
    subtitle: "Charcoal, slate, or navy foundations instead of absolute #000000 black",
    description: "Pure black causes harsh eye fatigue and kills ambient light simulation. True gray (e.g. HSL 240 10% 4% or #09090b) creates a softer contrast, smoother ambient feel, and realistic surface layering.",
    icon: "Layers",
    codeSnippet: `/* 2026 True-Gray Token System */
:root {
  --bg-foundation: hsl(240 10% 4%);     /* #09090b - Base Canvas */
  --bg-card: hsl(240 10% 7%);           /* #121215 - Level 1 Elevation */
  --bg-elevated: hsl(240 8% 12%);       /* #1c1c21 - Level 2 Popover */
  --border-subtle: hsl(240 6% 15%);     /* 8-15% border contrast */
}`,
    exampleBad: "Pure #000000 canvas with #ffffff text (Harsh contrast, no surface depth)",
    exampleGood: "Slate #09090b surface with #f4f4f5 off-white typography and HSL 240 6% 15% borders"
  },
  {
    id: 2,
    title: "Surface Elevation via Fill Steps",
    subtitle: "Background step shifts replace traditional box-shadows",
    description: "On dark interfaces, standard drop shadows disappear or look like dirty mud. 2026 dark dashboards use 2% to 5% lighter HSL fills for cards, modals, and hover states to establish depth hierarchy.",
    icon: "Box",
    codeSnippet: `<div className="bg-[#09090b] p-6">
  {/* Level 1 Card Elevation */}
  <div className="bg-[#121215] border border-white/10 rounded-xl p-4 hover:bg-[#18181c] transition-all">
    <h3 className="text-zinc-100 text-sm font-medium">Elevation Level 1</h3>
  </div>
</div>`,
    exampleBad: "Using box-shadow: 0 10px 30px rgba(0,0,0,0.8) on dark background",
    exampleGood: "Lighter fill steps: Base (#09090b) -> Card (#121215) -> Hover (#18181c) -> Active (#222227)"
  },
  {
    id: 3,
    title: "Controlled Accent Color & Single Glow",
    subtitle: "Reserve saturated neon colors strictly for CTAs and alerts",
    description: "90% of the UI should remain neutral (zinc/slate tones). Reserve vibrant primary accents (e.g. Electric Indigo, Cyan, or Emerald) for active states, primary actions, and single glowing focus rings.",
    icon: "Zap",
    codeSnippet: `/* Single Saturated Accent Rule */
.btn-primary {
  background: hsl(240 5% 96%);
  color: hsl(240 10% 4%);
}
.accent-glow {
  box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.4);
}`,
    exampleBad: "Multiple neon colors (bright pink, green, yellow, cyan) vying for attention everywhere",
    exampleGood: "Monochrome slate UI with a focused indigo highlight on key status indicators"
  },
  {
    id: 4,
    title: "Dense, Minimal Chrome Layouts",
    subtitle: "Reduce header padding, thin 1px borders, and monospace data density",
    description: "Linear and Stripe pioneer dense chrome where navigation, action bars, and breadcrumbs occupy minimum vertical height, leaving maximum viewport space for actual workspace data.",
    icon: "LayoutGrid",
    codeSnippet: `<header className="h-11 px-3 bg-[#09090b]/80 backdrop-blur border-b border-white/10 flex items-center justify-between text-xs">
  {/* Compact header chrome */}
</header>`,
    exampleBad: "Giant 80px tall headers with empty whitespace taking up 25% of screen height",
    exampleGood: "Compact 40-44px header bar with integrated hotkeys and instant search trigger"
  },
  {
    id: 5,
    title: "Dark-First Typography & Monospace Numerals",
    subtitle: "Off-white text & tabular numbers for zero jittering tabular data",
    description: "Use off-white text (#f4f4f5 or #e4e4e7) instead of pure white (#ffffff). Use `font-variant-numeric: tabular-nums` or monospace font family for numerical metrics so data columns align perfectly.",
    icon: "Type",
    codeSnippet: `<span className="font-mono text-xs tracking-tight text-zinc-300 font-semibold tabular-nums">
  $148,920.50 <span className="text-emerald-400 font-sans ml-1">+14.2%</span>
</span>`,
    exampleBad: "Pure white #FFFFFF body text causes glaring halo effect; proportional numbers misalign columns",
    exampleGood: "Zine-200 text with tabular monospace digits for flawless financial and metrics alignment"
  },
  {
    id: 6,
    title: "Dark-Safe Data Visualization",
    subtitle: "Bright lines with translucent 10-15% area gradient fills",
    description: "Standard light-theme charts look washed out or invisible on dark backgrounds. 2026 charts use vibrant stroke paths paired with subtle opacity gradient drops that fade seamlessly into background surfaces.",
    icon: "BarChart3",
    codeSnippet: `<svg className="w-full h-32">
  <defs>
    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35"/>
      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
    </linearGradient>
  </defs>
  <path d="..." fill="url(#chartGlow)" stroke="#818cf8" strokeWidth="2" />
</svg>`,
    exampleBad: "Dark blue or dark red chart lines on a dark background (low contrast)",
    exampleGood: "High-contrast electric violet line with 30% translucent fill fade to dark canvas"
  }
];

export const LINEAR_HERO_TABS = [
  { id: "issues", label: "Issue Tracking", count: "148 active" },
  { id: "cycles", label: "Cycles & Sprints", count: "Cycle 42" },
  { id: "roadmap", label: "Product Roadmap", count: "Q3 - 2026" },
  { id: "insights", label: "Velocity Analytics", count: "99.4% SLA" }
];

export const DEMO_ISSUES = [
  { id: "LIN-1024", title: "Implement HSL semantic color tokens across dark dashboard", priority: "Urgent", status: "In Progress", assignee: "Rajat K.", label: "Design System", cycle: "Cycle 42" },
  { id: "LIN-1025", title: "Add true-gray fill step elevation for popovers and dropdowns", priority: "High", status: "In Review", assignee: "Elena R.", label: "Frontend", cycle: "Cycle 42" },
  { id: "LIN-1026", title: "Optimize monospace numeric layout for financial metrics table", priority: "Medium", status: "Done", assignee: "Alex M.", label: "Performance", cycle: "Cycle 41" },
  { id: "LIN-1027", title: "Configure flash-free dark mode initialization script", priority: "Low", status: "Backlog", assignee: "Sarah T.", label: "Infrastructure", cycle: "Cycle 43" }
];
