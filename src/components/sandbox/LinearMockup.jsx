import React, { useState } from 'react';
import { 
  DEMO_ISSUES, LINEAR_HERO_TABS 
} from '../data/inspirationData';
import { 
  Search, Plus, Filter, Command, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, User, MoreHorizontal, Flame, Sparkles, 
  LayoutList, Compass, Layers, BarChart2
} from 'lucide-react';

export default function LinearMockup() {
  const [activeTab, setActiveTab] = useState('issues');
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState(DEMO_ISSUES);
  const [showHotkeyNotice, setShowHotkeyNotice] = useState(false);

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        const nextStatus = issue.status === 'Done' ? 'In Progress' : 'Done';
        return { ...issue, status: nextStatus };
      }
      return issue;
    }));
  };

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#09090b]/90 shadow-2xl shadow-indigo-500/10 overflow-hidden backdrop-blur-xl group">
      
      {/* Decorative Glow Line Header */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

      {/* Top Window Bar (Chrome) */}
      <div className="h-11 px-4 bg-[#0d0d10] border-b border-white/10 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
          </div>
          <span className="text-zinc-400 ml-3 hidden sm:inline">Linear Workspace /</span>
          <span className="text-zinc-200 font-semibold">2026-design-system</span>
        </div>

        {/* Dense Action Hotkeys */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHotkeyNotice(!showHotkeyNotice)}
            className="flex items-center gap-1 text-[11px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>Hotkeys On</span>
          </button>
          <div className="hidden md:flex items-center gap-1 text-zinc-400 text-[10px]">
            <kbd className="bg-white/5 border border-white/10 px-1 rounded">C</kbd> New Issue
            <span className="mx-1">•</span>
            <kbd className="bg-white/5 border border-white/10 px-1 rounded">⌘K</kbd> Command Bar
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[420px]">
        
        {/* Compact Sidebar */}
        <div className="md:col-span-3 bg-[#0c0c0f] p-3 text-xs flex flex-col justify-between">
          <div>
            <div className="px-2 py-1.5 mb-2 flex items-center justify-between text-zinc-400 font-mono text-[10px] tracking-wider uppercase">
              <span>Views</span>
              <Plus className="w-3.5 h-3.5 text-zinc-500 hover:text-white cursor-pointer" />
            </div>

            <div className="space-y-0.5">
              <button 
                onClick={() => setActiveTab('issues')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                  activeTab === 'issues' ? 'bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <LayoutList className="w-4 h-4 text-indigo-400" />
                <span>All Issues</span>
                <span className="ml-auto font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">42</span>
              </button>

              <button 
                onClick={() => setActiveTab('cycles')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                  activeTab === 'cycles' ? 'bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Active Cycle 42</span>
                <span className="ml-auto text-[10px] text-emerald-400 font-mono">84%</span>
              </button>

              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                  activeTab === 'roadmap' ? 'bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Product Roadmap</span>
              </button>

              <button 
                onClick={() => setActiveTab('insights')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                  activeTab === 'insights' ? 'bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Velocity Analytics</span>
              </button>
            </div>
          </div>

          {/* User Profile Mini */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 px-2 text-zinc-400 text-[11px]">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[9px]">
              RK
            </div>
            <span className="truncate text-zinc-200 font-medium">rajat@saasdesign.ui</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-auto" />
          </div>
        </div>

        {/* Main Content View */}
        <div className="md:col-span-9 bg-[#09090b] flex flex-col justify-between">
          
          {/* Subheader Filter Bar */}
          <div className="p-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0d0d10]/50">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter issues by key, label, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#121215] border border-white/10 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400">Sort: Priority</span>
              <button className="p-1.5 rounded-lg bg-[#121215] border border-white/10 text-zinc-400 hover:text-white">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* View Content Switcher */}
          <div className="p-4 flex-1">
            {activeTab === 'issues' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/5 px-2">
                  <span>ISSUE ID & TITLE</span>
                  <span className="hidden sm:inline">PRIORITY / ASSIGNEE</span>
                </div>

                {filteredIssues.map((issue) => (
                  <div 
                    key={issue.id}
                    onClick={() => toggleStatus(issue.id)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#121215]/80 hover:bg-[#18181c] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          issue.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'border border-zinc-600 group-hover:border-indigo-400'
                        }`}
                      >
                        {issue.status === 'Done' && <CheckCircle2 className="w-3 h-3" />}
                      </button>

                      <span className="font-mono text-xs text-indigo-400 group-hover:underline">
                        {issue.id}
                      </span>

                      <span className={`text-xs ${issue.status === 'Done' ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'}`}>
                        {issue.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10">
                        {issue.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        issue.priority === 'Urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        issue.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                        {issue.assignee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cycles' && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">Active Cycle 42 Progress</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  18 issues completed out of 22 planned. Next deployment scheduled for Thursday 14:00 UTC.
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 max-w-sm mx-auto overflow-hidden">
                  <div className="bg-amber-400 h-2 rounded-full w-[84%]" />
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">Q3 Product Roadmap</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  True-gray token refactoring, dark safe charts engine, and multi-workspace support.
                </p>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-[#121215] rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Velocity Score</span>
                    <div className="text-lg font-mono font-bold text-white mt-1">99.4%</div>
                  </div>
                  <div className="p-3 bg-[#121215] rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Avg Cycle Time</span>
                    <div className="text-lg font-mono font-bold text-emerald-400 mt-1">1.8 Days</div>
                  </div>
                  <div className="p-3 bg-[#121215] rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Open Bugs</span>
                    <div className="text-lg font-mono font-bold text-indigo-400 mt-1">0 Critical</div>
                  </div>
                </div>

                {/* Dark Safe SVG Chart */}
                <div className="p-3 bg-[#121215] rounded-xl border border-white/10">
                  <span className="text-xs font-mono text-zinc-400 block mb-2">SPRINT VELOCITY (LAST 8 WEEKS)</span>
                  <svg className="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,70 Q60,30 120,50 T240,20 T360,40 T480,10 T600,25 L600,90 L0,90 Z"
                      fill="url(#glowArea)"
                    />
                    <path
                      d="M0,70 Q60,30 120,50 T240,20 T360,40 T480,10 T600,25"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Info */}
          <div className="px-4 py-2 bg-[#0d0d10] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Showing {filteredIssues.length} issues</span>
            <span className="text-indigo-400">Click any issue to toggle status</span>
          </div>

        </div>
      </div>
    </div>
  );
}
