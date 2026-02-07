import { useState, useEffect } from "react";
import { Mic, MicOff, Keyboard, ChevronUp } from "lucide-react";
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
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const current = onboardingQuestions[step];
  const totalSteps = onboardingQuestions.length;

  useEffect(() => {
    setAnimateQuestion(false);
    setShowTextInput(false);
    const timer = setTimeout(() => setAnimateQuestion(true), 50);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="onboarding-screen relative flex flex-col min-h-screen overflow-hidden">
      {/* Radial glow background */}
      <div className="onboarding-glow" />

      {/* Main centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Listen label */}
        <div className="flex items-center gap-2 mb-8 onboarding-label">
          <Mic className="w-4 h-4" />
          <span className="text-sm tracking-wide">Listen</span>
        </div>

        {/* Question */}
        <h1
          className={`text-2xl md:text-3xl font-medium text-center max-w-lg leading-relaxed onboarding-question transition-all duration-700 ${
            animateQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {current.question}
        </h1>

        {/* Transcript area */}
        {transcript && (
          <p className="mt-8 text-lg text-center max-w-md onboarding-transcript animate-fade-in leading-relaxed">
            {transcript}
          </p>
        )}
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 pb-10 px-6">
        {/* Text input panel */}
        {showTextInput && (
          <div className="max-w-lg mx-auto mb-6 animate-fade-in">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={current.placeholder}
              autoFocus
              rows={3}
              className="w-full p-4 rounded-2xl text-base font-sans resize-none outline-none onboarding-textarea"
            />
          </div>
        )}

        {/* Helper text */}
        <p className="text-center text-sm mb-4 onboarding-helper">
          {transcript ? "Tap continue when you're done" : "Give detailed answers for the best results"}
        </p>

        {/* Progress bar */}
        <div className="max-w-[200px] mx-auto mb-6">
          <div className="h-1 rounded-full onboarding-progress-track">
            <div
              className="h-full rounded-full onboarding-progress-fill transition-all duration-500"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center mt-2 onboarding-helper">
            {step + 1} of {totalSteps}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          {/* Mic button */}
          <button
            onClick={toggleListening}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isListening ? "onboarding-btn-recording" : "onboarding-btn-mic"
            }`}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full onboarding-btn-recording animate-pulse-ring" />
            )}
            {isListening ? (
              <MicOff className="w-5 h-5 relative z-10" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Audio bars indicator (decorative when listening) */}
          {isListening && (
            <div className="flex items-end gap-[3px] h-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full onboarding-bar"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Continue / Submit */}
          {transcript && (
            <button
              onClick={onNext}
              className="w-14 h-14 rounded-full flex items-center justify-center onboarding-btn-continue transition-all active:scale-95"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {/* Keyboard toggle */}
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              showTextInput ? "onboarding-btn-active" : "onboarding-btn-secondary"
            }`}
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
