import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Upload, Keyboard, Bell, Palette, Globe, Trash2, Sparkles, Key } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(user?.theme || "dark");
  const [notif, setNotif] = useState(true);
  const [lang, setLang] = useState("en");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [geminiSaved, setGeminiSaved] = useState(!!localStorage.getItem("gemini_api_key"));

  const saveGeminiKey = () => {
    const trimmed = geminiKey.trim();
    localStorage.setItem("gemini_api_key", trimmed);
    setGeminiSaved(true);
    toast.success("Gemini API Key saved! AlgoBot AI is now active.");
  };

  const clearGeminiKey = () => {
    localStorage.removeItem("gemini_api_key");
    setGeminiKey("");
    setGeminiSaved(false);
    toast.info("Gemini API Key removed. AlgoBot will use offline mode.");
  };

  const exportJson = async () => {
    try {
      const { data } = await api.get("/tasks");
      const blob = new Blob([JSON.stringify(data.tasks || [], null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "tasksync-export.json"; a.click();
      URL.revokeObjectURL(url); toast.success("Exported JSON");
    } catch {
      toast.error("Export failed");
    }
  };

  const exportCsv = async () => {
    try {
      const { data } = await api.get("/tasks");
      const rows = [["Title","Category","Priority","Due","Completed","Duration"]];
      for (const t of (data.tasks || [])) rows.push([t.title, t.category, t.priority, t.due_date||"", t.completed?"yes":"no", t.duration_minutes||""]);
      const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "tasksync-export.csv"; a.click();
      URL.revokeObjectURL(url); toast.success("Exported CSV");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-5 max-w-3xl font-sans" data-testid="settings-page">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500 font-mono mt-1">Preferences, data & accessibility.</p>
      </div>

      <Section icon={Palette} title="Appearance">
        <Row label="Theme">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-40" data-testid="theme-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light (beta)</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Row label="Enable push notifications" hint="Get reminders for due tasks">
          <Switch checked={notif} onCheckedChange={setNotif} data-testid="notif-switch" />
        </Row>
      </Section>

      <Section icon={Globe} title="Language">
        <Row label="Interface language">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>

      <Section icon={Keyboard} title="Keyboard shortcuts">
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          {[["Command palette","⌘K"],["Quick add","⌘⇧N"],["Toggle complete","Space"],["Delete task","⌫"]].map(([l,k])=>(
            <div key={l} className="flex items-center justify-between px-3 py-2 rounded border border-white/5 bg-white/[0.01]">
              <span className="text-zinc-400">{l}</span>
              <kbd className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">{k}</kbd>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Download} title="Data">
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <Button variant="outline" onClick={exportJson} data-testid="export-json"><Download className="w-4 h-4 mr-2" /> Export JSON</Button>
          <Button variant="outline" onClick={exportCsv} data-testid="export-csv"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Button variant="outline" disabled><Upload className="w-4 h-4 mr-2" /> Import (soon)</Button>
        </div>
      </Section>

      <Section icon={Sparkles} title="AI Assistant — Google Gemini">
        <div className="space-y-4 font-mono text-xs">
          <p className="text-zinc-400 leading-relaxed">
            Connect your Google Gemini API key to enable live AI responses in the <span className="text-indigo-300 font-semibold">DSA Lab → AlgoBot AI</span> and <span className="text-indigo-300 font-semibold">AI Insights</span> features. Without a key, AlgoBot uses its built-in offline knowledge engine.
          </p>
          <p className="text-zinc-500">
            Get a free API key at{" "}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">
              aistudio.google.com
            </a>{" "}
            (look for keys starting with <code className="text-emerald-400">AIzaSy...</code>).
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                placeholder="Paste your Gemini API Key (AIzaSy...)"
                value={geminiKey}
                onChange={(e) => { setGeminiKey(e.target.value); setGeminiSaved(false); }}
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <Button
              onClick={saveGeminiKey}
              disabled={!geminiKey.trim()}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono shrink-0"
            >
              Save Key
            </Button>
            {geminiSaved && (
              <Button
                onClick={clearGeminiKey}
                size="sm"
                variant="ghost"
                className="text-xs font-mono text-rose-400 hover:text-rose-300 shrink-0"
              >
                Remove
              </Button>
            )}
          </div>
          {geminiSaved ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Gemini API Key is active — AlgoBot AI is live!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              No API key — AlgoBot AI running in offline mode.
            </div>
          )}
        </div>
      </Section>

      <Section icon={Trash2} title="Account">
        <div className="flex items-center justify-between font-mono text-xs">
          <div>
            <div className="text-sm font-semibold text-white">{user?.name || "Demo User"}</div>
            <div className="text-xs text-zinc-500">{user?.email || "demo@tasksync.app"}</div>
          </div>
          <Button variant="destructive" onClick={logout} data-testid="signout-btn">Sign out</Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-4 text-zinc-300">
        <Icon className="w-4 h-4 text-indigo-400" />
        <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between py-2 font-mono text-xs">
      <div>
        <Label className="text-xs text-zinc-200">{label}</Label>
        {hint && <p className="text-[11px] text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
