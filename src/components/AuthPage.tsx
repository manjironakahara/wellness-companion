import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarSync, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  onComplete: () => void;
  onSkip: () => void;
}

const AuthPage = ({ onComplete, onSkip }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast({ title: "Invalid email or password", variant: "destructive" });
          } else {
            toast({ title: error.message, variant: "destructive" });
          }
          return;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "This email is already registered. Try logging in.", variant: "destructive" });
          } else {
            toast({ title: error.message, variant: "destructive" });
          }
          return;
        }
        toast({ title: "Check your email to confirm your account!" });
      }
      onComplete();
    } catch (e: any) {
      toast({ title: e.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-screen relative flex flex-col min-h-screen overflow-hidden">
      <div className="onboarding-glow" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Calendar integration pitch */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(10px)" }}
        >
          <CalendarSync className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl md:text-3xl font-medium text-center max-w-md leading-relaxed onboarding-question mb-3">
          {isLogin ? "Welcome back" : "Save your plan & sync your calendar"}
        </h1>

        <p className="text-center text-sm max-w-sm mb-8 onboarding-transcript leading-relaxed">
          {isLogin
            ? "Log in to access your personalized plan"
            : "Create an account to save your progress. We can also adjust your plan around your existing schedule."}
        </p>

        {/* Auth form */}
        <div className="w-full max-w-sm space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.4)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-3.5 pl-11 rounded-xl text-base outline-none onboarding-textarea"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(0 0% 100% / 0.4)" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Password"
              className="w-full p-3.5 pl-11 pr-11 rounded-xl text-base outline-none onboarding-textarea"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(0 0% 100% / 0.4)" }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full rounded-full px-8 py-4 text-base font-medium onboarding-btn-continue transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Please wait…</span>
            ) : (
              <>
                {isLogin ? "Log In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center py-2 text-sm onboarding-transcript transition-all"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>

      {/* Skip option */}
      <div className="relative z-10 pb-10 px-6 text-center">
        <button
          onClick={onSkip}
          className="text-sm onboarding-helper transition-all hover:underline"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
