import { useState, useCallback, useRef, useEffect } from "react";

export type AppView = "onboarding" | "stats" | "recommendations" | "calendar" | "chat" | "dashboard";

export interface UserData {
  goal: string;
  currentActivity: string;
  weekdayRoutine: string;
  weekendRoutine: string;
  barriers: string;
  weight: string;
  height: string;
  age: string;
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
  const [userData, setUserData] = useState<UserData>({
    goal: "",
    currentActivity: "",
    weekdayRoutine: "",
    weekendRoutine: "",
    barriers: "",
    weight: "",
    height: "",
    age: "",
    gender: "",
  });
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<Activity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const voiceSupported = useRef(false);

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
        setTranscript(final || interim);
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
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        // already started
      }
    }
  }, [isListening]);

  const handleOnboardingNext = useCallback(() => {
    const key = onboardingQuestions[onboardingStep].key;
    setUserData(prev => ({ ...prev, [key]: transcript }));
    setTranscript("");
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setCurrentView("stats");
    }
  }, [onboardingStep, transcript]);

  const generateRecommendations = useCallback(() => {
    setRecommendations({
      goals: [
        `${userData.goal || "Improve fitness"} — target measurable progress in 4 weeks`,
        "Build consistent exercise habit — complete 80% of scheduled workouts",
        "Improve energy levels through regular movement and better sleep",
      ],
      insights: `Based on your routine, I've scheduled workouts during your free time blocks. ${
        userData.barriers.toLowerCase().includes("time")
          ? "To address time constraints, I've kept sessions under 30 minutes."
          : "I've balanced intensity across the week for sustainable progress."
      }`,
    });

    setWeeklyPlan([
      { time: "07:00", duration: 30, type: "workout", name: "Morning Cardio", description: "20 min jog + 10 min stretching", color: "hsl(239 84% 67%)" },
      { time: "12:30", duration: 45, type: "meal", name: "Lunch Break", description: "Healthy balanced meal", color: "hsl(160 84% 39%)" },
      { time: "18:00", duration: 45, type: "workout", name: "Strength Training", description: "Upper body focus", color: "hsl(38 92% 50%)" },
      { time: "22:00", duration: 30, type: "stretch", name: "Evening Wind Down", description: "Light stretching & breathing", color: "hsl(258 90% 66%)" },
    ]);

    setCurrentView("recommendations");
  }, [userData]);

  const toggleActivity = useCallback((name: string) => {
    setCompletedActivities(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const sendChat = useCallback((message: string) => {
    if (!message.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: message }]);
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Got it — I've updated your plan based on your feedback. I've moved your evening workouts 30 minutes earlier and reduced intensity by 15%.",
        },
      ]);
    }, 1000);
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
    generateRecommendations,
    voiceSupported: voiceSupported.current,
  };
}
