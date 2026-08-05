import React, { useState } from 'react';
import { Layout, Table, Grid, Cpu, Code, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function LayoutSandbox() {
  const [activeLayout, setActiveLayout] = useState('linear');
  const [copied, setCopied] = useState(false);

  const layouts = [
    { id: 'linear', name: 'Linear Hero Layout', icon: Layout, desc: 'Product-in-hero with outcome headline & dense chrome' },
    { id: 'bento', name: 'Bento Grid System', icon: Grid, desc: 'Responsive 2026 Bento grid with 3D mesh visuals' },
    { id: 'stripe', name: 'Stripe Dense Data Table', icon: Table, desc: 'High-density tabular layout with JetBrains Mono numerals' },
    { id: 'attio', name: 'Attio AI Dashboard', icon: Cpu, desc: 'AI-native sidebar structure & smart relationship cards' }
  ];

  const getSnippet = () => {
    switch(activeLayout) {
      case 'linear':
        return `<div className="bg-[#0A0A0C] text-[#EDEDED] p-8 rounded-2xl border border-white/10 font-sans">
  {/* Linear Outcome-Led Hero */}
  <h1 className="text-5xl font-heading font-extrabold tracking-tight">Show, don't tell.</h1>
  <div className="mt-6 rounded-xl bg-[#121215] border border-white/10 p-4 font-mono text-xs">
    {/* Product UI Mockup */}
  </div>
</div>`;
      case 'bento':
        return `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0A0A0C] p-6">
  <div className="md:col-span-2 bg-[#121215] p-6 rounded-2xl border border-white/10">Card 1</div>
  <div className="bg-[#121215] p-6 rounded-2xl border border-white/10">Card 2</div>
</div>`;
      case 'stripe':
        return `<table className="w-full text-xs font-mono bg-[#121215] border border-white/10 rounded-xl">
  <tr className="border-b border-white/10 text-[#A1A1AA]"><th>TRANSACTION</th><th>AMOUNT</th></tr>
  <tr className="border-b border-white/5"><td className="tabular-nums">$1,480.00</td></tr>
</table>`;
      case 'attio':
        return `<div className="flex bg-[#0A0A0C] text-xs">
  <aside className="w-64 bg-[#121215] border-r border-white/10 p-4 font-mono">AI Workspace</aside>
  <main className="flex-1 p-6">Main Records</main>
</div>`;
      default: return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSnippet());
    setCopied(true);
    toast.success(`Copied ${activeLayout.toUpperCase()} React layout code!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sandbox" className="py-28 bg-[#0A0A0C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5E43F3]/15 text-[#7158F5] border border-[#5E43F3]/30 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE LAYOUT SANDBOX</span>
          </div>
          <h2 
            data-testid="sandbox-heading"
            className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-[#EDEDED]"
          >
            2026 SaaS Archetype Switcher
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-sm sm:text-base leading-relaxed">
            Toggle between the top SaaS layout structures used by Linear, Stripe, and Attio. Inspect density and copy starter code.
          </p>
        </div>

        {/* Tab Selector Bar */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {layouts.map((item) => {
            const Icon = item.icon;
            const isActive = activeLayout === item.id;
            return (
              <button
                key={item.id}
                data-testid={`sandbox-tab-${item.id}`}
                onClick={() => setActiveLayout(item.id)}
                className={`p-4 rounded-xl text-left border transition-colors ${
                  isActive 
                    ? 'bg-[#121215] border-[#5E43F3]/60 shadow-xl ring-1 ring-[#5E43F3]/30'
                    : 'bg-[#121215]/50 border-white/10 hover:border-white/20 text-[#A1A1AA] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#5E43F3]/20 text-[#7158F5]' : 'bg-white/5 text-[#A1A1AA]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-heading font-semibold ${isActive ? 'text-white' : 'text-[#EDEDED]'}`}>{item.name}</span>
                </div>
                <p className="mt-2 text-xs text-[#A1A1AA] leading-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Sandbox Panel */}
        <div className="mt-8 rounded-2xl bg-[#121215] border border-white/10 overflow-hidden shadow-2xl p-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-[#EDEDED]">
              <Code className="w-4 h-4 text-[#5E43F3]" />
              <span>LIVE PREVIEW: <strong className="text-white uppercase">{activeLayout}</strong></span>
            </div>
            <button
              onClick={handleCopy}
              data-testid="copy-sandbox-code-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5E43F3]/15 hover:bg-[#5E43F3]/30 text-[#7158F5] border border-[#5E43F3]/30 text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Layout Code!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-[#0A0A0C] border border-white/10 min-h-[280px] flex items-center justify-center">
            
            {activeLayout === 'linear' && (
              <div className="w-full max-w-xl p-6 bg-[#121215] rounded-xl border border-white/10 text-center space-y-4">
                <span className="px-2.5 py-1 rounded bg-[#5E43F3]/15 text-[#7158F5] text-xs font-mono">Product-In-Hero Archetype</span>
                <h3 className="text-2xl font-heading font-bold text-white">The System for Product Development</h3>
                <div className="p-4 bg-[#0A0A0C] rounded-lg border border-white/5 font-mono text-xs text-left text-[#A1A1AA]">
                  <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[#7158F5]">LIN-2026</span>
                    <span>High Contrast Monospace Data</span>
                  </div>
                  <div className="flex justify-between text-[#EDEDED]">
                    <span>Status: In Progress</span>
                    <span className="text-[#10B981]">Velocity +14.2%</span>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'bento' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative p-4 bg-[#121215] rounded-xl border border-white/10 overflow-hidden min-h-[140px] flex flex-col justify-between">
                  <img 
                    src="https://images.pexels.com/photos/28428584/pexels-photo-28428584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                    alt="Feature Visual"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="relative z-10">
                    <span className="text-[10px] font-mono text-[#A1A1AA]">3D GEOMETRIC BENTO VISUAL</span>
                    <h4 className="text-sm font-heading font-bold text-white mt-1">Abstract 2026 Surface Design</h4>
                  </div>
                </div>
                <div className="p-4 bg-[#121215] rounded-xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-[#A1A1AA]">METRIC BENTO</span>
                  <div className="text-xl font-mono font-bold text-white">$148,920</div>
                  <div className="text-xs text-[#10B981] font-mono">+24% vs Q2</div>
                </div>
              </div>
            )}

            {activeLayout === 'stripe' && (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[#A1A1AA] bg-[#121215]">
                      <th className="p-3">TRANSACTION ID</th>
                      <th className="p-3">CUSTOMER</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#EDEDED]">
                    <tr>
                      <td className="p-3 text-[#7158F5]">ch_3N82xL2eZvKY</td>
                      <td className="p-3">Linear Corp</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981]">Succeeded</span></td>
                      <td className="p-3 font-bold text-white tabular-nums">$12,450.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#7158F5]">ch_3N82yM9fWxPZ</td>
                      <td className="p-3">Attio Inc</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981]">Succeeded</span></td>
                      <td className="p-3 font-bold text-white tabular-nums">$8,900.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeLayout === 'attio' && (
              <div className="w-full flex gap-3 text-xs">
                <div className="w-44 p-3 bg-[#121215] rounded-xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-[#7158F5]">AI PROMPT SIDEBAR</span>
                  <div className="p-2 bg-[#0A0A0C] rounded border border-white/5 text-[11px] text-[#A1A1AA]">
                    "Find high velocity SaaS deals in Q3..."
                  </div>
                </div>
                <div className="flex-1 p-3 bg-[#121215] rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-[#A1A1AA] block mb-2">SMART RELATIONSHIPS</span>
                  <div className="p-2 bg-[#0A0A0C] rounded border border-white/5 text-[#EDEDED]">
                    Stripe SaaS • ARR $4.2M • Health Score 98%
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
