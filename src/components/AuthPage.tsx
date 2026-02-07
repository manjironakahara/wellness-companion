import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: error.message || "Google sign-in failed", variant: "destructive" });
        return;
      }
      onComplete();
    } catch (e: any) {
      toast({ title: e.message || "Google sign-in failed", variant: "destructive" });
    } finally {
      setGoogleLoading(false);
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
            : "Create an account to save your progress. Sign in with Google to also sync your calendar."}
        </p>

        {/* Auth form */}
        <div className="w-full max-w-sm space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full rounded-xl px-6 py-3.5 text-base font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "hsl(0 0% 100% / 0.95)",
              color: "hsl(0 0% 20%)",
            }}
          >
            {googleLoading ? (
              <span className="animate-pulse">Connecting…</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px" style={{ background: "hsl(0 0% 100% / 0.15)" }} />
            <span className="text-xs onboarding-helper">or</span>
            <div className="flex-1 h-px" style={{ background: "hsl(0 0% 100% / 0.15)" }} />
          </div>

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
