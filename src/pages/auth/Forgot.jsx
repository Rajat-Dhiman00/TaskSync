import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Lightfall from "@/components/ui/Lightfall";

export default function Forgot() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post("/auth/forgot-password", { email }); }
    catch {}
    setLoading(false); setStep(2);
    toast.success("Reset code sent (demo — use any 6 digits)");
  };

  return (
    <div className="min-h-screen relative bg-[#0A0A0C] text-[#EDEDED] flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl space-y-6" data-testid="forgot-form">
        <Link to="/login" className="text-sm text-[#A1A1AA] hover:text-white flex items-center gap-2 font-mono"><ArrowLeft className="w-4 h-4" /> Back to sign in</Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E43F3] to-violet-600 grid place-items-center"><Sparkles className="w-4 h-4 text-white" /></div>
          <span className="font-heading font-semibold text-lg text-white">TaskSync</span>
        </div>
        {step === 1 && (
          <form onSubmit={send} className="space-y-4">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight">Reset password</h1>
              <p className="mt-2 text-sm text-[#A1A1AA]">Enter your email and we'll send a code.</p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required data-testid="forgot-email" />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-white text-black hover:bg-zinc-200 font-semibold" data-testid="forgot-submit">
              {loading ? "Sending…" : "Send code"}
            </Button>
          </form>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Enter code</h1>
            <p className="text-sm text-[#A1A1AA]">We sent a 6-digit code to <span className="text-white font-bold">{email}</span></p>
            <div className="flex justify-center py-2">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="forgot-otp">
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i=><InputOTPSlot key={i} index={i} />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full rounded-full bg-white text-black hover:bg-zinc-200 font-semibold" onClick={()=>setStep(3)} disabled={otp.length !== 6} data-testid="forgot-verify">
              Verify
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight">All set</h1>
            <p className="text-sm text-[#A1A1AA]">Password reset link sent. Check your inbox to continue.</p>
            <Link to="/login"><Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-semibold">Back to sign in</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
