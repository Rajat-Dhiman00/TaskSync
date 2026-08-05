import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, Activity, Target, Zap, Clock, Sparkles, LayoutDashboard, ArrowRight, Cpu, Home 
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Button } from "@/components/ui/button";
import BorderGlow from "@/components/ui/BorderGlow";
import StrokeText from "@/components/ui/StrokeText";

const dsaData = [
  { name: 'Jan', solved: 30 },
  { name: 'Feb', solved: 45 },
  { name: 'Mar', solved: 55 },
  { name: 'Apr', solved: 85 },
  { name: 'May', solved: 110 },
  { name: 'Jun', solved: 150 },
];

const taskData = [
  { name: 'M', completed: 5 },
  { name: 'T', completed: 8 },
  { name: 'W', completed: 12 },
  { name: 'T', completed: 7 },
  { name: 'F', completed: 15 },
  { name: 'S', completed: 4 },
  { name: 'S', completed: 9 },
];

const radarData = [
  { subject: 'Arrays', A: 120, fullMark: 150 },
  { subject: 'Trees', A: 98, fullMark: 150 },
  { subject: 'DP', A: 86, fullMark: 150 },
  { subject: 'Graphs', A: 99, fullMark: 150 },
  { subject: 'Math', A: 85, fullMark: 150 },
  { subject: 'Strings', A: 65, fullMark: 150 },
];

const pieData = [
  { name: 'Focus', value: 45 },
  { name: 'Study', value: 30 },
  { name: 'Breaks', value: 15 },
  { name: 'Other', value: 10 },
];
const pieColors = ['#6366f1', '#a855f7', '#14b8a6', '#f59e0b'];

