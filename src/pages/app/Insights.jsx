import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, TrendingDown, Lightbulb, Activity, Brain, Battery, Flame, RefreshCcw } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const focusData = [
  { time: '6 AM', focus: 30, energy: 40 },
  { time: '9 AM', focus: 85, energy: 90 },
  { time: '12 PM', focus: 65, energy: 70 },
  { time: '3 PM', focus: 45, energy: 50 },
  { time: '6 PM', focus: 95, energy: 80 }, // Evening spike
  { time: '9 PM', focus: 50, energy: 40 },
];

const priorityQueue = [
  { title: "Ship TaskSync v1 launch", reason: "Urgent milestone deadline", impact: "High", color: "text-rose-400", bg: "bg-rose-500/10" },
  { title: "Study DSA — Dynamic Programming", reason: "Cognitive peak approaches at 6PM", impact: "High", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { title: "Review Q1 analytics dashboard", reason: "Blocked by 2 other tasks", impact: "Medium", color: "text-emerald-400", bg: "bg-emerald-500/10" }
];

export default function Insights() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial AI loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("AI Insights refreshed based on latest activity.");
    }, 1200);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121629] border border-white/10 p-3 rounded-xl shadow-2xl font-mono text-xs">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map(p => (
            <div key={p.dataKey} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-zinc-400 capitalize">{p.name}:</span>
              <span className="text-white font-bold">{p.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full animate-pulse" />
        </div>
        <p className="font-mono text-xs text-indigo-300 animate-pulse tracking-widest uppercase">Synthesizing Neural Patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12 animate-in fade-in zoom-in-95 duration-500" data-testid="insights-page">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 theme-card border theme-border rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Brain className="w-6 h-6 text-fuchsia-400" /> Predictive AI Insights
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Real-time cognitive and productivity analysis.</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 font-mono text-xs text-zinc-300 rounded-xl">
          <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Recalculate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Focus Prediction (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-card border theme-border rounded-3xl p-6 relative group hover:border-indigo-500/30 transition-all shadow-xl flex flex-col min-h-[340px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-indigo-400" /> Focus & Energy Prediction
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono">Based on your last 14 days of activity patterns.</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Focus</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500" /> Energy</div>
              </div>
            </div>
            
            <div className="flex-1 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={focusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="energy" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
                  <Area type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p>Your cognitive peak is predicted around <strong>6:00 PM today</strong>. Reserve this block for high-complexity tasks like DSA or System Design.</p>
            </div>
          </div>
          
          {/* Pattern Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="theme-card border theme-border rounded-3xl p-5 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingUp className="w-3.5 h-3.5" /> Identified Strengths
              </h3>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex gap-3 text-zinc-300"><span className="text-emerald-500 font-bold">→</span> Consistent 14-day completion streak</li>
                <li className="flex gap-3 text-zinc-300"><span className="text-emerald-500 font-bold">→</span> 99.4% SLA on urgent priority items</li>
                <li className="flex gap-3 text-zinc-300"><span className="text-emerald-500 font-bold">→</span> High focus time density in evenings</li>
              </ul>
            </div>
            <div className="theme-card border theme-border rounded-3xl p-5 bg-gradient-to-br from-rose-500/10 to-transparent">
              <h3 className="text-[11px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingDown className="w-3.5 h-3.5" /> Areas to Optimize
              </h3>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex gap-3 text-zinc-300"><span className="text-rose-500 font-bold">→</span> High context switching between 1 PM - 3 PM</li>
                <li className="flex gap-3 text-zinc-300"><span className="text-rose-500 font-bold">→</span> Over-committing to low priority tasks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Col: Priority Queue & Burnout */}
        <div className="space-y-6">
          
          {/* Burnout Risk Gauge */}
          <div className="theme-card border theme-border rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-xl overflow-hidden min-h-[220px]">
            <div className="absolute top-0 right-0 p-4">
              <Battery className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 w-full text-left">Cognitive Load</h3>
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={8} data={[{ name: 'Load', value: 72, fill: '#f97316' }]} startAngle={180} endAngle={0}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center -mt-6">
                <span className="text-3xl font-bold text-orange-400">72<span className="text-lg text-orange-500/50">%</span></span>
                <span className="text-[9px] text-orange-400/70 uppercase tracking-widest mt-1">Elevated</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-mono text-center -mt-4">
              You've logged 6 hours of deep work today. Consider a 15-minute break soon to prevent burnout.
            </p>
          </div>

          {/* Smart Priority Queue */}
          <div className="theme-card border theme-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-amber-400" /> Smart Priority Queue
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mb-4">AI optimized execution path based on dependencies and your energy levels.</p>
            
            <div className="space-y-3 flex-1">
              {priorityQueue.map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl border border-white/5 ${item.bg} relative overflow-hidden group`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white pr-8">{item.title}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/10 ${item.color} bg-black/20 absolute top-3 right-3`}>
                      {item.impact}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className={`w-3 h-3 ${item.color} mt-0.5 shrink-0`} />
                    <span className="text-[11px] text-zinc-400 leading-relaxed font-mono">{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
