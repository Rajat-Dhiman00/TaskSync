import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  LayoutDashboard, ListChecks, Calendar, BarChart3, Sparkles, Settings,
  Search, Command as CmdIcon, LogOut, Plus, Cpu, Clock, Timer, Palette,
  Bell, PanelRightClose, PanelRightOpen, Play, Pause, RotateCcw, AlertTriangle,
  CheckCircle2, Flame, Pin, ChevronRight, X, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ClickSpark from "@/components/ui/ClickSpark";


const links = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/app/tasks", icon: ListChecks, label: "Events & Tasks" },
  { to: "/app/calendar", icon: Calendar, label: "Calendar" },
  { to: "/app/dsa", icon: Cpu, label: "DSA Lab" },
  { to: "/app/guide", icon: ListChecks, label: "Questions Guide" },
  { to: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/app/insights", icon: Sparkles, label: "AI Insights" },
];

const themes = [
  { id: "dark", label: "Dark", preview: "bg-[#0f1117] border-indigo-500" },
  { id: "light", label: "Light", preview: "bg-[#f0f2f8] border-blue-500" },
  { id: "hr-ppt", label: "Azure", preview: "bg-[#0d1b2a] border-cyan-500" },
  { id: "hr-warm", label: "Warm", preview: "bg-[#fdf6ee] border-amber-600" },
  { id: "ocean", label: "Ocean", preview: "bg-[#e8f4fd] border-sky-600" },
  { id: "midnight", label: "Night", preview: "bg-[#12001e] border-purple-500" },
  { id: "rose", label: "Rose", preview: "bg-[#1a0a0f] border-pink-500" },
  { id: "hacker", label: "Hacker", preview: "bg-[#0a0f0a] border-emerald-500" },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("tasksync_theme") || "hr-warm");
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Task Stats for Sidebar & Right Panel
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState([]);

  // Pomodoro State
  const [pomoOpen, setPomoOpen] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState("Focus"); // "Focus" | "Break"

  // Live Clock canvas ref
  const clockCanvasRef = useRef(null);
  const [digitalTimeStr, setDigitalTimeStr] = useState("");
  const [digitalDateStr, setDigitalDateStr] = useState("");

  // Sync Theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("tasksync_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    toast.success(`Theme switched to ${newTheme.toUpperCase()}`);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Load Tasks Summary
  const loadTaskSummary = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      const list = data.tasks || [];
      setTasks(list);
      const pending = list.filter((t) => !t.completed).length;
      const done = list.filter((t) => t.completed).length;
      const urgent = list.filter((t) => !t.completed && (t.priority === "urgent" || t.priority === "high"));
      setPendingCount(pending);
      setCompletedCount(done);
      setUrgentTasks(urgent);
    } catch {
      setPendingCount(2);
      setCompletedCount(3);
    }
  }, []);

  useEffect(() => {
    loadTaskSummary();
    const handleRefresh = () => loadTaskSummary();
    window.addEventListener("tasks:refresh", handleRefresh);
    return () => window.removeEventListener("tasks:refresh", handleRefresh);
  }, [loadTaskSummary]);

  // Live Analog Clock Draw
  useEffect(() => {
    const drawClock = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setDigitalTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setDigitalDateStr(now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }));

      const canvas = clockCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, r = cx - 4;

      ctx.clearRect(0, 0, W, H);

      // Outer face
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 17, 23, 0.8)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hour ticks
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4));
        ctx.lineTo(cx + Math.cos(a) * (r - 9), cy + Math.sin(a) * (r - 9));
        ctx.strokeStyle = i % 3 === 0 ? "#6366f1" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.stroke();
      }

      // Hands
      const hA = (((now.getHours() % 12) + now.getMinutes() / 60) / 12) * Math.PI * 2 - Math.PI / 2;
      const mA = ((now.getMinutes() + now.getSeconds() / 60) / 60) * Math.PI * 2 - Math.PI / 2;
      const sA = (now.getSeconds() / 60) * Math.PI * 2 - Math.PI / 2;

      // Hour hand
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(hA) * (r * 0.45), cy + Math.sin(hA) * (r * 0.45));
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();

      // Minute hand
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(mA) * (r * 0.68), cy + Math.sin(mA) * (r * 0.68));
      ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();

      // Second hand (accent color)
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sA) * (r * 0.82), cy + Math.sin(sA) * (r * 0.82));
      ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.stroke();

      // Center dot
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1"; ctx.fill();
    };

    drawClock();
    const timer = setInterval(drawClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval = null;
    if (pomoRunning && pomoTime > 0) {
      interval = setInterval(() => setPomoTime((t) => t - 1), 1000);
    } else if (pomoTime === 0 && pomoRunning) {
      setPomoRunning(false);
      toast.success(`${pomoMode} session finished! 🎉`);
      if (pomoMode === "Focus") {
        setPomoMode("Break"); setPomoTime(5 * 60);
      } else {
        setPomoMode("Focus"); setPomoTime(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomoRunning, pomoTime, pomoMode]);

  const formatPomoTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || !q.trim()) { setResults([]); return; }
    const id = setTimeout(async () => {
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
        setResults(data.results);
      } catch {}
    }, 200);
    return () => clearTimeout(id);
  }, [q, open]);

  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);

  const quickAdd = () => {
    setQuickAddModalOpen(true);
  };

  return (
    <div className="min-h-screen flex theme-bg font-sans relative overflow-hidden">
      {/* Glow Gradient Background */}
      <div className="absolute inset-0 mesh-hero opacity-40 pointer-events-none" />
      
      {/* ===== SIDEBAR ===== */}
      <aside className="relative z-10 w-64 theme-sidebar theme-border border-r p-4 flex flex-col shrink-0 select-none" data-testid="sidebar">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-2 border-b border-white/5 pb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 grid place-items-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-base theme-text tracking-tight block leading-tight">TaskSync</span>
            <span className="text-[10px] font-mono theme-text-muted">AI Reminder Suite</span>
          </div>
        </div>

        {/* Live Clock Section */}
        <div className="py-4 px-2 border-b border-white/5 flex flex-col items-center gap-2">
          <canvas ref={clockCanvasRef} width={84} height={84} className="rounded-full shadow-inner" />
          <div className="text-center font-mono">
            <div className="text-base font-bold theme-text tracking-wider tabular-nums">{digitalTimeStr}</div>
            <div className="text-[11px] theme-text-muted mt-0.5">{digitalDateStr}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 font-mono text-xs flex-1">
          <div className="px-3 text-[10px] font-semibold theme-text-muted uppercase tracking-wider mb-2">Navigation</div>
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30"
                    : "theme-text-muted hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <l.icon className="w-4 h-4" /> {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Productivity/Engineer Widget to fill space */}
        <div className="mt-6 mb-4 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <Flame className="w-12 h-12 text-orange-500" />
            </div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold theme-text">12 Day Streak!</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mb-1.5 relative z-10">
              <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 w-[75%]" />
            </div>
            <span className="text-[9px] theme-text-muted font-mono uppercase relative z-10">Top 5% Engineers</span>
          </div>

          <div className="p-3 rounded-xl theme-card border theme-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] theme-text-muted font-mono uppercase flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-indigo-400" />
                Focus Engine
              </span>
              <span className="text-[10px] font-bold text-indigo-400">Optimal</span>
            </div>
            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[85%]" />
            </div>
          </div>
        </div>

        {/* Sidebar Footer Stats & Quick Add */}
        <div className="mt-auto pt-4 border-t border-white/5 space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 text-center p-2 rounded-xl theme-card border theme-border">
            <div>
              <div className="text-base font-bold text-indigo-400">{pendingCount}</div>
              <div className="text-[10px] theme-text-muted uppercase">Pending</div>
            </div>
            <div>
              <div className="text-base font-bold text-emerald-400">{completedCount}</div>
              <div className="text-[10px] theme-text-muted uppercase">Done</div>
            </div>
          </div>

          <Button onClick={quickAdd} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20" data-testid="sidebar-quickadd">
            <Plus className="w-4 h-4 mr-2" /> Quick Add Event
          </Button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b theme-border px-6 flex items-center justify-between backdrop-blur-xl theme-card sticky top-0 z-30 font-mono text-xs">
          
          {/* Welcome Message & Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => nav("/")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border theme-border bg-white/[0.04] theme-text hover:bg-white/[0.08] hover:border-indigo-500/50 transition-all shadow-sm"
              title="Return to Website Home"
            >
              <Home className="w-4 h-4 text-indigo-400" />
              <span>Home</span>
            </button>
            <div className="w-px h-5 bg-white/10 hidden md:block" />
            <ClickSpark
              sparkColor='#818cf8'
              sparkSize={6}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <div className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors theme-text font-bold text-sm select-none group">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:animate-spin" />
                {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "Your Workspace"}
              </div>
            </ClickSpark>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Pomodoro Timer Widget */}
            <div className="relative">
              <button
                onClick={() => setPomoOpen(!pomoOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  pomoRunning
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20"
                    : "bg-white/[0.04] theme-border theme-text hover:border-indigo-500/50"
                }`}
                title="Pomodoro Focus Timer"
              >
                <Timer className={`w-3.5 h-3.5 ${pomoRunning ? "animate-pulse text-amber-400" : "text-indigo-400"}`} />
                <span>{formatPomoTime(pomoTime)}</span>
              </button>

              {pomoOpen && (
                <div className="absolute right-0 top-12 w-64 p-4 rounded-2xl border theme-border theme-card shadow-2xl z-50 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold theme-text flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-indigo-400" /> {pomoMode} Session
                    </span>
                    <button onClick={() => setPomoOpen(false)} className="theme-text-muted hover:text-white">✕</button>
                  </div>

                  {/* Circular SVG Ring */}
                  <div className="relative grid place-items-center py-2">
                    <svg width={100} height={100} className="transform -rotate-90">
                      <circle cx={50} cy={50} r={40} stroke="rgba(255,255,255,0.1)" strokeWidth={6} fill="none" />
                      <circle
                        cx={50} cy={50} r={40}
                        stroke="#6366f1" strokeWidth={6} fill="none"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - pomoTime / (pomoMode === "Focus" ? 25 * 60 : 5 * 60))}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute text-xl font-bold theme-text tabular-nums">{formatPomoTime(pomoTime)}</div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => setPomoRunning(!pomoRunning)}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono"
                    >
                      {pomoRunning ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                      {pomoRunning ? "Pause" : "Start"}
                    </Button>
                    <Button
                      onClick={() => { setPomoRunning(false); setPomoTime(pomoMode === "Focus" ? 25 * 60 : 5 * 60); }}
                      size="sm" variant="outline" className="text-xs font-mono"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-xl border theme-border bg-white/[0.04] theme-text hover:border-indigo-500/50 transition-colors" title="Change Theme">
                  <Palette className="w-4 h-4 text-indigo-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 font-mono text-xs theme-card theme-border">
                <div className="px-2 py-1 text-[10px] font-bold theme-text-muted uppercase tracking-wider mb-1">Select Theme</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                        theme === t.id ? "bg-indigo-600/30 border-indigo-500 theme-text font-bold" : "theme-border hover:bg-white/5 theme-text-muted"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border ${t.preview}`} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`p-2 rounded-xl border transition-all ${
                rightPanelOpen ? "bg-indigo-600/30 border-indigo-500 theme-text" : "theme-border bg-white/[0.04] theme-text hover:border-indigo-500/50"
              }`}
              title="Toggle Right Panel"
            >
              {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger data-testid="user-menu">
                <Avatar className="w-8 h-8 border theme-border cursor-pointer">
                  <AvatarFallback className="bg-indigo-600 text-white text-xs font-mono font-bold">{(user?.name?.[0] || "T").toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-mono text-xs theme-card theme-border">
                <div className="px-3 py-2">
                  <div className="text-sm font-semibold theme-text">{user?.name || "Demo User"}</div>
                  <div className="text-xs theme-text-muted">{user?.email || "demo@tasksync.app"}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/app/settings")}><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logout(); nav("/"); }} data-testid="menu-logout"><LogOut className="w-4 h-4 mr-2 text-rose-400" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Workspace Layout Body */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <main className="flex-1 min-w-0 overflow-auto">
            <div className="p-6 max-w-[1400px] mx-auto slide-up"><Outlet /></div>
          </main>

          {/* ===== RIGHT SIDE PANEL ===== */}
          {rightPanelOpen && (
            <aside className="w-72 border-l theme-sidebar p-4 flex flex-col gap-4 overflow-y-auto shrink-0 select-none font-mono text-xs slide-up">
              <div className="flex items-center justify-between border-b theme-border pb-3">
                <div className="font-bold theme-text flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Right Panel
                </div>
                <button onClick={() => setRightPanelOpen(false)} className="theme-text-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Urgent Task Alert Card */}
              {urgentTasks.length > 0 ? (
                <div className="rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 to-transparent p-3 space-y-1.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Urgent Task
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">Priority</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{urgentTasks[0].title}</div>
                  <Button
                    onClick={async () => {
                      try { await api.patch(`/tasks/${urgentTasks[0].id}`, { completed: true }); } catch {}
                      loadTaskSummary();
                      toast.success("Task completed!");
                    }}
                    size="sm"
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-mono mt-1"
                  >
                    Mark Done ✓
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-xs text-emerald-300 font-bold">No Urgent Tasks</div>
                  <div className="text-[10px] text-zinc-500">All high priority tasks clear!</div>
                </div>
              )}

              {/* Today's Overview Stats */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Quick Stats</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="text-zinc-400 text-[10px]">Pending</div>
                    <div className="text-lg font-bold text-indigo-400">{pendingCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div className="text-zinc-400 text-[10px]">Done</div>
                    <div className="text-lg font-bold text-emerald-400">{completedCount}</div>
                  </div>
                </div>
              </div>

              {/* Pomodoro Focus Status Card */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-white font-bold">
                  <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5 text-indigo-400" /> Focus Mode</span>
                  <span className="text-indigo-400 tabular-nums">{formatPomoTime(pomoTime)}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${(1 - pomoTime / (pomoMode === "Focus" ? 25 * 60 : 5 * 60)) * 100}%` }}
                  />
                </div>
                <Button
                  onClick={() => setPomoRunning(!pomoRunning)}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-mono"
                >
                  {pomoRunning ? "Pause Timer" : "Start Focus Session"}
                </Button>
              </div>

              {/* Pinned Tasks List */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Pinned Tasks</span>
                  <Pin className="w-3 h-3 text-orange-400" />
                </div>
                <div className="space-y-1.5">
                  {tasks.filter(t => t.pinned && !t.completed).slice(0, 4).map(t => (
                    <div key={t.id} className="p-2 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 truncate">
                      {t.title}
                    </div>
                  ))}
                  {tasks.filter(t => t.pinned && !t.completed).length === 0 && (
                    <div className="text-[11px] text-zinc-500 italic py-1">No pinned tasks</div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Quick Add Task Modal */}
      <QuickAddModalDialog
        open={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        onRefresh={loadTaskSummary}
      />
    </div>
  );
}

/* ===== QUICK ADD TASK MODAL DIALOG ===== */
function QuickAddModalDialog({ open, onClose, onRefresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("high");
  const [category, setCategory] = useState("work");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16);
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    setSaving(true);
    const dateVal = dueDate ? new Date(dueDate).toISOString() : new Date().toISOString();

    try {
      await api.post("/tasks", {
        title,
        desc: description,
        description,
        priority,
        category,
        due_date: dateVal,
        date: dateVal,
        completed: false,
        status: "pending"
      });
      toast.success(`Task "${title}" created successfully!`);
      window.dispatchEvent(new Event("tasks:refresh"));
      onRefresh?.();
      setTitle("");
      setDescription("");
      onClose();
    } catch {
      toast.error("Error creating task");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-mono text-xs theme-card theme-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="theme-text flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Quick Add Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          <div>
            <label className="block theme-text-muted mb-1 font-bold">Task Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Q1 Expense Report…"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="bg-white/[0.04] theme-border theme-text font-bold"
              autoFocus
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-bold">Description / Details</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes or checklist items…"
              rows={2}
              className="bg-white/[0.04] theme-border theme-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block theme-text-muted mb-1 font-bold">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-white/[0.04] theme-border theme-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block theme-text-muted mb-1 font-bold">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/[0.04] theme-border theme-text capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="personal">Home / Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-bold">Due Date & Time</label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white/[0.04] theme-border theme-text"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="theme-text-muted font-mono text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs shadow-md font-bold"
          >
            {saving ? "Creating…" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
