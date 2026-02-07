import { useState } from "react";
import { Mic, MicOff, Keyboard } from "lucide-react";
import { onboardingQuestions } from "@/hooks/useAppState";

interface OnboardingProps {
  step: number;
  transcript: string;
  setTranscript: (val: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  onNext: () => void;
}

const Onboarding = ({ step, transcript, setTranscript, isListening, toggleListening, onNext }: OnboardingProps) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const current = onboardingQuestions[step];
  const totalSteps = onboardingQuestions.length;

  return (
    <div className="max-w-[600px] mx-auto px-5 py-10">
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              idx <= step ? "bg-primary" : "bg-primary/25"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h1 className="text-[28px] font-light text-foreground leading-snug mb-5">
        {current.question}
      </h1>

      {/* Transcript display */}
      <div className={`text-lg text-muted-foreground leading-relaxed my-8 min-h-[60px] font-light ${transcript ? "animate-fade-in" : ""}`}>
        {transcript || (
          <span className="italic text-muted-foreground/60">{current.placeholder}</span>
        )}
      </div>

      {/* Voice button */}
      <div className="flex gap-3 items-center flex-wrap mb-6">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-medium shadow-button transition-all active:scale-[0.98] relative ${
            isListening
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-ring" />
          )}
          {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5" />}
          <span className="relative z-10">{isListening ? "Stop" : "Tap to speak"}</span>
        </button>
        {transcript && (
          <button
            onClick={onNext}
            className="flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-medium bg-foreground text-card shadow-button transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        )}
      </div>

      {/* Type your answer toggle */}
      {!showTextInput ? (
        <button
          onClick={() => setShowTextInput(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Keyboard className="w-4 h-4" />
          Or type your answer
        </button>
      ) : (
        <div className="space-y-2 animate-fade-in">
          <label className="block text-sm text-muted-foreground">Type your answer</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={current.placeholder}
            autoFocus
            className="w-full min-h-[100px] p-4 border border-input rounded-xl text-base font-sans resize-y outline-none focus:border-primary transition-colors bg-card"
          />
          <button
            onClick={onNext}
            className="w-full rounded-full px-8 py-4 text-base font-medium bg-foreground text-card shadow-button transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
