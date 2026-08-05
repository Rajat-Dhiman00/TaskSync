import React, { useState } from 'react';
import { ArrowRight, Sparkles, Wand2, CheckCircle2, Send } from 'lucide-react';
import LinearMockup from './LinearMockup';
import { toast } from 'sonner';

export default function Hero() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI token generator.');
      return;
    }
    setAiGenerated(true);
    toast.success('Generated 2026 True-Gray dark tokens & Linear UI archetype!');
    setTimeout(() => setAiGenerated(false), 4000);
  };

  return (
    <section className="relative pt-32 pb-28 sm:pb-36 overflow-hidden bg-[#0A0A0C] noise-overlay">
      
      {/* Mesh Blur Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-35 blur-[90px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1687392946857-96c2b7f94b0d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1lc2glMjBncmFkaWVudCUyMGRhcmslMjBtb2RlfGVufDB8fHx8MTc4NTc5MTk4MXww&ixlib=rb-4.1.0&q=85" 
          alt="AI Mesh Glow" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="flex justify-center">
          <div 
            data-testid="hero-top-badge"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121215] border border-white/10 text-xs font-medium text-[#EDEDED] shadow-xl hover:border-[#5E43F3]/40 transition-colors cursor-pointer group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E43F3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5E43F3]"></span>
            </span>
            <span className="text-[#A1A1AA] font-mono">2026 SPEC:</span>
            <span className="text-white font-semibold">Dark-First SaaS System & Godly Benchmark</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Headline */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <h1 
            data-testid="hero-headline"
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-[#EDEDED] leading-[1.08]"
          >
            Show, don't tell.{' '}
            <span className="bg-gradient-to-r from-[#5E43F3] via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Linear-Grade
            </span>{' '}
            SaaS dark UIs.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Curated 2026 dark mode design patterns, surface elevation tokens, Godly alternatives, and dense chrome benchmarks for modern product-led SaaS.
          </p>
        </div>

        {/* AI Magic Tracing Beam Input */}
        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleAiSubmit} className="tracing-beam-input shadow-2xl shadow-[#5E43F3]/20">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0C] rounded-full">
              <Wand2 className="w-4 h-4 text-[#5E43F3] shrink-0 animate-pulse" />
              <input
                type="text"
                data-testid="ai-tracing-beam-input"
                placeholder="Ask AI to generate dark SaaS design tokens or layout..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-transparent text-xs text-[#EDEDED] placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                data-testid="ai-tracing-beam-submit"
                className="px-4 py-1.5 rounded-full bg-[#5E43F3] hover:bg-[#7158F5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shrink-0"
              >
                <span>Generate</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {aiGenerated && (
            <div className="mt-3 p-3 rounded-xl bg-[#121215] border border-[#5E43F3]/40 text-xs font-mono text-[#10B981] flex items-center justify-between">
              <span>✓ Generated #0A0A0C true-gray tokens & Linear issue tracker view!</span>
              <span className="text-[10px] text-[#A1A1AA]">0.15s</span>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#directory"
            data-testid="hero-primary-cta"
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#5E43F3] hover:bg-[#7158F5] text-white font-semibold text-sm transition-colors shadow-xl shadow-[#5E43F3]/30 border border-white/20 group"
          >
            <span>Explore Godly Alternatives</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#patterns"
            data-testid="hero-secondary-cta"
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#121215] border border-white/10 text-white font-medium text-sm hover:bg-[#1A1A1E] hover:border-white/20 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>2026 Dark Patterns</span>
          </a>
        </div>

        {/* Social Proof Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A1A1AA] font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>True-Gray HSL Surfaces</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Outfit + JetBrains Mono Specs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Linear & Stripe Chrome</span>
          </div>
        </div>

        {/* Linear Mockup Widget */}
        <div className="mt-14">
          <LinearMockup />
        </div>

      </div>
    </section>
  );
}
