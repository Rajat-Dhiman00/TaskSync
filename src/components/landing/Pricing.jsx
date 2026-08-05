import React, { useState } from 'react';
import { Check, Sparkles, Star } from 'lucide-react';

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "VP of Product, DevFlow",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4NTc5MTk2Nnww&ixlib=rb-4.1.0&q=85",
      quote: "The 2026 dark mode tokens and surface elevation rules transformed our entire frontend build."
    },
    {
      name: "Elena Rostova",
      role: "Lead UI Designer, Linear Stack",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4NTc5MTk2Nnww&ixlib=rb-4.1.0&q=85",
      quote: "Using the true-gray #0A0A0C base with Outfit headings gave us an instant premium aesthetic."
    },
    {
      name: "David Chen",
      role: "Founder, SaaSFrame",
      avatar: "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      quote: "The best collection of Godly alternatives and high-contrast dark dashboard specifications."
    }
  ];

  return (
    <section id="pricing" className="py-28 bg-[#0A0A0C] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-[#7158F5] uppercase tracking-wider">COMMUNITY REVIEWS</span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">Trusted by 2,400+ SaaS Founders</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#EDEDED] leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-white/15" />
                  <div>
                    <h4 className="text-xs font-heading font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] text-[#A1A1AA] font-mono">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5E43F3]/15 text-[#7158F5] border border-[#5E43F3]/30 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESIGN SYSTEM TIERS</span>
          </div>
          <h2 
            data-testid="pricing-heading"
            className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-[#EDEDED]"
          >
            Simple, Transparent Access
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-sm sm:text-base leading-relaxed">
            Get instant access to 2026 dark mode tokens, Godly alternatives directory specs, and component primitives.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#121215] border border-white/10 text-xs font-medium">
            <button
              onClick={() => setAnnual(false)}
              data-testid="pricing-monthly-btn"
              className={`px-4 py-1.5 rounded-full transition-colors ${!annual ? 'bg-[#5E43F3] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              data-testid="pricing-annual-btn"
              className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${annual ? 'bg-[#5E43F3] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-mono px-1.5 py-0.5 rounded border border-[#10B981]/30">Save 25%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Free Tier */}
          <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#A1A1AA]">DEVELOPER STARTER</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1">Free Explorer</h3>
              <p className="text-xs text-[#A1A1AA] mt-2">Perfect for browsing Godly alternatives and basic design tokens.</p>
              
              <div className="mt-6 font-mono">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-xs text-[#A1A1AA]"> / forever</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-[#EDEDED]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Access Godly Alternatives Directory</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Basic HSL Theme CSS Tokens</span>
                </li>
              </ul>
            </div>

            <button 
              data-testid="pricing-free-plan-btn"
              className="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Architect Tier */}
          <div className="relative rounded-2xl bg-[#121215] border-2 border-[#5E43F3] p-6 flex flex-col justify-between shadow-2xl shadow-[#5E43F3]/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#5E43F3] text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-lg">
              MOST POPULAR 2026
            </div>

            <div>
              <span className="text-xs font-mono text-[#7158F5]">FULL DESIGN SYSTEM</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1">Pro Architect</h3>
              <p className="text-xs text-[#A1A1AA] mt-2">Complete set of Linear dark mode components, charts, and sandbox presets.</p>
              
              <div className="mt-6 font-mono">
                <span className="text-4xl font-bold text-white">{annual ? '$29' : '$39'}</span>
                <span className="text-xs text-[#A1A1AA]"> / month {annual && '(annual)'}</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-[#EDEDED]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7158F5]" />
                  <span className="font-semibold">All 6 Dark Mode Dashboard Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7158F5]" />
                  <span>Copyable Tailwind + React Component Snippets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7158F5]" />
                  <span>Dark-Safe SVG Chart Gradient Templates</span>
                </li>
              </ul>
            </div>

            <button 
              data-testid="pricing-pro-plan-btn"
              className="mt-8 w-full py-2.5 rounded-full bg-[#5E43F3] hover:bg-[#7158F5] text-white font-semibold text-xs transition-colors shadow-lg shadow-[#5E43F3]/30 border border-white/20"
            >
              Get Pro Access
            </button>
          </div>

          {/* Scale Team Tier */}
          <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#A1A1AA]">TEAM & ENTERPRISE</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1">Scale Team</h3>
              <p className="text-xs text-[#A1A1AA] mt-2">For engineering teams building multi-tenant SaaS products.</p>
              
              <div className="mt-6 font-mono">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-xs text-[#A1A1AA]"> / month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-[#EDEDED]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Unlimited Team Seats</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>White-Label Color Token Engine</span>
                </li>
              </ul>
            </div>

            <button 
              data-testid="pricing-enterprise-plan-btn"
              className="mt-8 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Contact Sales
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
