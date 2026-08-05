import React, { useState } from 'react';
import { GODLY_ALTERNATIVES } from '../../data/inspirationData';
import { Search, ExternalLink, Star, Sparkles, Filter, CheckCircle, Tag, Eye } from 'lucide-react';

export default function GodlyDirectory({ externalSearch, setExternalSearch }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = ['All', 'Landing page inspiration', 'Linear-style aesthetic', 'Broader SaaS UI inspiration', 'No-code landing page builders'];

  const searchVal = externalSearch !== undefined ? externalSearch : '';
  const setSearchVal = setExternalSearch || (() => {});

  const filteredItems = GODLY_ALTERNATIVES.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchVal.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="directory" className="py-28 bg-[#0A0A0C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5E43F3]/15 text-[#7158F5] border border-[#5E43F3]/30 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 CURATED DIRECTORY</span>
          </div>
          <h2 
            data-testid="directory-heading"
            className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-[#EDEDED]"
          >
            Godly Alternatives & SaaS Inspiration
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-sm sm:text-base leading-relaxed">
            Find the strongest matches for Linear-style dark aesthetics, outcome-led headlines, and product-in-hero conversion layouts.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-12 space-y-4">
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              data-testid="directory-search-input"
              placeholder="Search by name, tag (e.g. Linear Dark, No-Code, SaaS UI), or keyword..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#121215] border border-white/10 rounded-xl text-sm text-[#EDEDED] placeholder-zinc-500 focus:outline-none focus:border-[#5E43F3] transition-colors font-mono shadow-xl"
            />
            {searchVal && (
              <button 
                onClick={() => setSearchVal('')}
                data-testid="clear-directory-search-btn"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A1A1AA] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                data-testid={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#5E43F3] text-white font-semibold shadow-lg shadow-[#5E43F3]/25'
                    : 'bg-[#121215] text-[#A1A1AA] hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Directory Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              data-testid={`directory-card-${item.id}`}
              className="group relative rounded-2xl bg-[#121215] border border-white/10 hover:border-[#5E43F3]/50 p-6 transition-colors duration-200 flex flex-col justify-between shadow-xl overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentColor}`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-[#7158F5]">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-[#EDEDED] group-hover:text-[#7158F5] transition-colors flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-xs font-mono font-normal text-[#A1A1AA]">[{item.type}]</span>
                </h3>

                <p className="mt-3 text-xs text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 space-y-1.5">
                  {item.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-[#EDEDED]">
                      <CheckCircle className="w-3 h-3 text-[#10B981] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1A1E] text-[#A1A1AA] border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalItem(item)}
                  data-testid={`preview-modal-btn-${item.id}`}
                  className="flex items-center gap-1 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Specs</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`visit-link-${item.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5E43F3]/15 hover:bg-[#5E43F3]/30 text-[#7158F5] border border-[#5E43F3]/30 text-xs font-medium transition-colors"
                >
                  <span>Visit {item.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal View */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#121215] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <span className="text-xs font-mono text-[#7158F5]">{activeModalItem.category}</span>
                  <h3 className="text-xl font-heading font-bold text-white">{activeModalItem.name}</h3>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  data-testid="close-modal-btn"
                  className="text-[#A1A1AA] hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#EDEDED] mb-4 leading-relaxed">{activeModalItem.description}</p>

              <div className="space-y-3 bg-[#0A0A0C] p-4 rounded-xl border border-white/10 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Rating Benchmark:</span>
                  <span className="text-amber-400 font-bold">{activeModalItem.rating} / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Pattern Type:</span>
                  <span className="text-white">Linear Dark / Product Hero</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Primary Target:</span>
                  <span className="text-white">Developer SaaS & Product Engineering</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#1A1A1E] text-[#EDEDED] text-xs hover:bg-zinc-800 transition-colors"
                >
                  Close
                </button>
                <a
                  href={activeModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#5E43F3] text-white text-xs font-medium hover:bg-[#7158F5] transition-colors flex items-center gap-1.5"
                >
                  <span>Open Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
