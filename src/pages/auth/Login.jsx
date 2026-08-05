import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import Lightfall from "@/components/ui/Lightfall";

export default function Login() {
  const nav = useNavigate();
  const { user, login, error } = useAuth();
  const [email, setEmail] = useState("demo@tasksync.app");
  const [password, setPassword] = useState("Demo1234!");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) nav("/app");
  };

  return (
    <div className="min-h-screen relative bg-[#0A0A0C] text-[#EDEDED] flex items-center justify-center">
      {/* Full-screen Lightfall Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Lightfall
          colors={['#5E43F3', '#7158F5', '#A1A1AA']}
          backgroundColor="#050505"
          speed={0.8}
          streakCount={6}
          streakWidth={1}
          streakLength={1.5}
          glow={0.8}
          density={0.8}
          twinkle={1}
          zoom={2.5}
          backgroundGlow={0.5}
          opacity={0.6}
          mouseInteraction={true}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] grid lg:grid-cols-2 min-h-screen lg:min-h-[auto] lg:rounded-3xl lg:border border-white/10 lg:bg-black/40 lg:backdrop-blur-xl lg:shadow-2xl overflow-hidden my-auto">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
          <Link to="/" className="relative z-10 flex items-center gap-2 w-max" data-testid="auth-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E43F3] to-violet-600 grid place-items-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <span className="font-heading font-semibold text-lg text-white">TaskSync</span>
          </Link>
          <div className="relative z-10 pointer-events-none">
            <p className="font-heading text-3xl font-bold leading-tight max-w-md text-white">"TaskSync is the first productivity app that actually feels built for engineers. The command palette alone saves me 30 min a day."</p>
          </div>
        </div>

        {/* Right Panel (Login Form) */}
        <div className="flex items-center justify-center p-8 bg-black/20 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6" data-testid="login-form">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-[#A1A1AA]">Sign in to your TaskSync account.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="bg-white/5 border-white/10 text-xs font-mono" disabled data-testid="oauth-google"><Globe className="w-4 h-4 mr-2 text-[#7158F5]" /> Google</Button>
            <Button type="button" variant="outline" className="bg-white/5 border-white/10 text-xs font-mono" disabled data-testid="oauth-github"><Shield className="w-4 h-4 mr-2 text-[#10B981]" /> GitHub</Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#A1A1AA] font-mono">
            <div className="flex-1 h-px bg-white/10" /> OR <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required data-testid="login-email" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot" className="text-xs text-[#7158F5] hover:underline font-mono">Forgot?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required data-testid="login-password" />
            </div>
          </div>

          {error && <div className="text-sm text-rose-400 font-mono" data-testid="login-error">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full rounded-full bg-white text-black hover:bg-zinc-200 font-semibold" data-testid="login-submit">
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-sm text-[#A1A1AA] text-center">
            No account? <Link to="/register" className="text-[#7158F5] hover:underline">Create one</Link>
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