export default function Dashboard() {
  const navigate = useNavigate();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e2330] border border-white/10 p-2 rounded-lg shadow-xl text-xs font-mono">
          <span className="text-white font-bold">{payload[0].value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12 animate-in fade-in duration-500 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-3 -mb-2">
            <LayoutDashboard className="w-8 h-8 text-indigo-500 mb-4" /> 
            <div className="w-full max-w-[320px]">
              <StrokeText
                text="Overview"
                strokeColor="#6366f1"
                fillColor="#ffffff"
                strokeWidth={1.5}
                drawDuration={1.2}
                fontSize={48}
                fontWeight={800}
                letterSpacing={0}
              />
            </div>
          </div>
          <p className="text-xs font-mono theme-text-muted mt-0.5">
            Your personal command center. Click any widget to dive deeper.
          </p>
        </div>
      </div>

      {/* Hero Action Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Huge DSA Lab Card */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="250 80 80"
          backgroundColor="var(--bg2)"
          borderRadius={24}
          glowRadius={30}
          glowIntensity={1.0}
          coneSpread={25}
          animated={true}
          colors={['#818cf8', '#6366f1', '#4f46e5']}
          className="cursor-pointer shadow-xl h-full"
        >
          <div 
            onClick={() => navigate('/app/dsa')}
            className="p-6 relative overflow-hidden group flex items-center justify-between h-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[24px]"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-all" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2 mb-1">
                <Cpu className="w-5 h-5 text-indigo-400" /> Enter DSA Lab
              </h2>
              <p className="text-xs font-mono text-zinc-400">Launch your structured algorithm workspace</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </BorderGlow>

        {/* Huge Home Page Card */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="150 80 80"
          backgroundColor="var(--bg2)"
          borderRadius={24}
          glowRadius={30}
          glowIntensity={1.0}
          coneSpread={25}
          animated={true}
          colors={['#34d399', '#10b981', '#059669']}
          className="cursor-pointer shadow-xl h-full"
        >
          <div 
            onClick={() => navigate('/')}
            className="p-6 relative overflow-hidden group flex items-center justify-between h-full bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[24px]"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/30 transition-all" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2 mb-1">
                <Home className="w-5 h-5 text-emerald-400" /> Return Home
              </h2>
              <p className="text-xs font-mono text-zinc-400">Navigate back to the main website portal</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* Masonry Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* === LEFT COLUMN === */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-full">
          
          {/* Main Progress (Line Chart) -> Maps to DSA Lab */}
          <BorderGlow
            edgeSensitivity={30} glowColor="250 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#818cf8', '#6366f1', '#4f46e5']} className="flex-1 shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/dsa')} className="h-full w-full p-5 flex flex-col relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-indigo-400" /> DSA Progress</h3>
                  <div className="text-3xl font-bold theme-text">150</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">+40 this month</div>
                </div>
              </div>
              <div className="flex-1 w-full -ml-4 mt-auto min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dsaData}>
                    <defs>
                      <linearGradient id="colorDsa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="solved" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#1e1e2f" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>

          {/* Secondary Progress (Line Chart) -> Maps to Tasks */}
          <BorderGlow
            edgeSensitivity={30} glowColor="150 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#34d399', '#10b981', '#059669']} className="min-h-[160px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/tasks')} className="h-full w-full p-5 flex flex-col relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Task Velocity</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">+12%</span>
              </div>
              <div className="flex-1 w-full h-full -ml-4 min-h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskData}>
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Line type="stepAfter" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* === MIDDLE COLUMN === */}
        <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
          
          {/* Activity Bar Chart -> Maps to Analytics */}
          <BorderGlow
            edgeSensitivity={30} glowColor="190 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#22d3ee', '#06b6d4', '#0891b2']} className="min-h-[220px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/analytics')} className="h-full w-full p-5 flex flex-col relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyan-400" /> Weekly Activity</h3>
                  <div className="text-2xl font-bold theme-text">60<span className="text-sm text-zinc-500 font-normal"> hrs</span></div>
                </div>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 opacity-50" />
                </div>
              </div>
              <div className="flex-1 w-full h-full min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                    <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>

          {/* Budget / Insights Ring -> Maps to Insights */}
          <BorderGlow
            edgeSensitivity={30} glowColor="300 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#e879f9', '#d946ef', '#c026d3']} className="min-h-[240px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/insights')} className="h-full w-full p-5 flex flex-col md:flex-row items-center justify-between relative gap-4 group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> AI Insights</h3>
                <div className="space-y-3 mt-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono"><span>Focus Score</span> <span>92%</span></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-fuchsia-500 w-[92%]" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono"><span>Task Efficiency</span> <span>85%</span></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[85%]" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono"><span>Burnout Risk</span> <span>12%</span></div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[12%]" /></div>
                  </div>
                </div>
              </div>
              
              <div className="w-[140px] h-[140px] relative mt-4 md:mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={[{ name: 'Score', value: 88, fill: '#d946ef' }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold theme-text">88</span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Score</span>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-full">
          
          {/* Structure Radar -> Maps to Guide */}
          <BorderGlow
            edgeSensitivity={30} glowColor="210 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#60a5fa', '#3b82f6', '#2563eb']} className="min-h-[220px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/guide')} className="h-full w-full p-5 flex flex-col relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-400" /> Skill Radar</h3>
              <div className="flex-1 w-full -mt-4 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 9 }} />
                    <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>

          {/* Time Distribution Donut -> Maps to Calendar */}
          <BorderGlow
            edgeSensitivity={30} glowColor="280 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#c084fc', '#a855f7', '#9333ea']} className="min-h-[160px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/calendar')} className="h-full w-full p-5 flex flex-col md:flex-row items-center justify-between relative gap-4 group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </div>
              <div className="w-[100px] h-[100px] relative -ml-2 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 ml-0 md:ml-2">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-400" /> Time Splts</h3>
                <div className="space-y-1.5">
                  {pieData.slice(0, 3).map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                        <span className="text-zinc-400">{item.name}</span>
                      </div>
                      <span className="text-white font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BorderGlow>

          {/* Settings / Annual Plans */}
          <BorderGlow
            edgeSensitivity={30} glowColor="340 80 80" backgroundColor="var(--bg2)" borderRadius={24} glowRadius={30} glowIntensity={0.8}
            colors={['#fb7185', '#f43f5e', '#e11d48']} className="min-h-[80px] shadow-lg cursor-pointer"
          >
            <div onClick={() => navigate('/app/settings')} className="h-full w-full p-5 flex items-center justify-between relative group">
              <div>
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Configuration</h3>
                <div className="text-sm font-bold theme-text flex items-center gap-2">Manage Account <ArrowRight className="w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" /></div>
              </div>
              <div className="flex gap-1 items-end h-8">
                <div className="w-2 h-4 bg-rose-500/30 rounded-full" />
                <div className="w-2 h-6 bg-rose-500/60 rounded-full" />
                <div className="w-2 h-8 bg-rose-500 rounded-full" />
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}
