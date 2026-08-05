import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Zap, Calendar, BarChart3, Command, Check, ArrowRight, Star, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import PixelBlast from "@/components/ui/PixelBlast";
import LiquidEther from "@/components/ui/LiquidEther";
import Threads from "@/components/ui/Threads";
import BorderGlow from "@/components/ui/BorderGlow";
import TargetCursor from "@/components/ui/TargetCursor";

const stats = [
  { label: "Tasks organized", value: 2400000, suffix: "+" },
  { label: "AI plans generated", value: 180000, suffix: "+" },
  { label: "Hours saved / week", value: 12, suffix: "h" },
  { label: "Team satisfaction", value: 98, suffix: "%" },
];

function Counter({ to, suffix }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = 1400; const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <span className="font-mono">{n.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Sparkles, title: "Magic Add", body: "Type 'Study DSA tomorrow 7pm for 2h' — TaskSync parses date, time, duration, category & tags automatically.", tint: "from-indigo-500/20 to-violet-500/5" },
  { icon: Zap, title: "AI Planner", body: "One click generates your optimal focus plan for today, ordered by priority, deadlines and cognitive load.", tint: "from-blue-500/20 to-cyan-500/5" },
  { icon: Command, title: "Command Palette", body: "⌘K to search, create, navigate — every action is a keystroke away. Built for keyboard-first workflows.", tint: "from-emerald-500/20 to-teal-500/5" },
  { icon: Calendar, title: "Beautiful Calendar", body: "Agenda, week, month and timeline — with deadline highlights and drag-and-drop rescheduling.", tint: "from-orange-500/20 to-rose-500/5" },
  { icon: BarChart3, title: "Productivity Analytics", body: "Streaks, completion trends, focus time and category distribution — insights that actually change behavior.", tint: "from-violet-500/20 to-fuchsia-500/5" },
  { icon: Sparkles, title: "AI Task Breakdown", body: "Turn 'Build portfolio' into 6 concrete subtasks. Our advanced AI reasons about scope in seconds.", tint: "from-indigo-500/20 to-blue-500/5" },
];

