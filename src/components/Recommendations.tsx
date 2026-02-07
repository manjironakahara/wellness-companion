import type { Recommendations as RecommendationsType } from "@/hooks/useAppState";
import { Calendar, MessageCircle } from "lucide-react";

interface RecommendationsProps {
  recommendations: RecommendationsType | null;
  onViewCalendar: () => void;
  onAdjustPlan: () => void;
}

const Recommendations = ({ recommendations, onViewCalendar, onAdjustPlan }: RecommendationsProps) => {
  if (!recommendations) return null;

  return (
    <div className="max-w-[600px] mx-auto px-5 py-10">
      <h2 className="text-[32px] font-light text-foreground mb-4">
        Your Personalized Plan
      </h2>
      <p className="text-base text-muted-foreground leading-relaxed mb-8">
        {recommendations.insights}
      </p>

      <h3 className="text-xl font-medium text-foreground mb-4">Your Goals</h3>

      <div className="space-y-4 mb-8">
        {recommendations.goals.map((goal, idx) => (
          <div key={idx} className="bg-card rounded-2xl p-6 shadow-card flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm flex-shrink-0 mt-1">
              {idx + 1}
            </div>
            <p className="text-foreground leading-relaxed">{goal}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewCalendar}
          className="flex-1 flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-medium bg-primary text-primary-foreground shadow-button transition-all active:scale-[0.98]"
        >
          <Calendar className="w-5 h-5" />
          View Calendar
        </button>
        <button
          onClick={onAdjustPlan}
          className="flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-medium bg-card text-primary border border-primary shadow-button transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5" />
          Adjust
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
