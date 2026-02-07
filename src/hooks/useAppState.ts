import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";

export type AppView = "onboarding" | "stats" | "auth" | "recommendations" | "calendar" | "chat" | "dashboard";

export interface UserData {
  goal: string;
  currentActivity: string;
  weekdayRoutine: string;
  weekendRoutine: string;
  barriers: string;
  weight: string;
  height: string;
  birthday: string;
  gender: string;
}

export interface Activity {
  time: string;
  duration: number;
  type: "workout" | "meal" | "stretch";
  name: string;
  description: string;
  color: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Recommendations {
  goals: string[];
  insights: string;
}

export const onboardingQuestions = [
  { key: "goal" as keyof UserData, question: "What's your health goal?", placeholder: "e.g., lose weight, build muscle, better energy..." },
  { key: "currentActivity" as keyof UserData, question: "Are you currently working out or doing any regular physical activity?", placeholder: "e.g., gym 3x/week, walking..." },
  { key: "weekdayRoutine" as keyof UserData, question: "Walk me through your typical weekday — when do you wake up, work, and have free time?", placeholder: "e.g., wake at 7am, work 9-6..." },
  { key: "weekendRoutine" as keyof UserData, question: "What does a typical weekend look like for you?", placeholder: "e.g., sleep in, brunch with friends..." },
  { key: "barriers" as keyof UserData, question: "What's been stopping you from reaching your goal so far?", placeholder: "e.g., no time, no motivation..." },
];

export function useAppState() {
  const [currentView, setCurrentView] = useState<AppView>("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [useMetric, setUseMetric] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData>({
    goal: "",
    currentActivity: "",
    weekdayRoutine: "",
    weekendRoutine: "",
    barriers: "",
    weight: "",
    height: "",
    birthday: "",
    gender: "",
  });
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<Activity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const recognitionRef = useRef<any>(null);
  const voiceSupported = useRef(false);
  const finalizedTextRef = useRef("");

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      voiceSupported.current = true;

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t + " ";
          else interim += t;
        }
        if (final) {
          finalizedTextRef.current = (finalizedTextRef.current + final).trim() + " ";
          setTranscript(finalizedTextRef.current);
        } else if (interim) {
          const base = finalizedTextRef.current.trim();
          setTranscript(base ? base + " " + interim : interim);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!voiceSupported.current) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      finalizedTextRef.current = transcript;
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        // already started
      }
    }
  }, [isListening, transcript]);

  const handleOnboardingNext = useCallback(() => {
    const key = onboardingQuestions[onboardingStep].key;
    setUserData(prev => ({ ...prev, [key]: transcript.trim() }));
    setTranscript("");
    finalizedTextRef.current = "";
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setCurrentView("stats");
    }
  }, [onboardingStep, transcript]);

  const handleOnboardingBack = useCallback(() => {
    if (onboardingStep > 0) {
      const key = onboardingQuestions[onboardingStep].key;
      setUserData(prev => ({ ...prev, [key]: transcript.trim() }));
      const prevStep = onboardingStep - 1;
      const prevKey = onboardingQuestions[prevStep].key;
      setOnboardingStep(prevStep);
      const prevAnswer = userData[prevKey] || "";
      setTranscript(prevAnswer);
      finalizedTextRef.current = prevAnswer;
    }
  }, [onboardingStep, transcript, userData]);

  const generateRecommendations = useCallback(async () => {
    setIsGenerating(true);
    setCurrentView("recommendations");

    try {
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { userData: { ...userData, useMetric } },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations({
        goals: data.goals || [],
        insights: data.insights || "",
      });

      if (data.weeklyPlan && Array.isArray(data.weeklyPlan)) {
        setWeeklyPlan(data.weeklyPlan);
      }
    } catch (e: any) {
      console.error("Failed to generate plan:", e);
      toast({
        title: "Error generating plan",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
      // Fallback to basic plan
      setRecommendations({
        goals: [
          `${userData.goal || "Improve fitness"} — target measurable progress in 4 weeks`,
          "Build consistent exercise habit — complete 80% of scheduled workouts",
          "Improve energy levels through regular movement and better sleep",
        ],
        insights: "We couldn't reach the AI coach right now. Here's a basic plan to get you started.",
      });
      setWeeklyPlan([
        { time: "07:00", duration: 30, type: "workout", name: "Morning Cardio", description: "20 min jog + 10 min stretching", color: "hsl(239 84% 67%)" },
        { time: "12:30", duration: 45, type: "meal", name: "Lunch Break", description: "Healthy balanced meal", color: "hsl(160 84% 39%)" },
        { time: "18:00", duration: 45, type: "workout", name: "Strength Training", description: "Upper body focus", color: "hsl(38 92% 50%)" },
        { time: "22:00", duration: 30, type: "stretch", name: "Evening Wind Down", description: "Light stretching & breathing", color: "hsl(258 90% 66%)" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, [userData, useMetric]);

  const toggleActivity = useCallback((name: string) => {
    setCompletedActivities(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const sendChat = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    const userMsg: ChatMessage = { role: "user", content: message };
    setChatHistory(prev => [...prev, userMsg]);

    let assistantSoFar = "";
    const allMessages = [...chatHistory, userMsg];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages.map(m => ({ role: m.role, content: m.content })),
            userData,
            weeklyPlan,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setChatHistory(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setChatHistory(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* ignore partial */ }
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast({
        title: "Chat error",
        description: e.message || "Failed to get response",
        variant: "destructive",
      });
      setChatHistory(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that right now. Please try again." },
      ]);
    }
  }, [chatHistory, userData, weeklyPlan]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return {
    currentView, setCurrentView,
    onboardingStep,
    isListening, toggleListening,
    transcript, setTranscript,
    useMetric, setUseMetric,
    userData, setUserData,
    recommendations,
    weeklyPlan,
    completedActivities, toggleActivity,
    chatHistory, sendChat,
    handleOnboardingNext,
    handleOnboardingBack,
    generateRecommendations,
    isGenerating,
    voiceSupported: voiceSupported.current,
    user, session, logout,
  };
}