const testimonials = [
  { name: "Marcus Chen", role: "Staff Engineer, Stripe", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&w=200&q=80", quote: "TaskSync is the first productivity app that actually feels built for engineers. The command palette alone saves me 30 min a day." },
  { name: "Amelia Ross", role: "Product Lead, Linear", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&w=200&q=80", quote: "Magic Add is genuinely magical. I stopped writing tasks in Notion and my inbox now — everything just flows here." },
  { name: "David Okafor", role: "Founder, Cortex", img: "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&w=200", quote: "I've tried Todoist, TickTick, Things — this replaces all three. The AI planner is worth the Pro tier alone." },
];

const tiers = [
  { name: "Free", price: "$0", period: "forever", features: ["Up to 50 tasks", "3 categories", "Basic analytics", "Command palette"], cta: "Start free" },
  { name: "Pro", price: "$8", period: "/ month", featured: true, features: ["Unlimited tasks", "AI Magic Add & Planner", "Task breakdown (AI)", "Advanced analytics", "Calendar sync", "Priority support"], cta: "Start 14-day trial" },
  { name: "Enterprise", price: "Custom", period: "billed annually", features: ["SSO / SAML", "Team workspaces", "Admin controls", "Audit logs", "Custom SLA", "Dedicated CSM"], cta: "Contact sales" },
];

const faqs = [
  { q: "How does TaskSync's AI work?", a: "TaskSync uses advanced AI to parse natural language, break down complex tasks, generate daily plans and surface productivity insights. Your data is encrypted and never used for training." },
  { q: "Can I import from Todoist / TickTick?", a: "Yes — CSV import is supported on all plans, and native migration tools ship in v1.1 next month." },
  { q: "Is there a mobile app?", a: "The web app is a fully responsive PWA and works beautifully on mobile. Native iOS and Android apps are on the roadmap for Q2." },
  { q: "How is my data protected?", a: "End-to-end encrypted storage, SOC 2 Type II in progress, GDPR compliant. You can export or delete all your data at any time." },
];

export default function Landing() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 overflow-x-hidden font-sans relative">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#ffffff"
      />
      {/* Full Page PixelBlast Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B497CF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-target" data-testid="nav-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold tracking-tight text-lg">TaskSync</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-mono">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }} className="hover:text-white transition-colors cursor-target">Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection("pricing"); }} className="hover:text-white transition-colors cursor-target">Pricing</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection("faq"); }} className="hover:text-white transition-colors cursor-target">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-semibold hover:text-white transition-colors cursor-target">Sign in</Link>
            <Link to="/register">
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold cursor-target">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content Wrapper */}
      <div className="relative z-10 pointer-events-none">

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 mesh-hero opacity-40 pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center z-10 pointer-events-none">

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto pointer-events-auto"
          >
            TaskSync organises your work in natural language, plans your day intelligently, and turns intent into progress — <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400">faster than any tool you've used.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
          >
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-base gap-2 group cursor-target">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/10 hover:bg-white/5 font-semibold text-base cursor-target">
              Book a demo
            </Button>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative pointer-events-auto"
          >
            <BorderGlow
              className="w-full h-full"
              backgroundColor="#0a0a0c"
              glowColor="250 80 80"
              edgeSensitivity={50}
              glowIntensity={0.8}
            >
              <div className="relative rounded-2xl bg-black/60 backdrop-blur-xl overflow-hidden h-full">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-4 text-xs text-zinc-500 font-mono">tasksync.app / dashboard</span>
                </div>
                <div className="grid grid-cols-12 gap-4 p-6 text-left">
                  <div className="col-span-3 space-y-2 font-mono">
                    {["Dashboard", "Tasks", "Calendar", "Analytics", "Insights"].map((x, i) => (
                      <div key={x} className={`text-xs px-3 py-2 rounded-md ${i===0?"bg-white/10 text-white":"text-zinc-500"}`}>{x}</div>
                    ))}
                  </div>
                  <div className="col-span-9 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {[["Productivity","87"],["Focus (h)","3.2"],["Streak","12d"]].map(([l,v]) => (
                        <div key={l} className="rounded-lg border border-white/5 p-3">
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{l}</div>
                          <div className="mt-1 text-xl font-display font-bold text-white">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-white/5 p-3 space-y-2">
                      {["Ship TaskSync launch","Review Q1 analytics","30-min run","Study DSA"].map((t,i)=>(
                        <div key={t} className="flex items-center gap-3 text-sm">
                          <div className={`w-4 h-4 rounded-full border ${i<2?"bg-indigo-500 border-indigo-500":"border-zinc-600"}`} />
                          <span className={i<2?"text-zinc-500 line-through":"text-zinc-200"}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </section>

      {/* --- REST OF THE PAGE --- */}
      <div className="relative bg-[#0A0A0C]">
        <div className="absolute inset-0 z-0 pointer-events-auto opacity-70">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B497CF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        
        <div className="relative z-10">
          {/* STATS */}
          <section className="relative px-6 py-20 border-y border-white/5 pointer-events-auto bg-black overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50">
              <Threads amplitude={1} distance={0} enableMouseInteraction={true} color={[1, 1, 1]} />
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-display font-bold text-white"><Counter to={s.value} suffix={s.suffix} /></div>
              <div className="mt-3 text-xs sm:text-sm text-zinc-300 font-mono bg-black/60 backdrop-blur-md inline-block px-3 py-1.5 rounded-full border border-white/10">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-24 pointer-events-auto scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Features</div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight">Everything you'd expect.<br/><span className="text-zinc-500">And more.</span></h2>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <BorderGlow
                key={f.title}
                className="w-full h-full"
                backgroundColor="#0a0a0c"
                glowColor="250 80 80"
                edgeSensitivity={30}
              >
                <div className={`relative rounded-xl bg-gradient-to-br ${f.tint} bg-black/40 backdrop-blur-md p-6 h-full flex flex-col transition-colors`}>
                  <f.icon className="w-5 h-5 text-indigo-400" />
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.body}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-24 border-t border-white/5 pointer-events-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Loved by teams</div>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight">Trusted by 40,000+ makers</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <BorderGlow
                key={t.name}
                className="w-full h-full"
                backgroundColor="#0a0a0c"
                glowColor="220 50 50"
                edgeSensitivity={30}
              >
                <div className="relative rounded-xl p-6 bg-black/40 backdrop-blur-md h-full flex flex-col">
                  <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                    {Array.from({length:5}).map((_,i)=><Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm flex-1">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-zinc-500 font-mono">{t.role}</div>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24 border-t border-white/5 pointer-events-auto scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Pricing</div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight">Simple, fair pricing</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((t) => (
              <BorderGlow
                key={t.name}
                className="w-full h-full"
                backgroundColor="#0a0a0c"
                glowColor={t.featured ? "268 100 76" : "220 50 50"}
                edgeSensitivity={t.featured ? 60 : 30}
                glowIntensity={t.featured ? 2.0 : 1.0}
                animated={t.featured}
              >
                <div className={`relative rounded-2xl p-8 backdrop-blur-md h-full flex flex-col ${t.featured?"bg-indigo-500/10 bg-black/40":"bg-black/40"}`}>
                  {t.featured && <div className="absolute -top-3 left-8 text-[10px] font-mono uppercase tracking-wider bg-indigo-500 text-white px-2.5 py-0.5 rounded-full z-10">Most popular</div>}
                  <div className="font-display text-xl font-bold text-white">{t.name}</div>
                  <div className="mt-4 flex items-baseline gap-1.5 font-mono">
                    <div className="font-display text-4xl font-bold text-white">{t.price}</div>
                    <div className="text-sm text-zinc-500">{t.period}</div>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm text-zinc-300 flex-1">
                    {t.features.map((f)=>(
                      <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> {f}</li>
                    ))}
                  </ul>
                  <Link to="/register" data-testid={`pricing-cta-${t.name.toLowerCase()}`}>
                    <Button className={`mt-8 w-full rounded-full font-semibold ${t.featured?"bg-white text-black hover:bg-zinc-200":"bg-white/5 hover:bg-white/10 text-white"}`}>{t.cta}</Button>
                  </Link>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24 border-t border-white/5 pointer-events-auto scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider">FAQ</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f,i)=>(
              <AccordionItem key={i} value={`i${i}`} className="border-white/5 bg-black/40 backdrop-blur-md rounded-xl px-6">
                <AccordionTrigger data-testid={`faq-${i}`} className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-zinc-400">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-white/5 pointer-events-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-display text-white font-semibold">TaskSync</span>
            <span className="ml-4">© 2026 · The engineering command center</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Share2 className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
      </div>
      </div>
    </div>
    </div>
  );
}

