import { Calendar, MessageCircle } from "lucide-react";
import type { Recommendations as RecommendationsType } from "@/hooks/useAppState";

interface RecommendationsProps {
  recommendations: RecommendationsType | null;
  onViewCalendar: () => void;
  onAdjustPlan: () => void;
}

const Recommendations = ({ recommendations, onViewCalendar, onAdjustPlan }: RecommendationsProps) => {
  if (!recommendations) return null;

  return (
    <div className="onboarding-screen relative flex flex-col min-h-screen overflow-hidden">
      <div className="onboarding-glow" />

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8">
        <span className="text-sm tracking-widest uppercase mb-4 onboarding-label">
          Your Plan
        </span>
        <h2 className="text-2xl md:text-3xl font-medium max-w-lg leading-relaxed onboarding-question mb-3">
          Your Personalized Plan
        </h2>
        <p className="text-base leading-relaxed onboarding-transcript mb-8 max-w-lg">
          {recommendations.insights}
        </p>

        <h3 className="text-lg font-medium onboarding-question mb-4">Your Goals</h3>

        <div className="space-y-3 mb-8 flex-1">
          {recommendations.goals.map((goal, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(10px)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-0.5"
                style={{ background: "hsl(0 0% 100% / 0.25)", color: "hsl(0 0% 100%)" }}
              >
                {idx + 1}
              </div>
              <p className="onboarding-question leading-relaxed text-[15px]">{goal}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onViewCalendar}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-medium onboarding-btn-continue transition-all active:scale-[0.98]"
          >
            <Calendar className="w-5 h-5" />
            View Calendar
          </button>
          <button
            onClick={onAdjustPlan}
            className="flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-medium onboarding-btn-secondary transition-all active:scale-[0.98]"
            style={{ border: "1px solid hsl(0 0% 100% / 0.3)" }}
          >
            <MessageCircle className="w-5 h-5" />
            Adjust
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
