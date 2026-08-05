import React, { useState } from 'react';
import { DARK_MODE_PATTERNS_2026 } from '../../data/inspirationData';
import { Sparkles, Copy, Check, Layers, Box, Zap, LayoutGrid, Type, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function DarkModeGuide2026() {
  const [activePatternId, setActivePatternId] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const getIcon = (name) => {
    switch(name) {
      case 'Layers': return <Layers className="w-5 h-5 text-[#5E43F3]" />;
      case 'Box': return <Box className="w-5 h-5 text-[#F59E0B]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'LayoutGrid': return <LayoutGrid className="w-5 h-5 text-cyan-400" />;
      case 'Type': return <Type className="w-5 h-5 text-[#10B981]" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-[#F43F5E]" />;
      default: return <Sparkles className="w-5 h-5 text-[#5E43F3]" />;
    }
  };

  const activePattern = DARK_MODE_PATTERNS_2026.find(p => p.id === activePatternId);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Copied Rule 0${id} Token Specs!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="patterns" className="py-28 bg-[#0A0A0C] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 DESIGN SPECIFICATION</span>
          </div>
          <h2 
            data-testid="patterns-heading"
            className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-[#EDEDED]"
          >
            Dark Mode Dashboard Patterns
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-sm sm:text-base leading-relaxed">
            Dark mode is a first-class visual language, not an inverted light theme. Explore the 6 foundational rules for modern SaaS dashboards.
          </p>
        </div>

        {/* Pattern Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Rule Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {DARK_MODE_PATTERNS_2026.map((pattern) => (
              <button
                key={pattern.id}
                data-testid={`pattern-rule-${pattern.id}`}
                onClick={() => setActivePatternId(pattern.id)}
                className={`w-full text-left p-4 rounded-xl transition-colors border flex items-start gap-4 ${
                  activePatternId === pattern.id
                    ? 'bg-[#121215] border-[#5E43F3]/60 shadow-xl shadow-[#5E43F3]/10 ring-1 ring-[#5E43F3]/30'
                    : 'bg-[#121215]/50 border-white/5 hover:border-white/15 hover:bg-[#121215]'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-[#1A1A1E] border border-white/10 shrink-0">
                  {getIcon(pattern.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#A1A1AA]">
                      Rule 0{pattern.id}
                    </span>
                    <h3 className="text-sm font-heading font-semibold text-white truncate">{pattern.title}</h3>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-1">{pattern.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Rule Inspector Panel */}
          <div className="lg:col-span-7 bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#5E43F3]/15 border border-[#5E43F3]/30 text-[#7158F5]">
                  {getIcon(activePattern.icon)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#7158F5] tracking-wider uppercase">RULE 0{activePattern.id} SPEC</span>
                  <h3 className="text-xl font-heading font-bold text-white">{activePattern.title}</h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Verified 2026
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#EDEDED] leading-relaxed">
              {activePattern.description}
            </p>

            {/* Code Block */}
            <div className="relative rounded-xl bg-[#0A0A0C] border border-white/10 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-white/10 text-[11px] text-[#A1A1AA]">
                <span>Token Implementation</span>
                <button
                  onClick={() => copyCode(activePattern.codeSnippet, activePattern.id)}
                  data-testid={`copy-code-btn-${activePattern.id}`}
                  className="flex items-center gap-1 text-[#7158F5] hover:text-white transition-colors"
                >
                  {copiedId === activePattern.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === activePattern.id ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 text-[#EDEDED] overflow-x-auto whitespace-pre-wrap">
                {activePattern.codeSnippet}
              </pre>
            </div>

            {/* Visual Good vs Bad Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs">
                <span className="text-[#F43F5E] font-mono font-bold block mb-1">❌ What to Avoid:</span>
                <p className="text-[#A1A1AA]">{activePattern.exampleBad}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs">
                <span className="text-[#10B981] font-mono font-bold block mb-1">✅ 2026 Best Practice:</span>
                <p className="text-[#EDEDED]">{activePattern.exampleGood}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
