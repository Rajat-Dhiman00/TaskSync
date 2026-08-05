import React from 'react';
import { Terminal, Globe, Share2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#09090b] border-t border-white/10 pt-16 pb-12 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white text-sm">SaaSDesign.ui</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Curated 2026 SaaS dark-mode benchmarks, Godly alternatives directory, and Linear-style component architecture.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded w-fit border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEMS 100% OPERATIONAL</span>
            </div>
          </div>

          {/* Godly Alternatives */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider font-mono">Inspiration Sites</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="https://www.saasframe.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">SaaSFrame</a></li>
              <li><a href="https://saaspo.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Saaspo</a></li>
              <li><a href="https://land-book.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Land-book</a></li>
              <li><a href="https://landingfolio.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Landingfolio</a></li>
              <li><a href="https://linear.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Linear.app</a></li>
            </ul>
          </div>

          {/* Design Rules */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider font-mono">2026 Dark Rules</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#patterns" className="hover:text-white transition-colors">True-Gray Base Surfaces</a></li>
              <li><a href="#patterns" className="hover:text-white transition-colors">Surface Elevation Fill Steps</a></li>
              <li><a href="#patterns" className="hover:text-white transition-colors">Controlled Accent Color</a></li>
              <li><a href="#patterns" className="hover:text-white transition-colors">Dense Chrome Layouts</a></li>
              <li><a href="#patterns" className="hover:text-white transition-colors">Dark-Safe SVG Charts</a></li>
            </ul>
          </div>

          {/* Builders & Stack */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider font-mono">Stack & Builders</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#sandbox" className="hover:text-white transition-colors">Framer No-Code</a></li>
              <li><a href="#sandbox" className="hover:text-white transition-colors">Webflow SaaS</a></li>
              <li><a href="#sandbox" className="hover:text-white transition-colors">Vite + React 19</a></li>
              <li><a href="#sandbox" className="hover:text-white transition-colors">Tailwind CSS + HSL Tokens</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            © 2026 SaaSDesign.ui • Built with Linear aesthetic & dark-first principles.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for SaaS Founders
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
