import { Check } from "lucide-react";
import type { Activity, AppView } from "@/hooks/useAppState";
import BottomNav from "./BottomNav";

interface CalendarViewProps {
  weeklyPlan: Activity[];
  completedActivities: Set<string>;
  toggleActivity: (name: string) => void;
  setCurrentView: (view: AppView) => void;
}

const CalendarView = ({ weeklyPlan, completedActivities, toggleActivity, setCurrentView }: CalendarViewProps) => {
  return (
    <div className="onboarding-screen relative min-h-screen overflow-hidden pb-24">
      <div className="onboarding-glow" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <h2 className="text-2xl font-light onboarding-question mb-1">Today's Schedule</h2>
        <p className="text-sm onboarding-label">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Activities */}
      <div className="relative z-10 max-w-[600px] mx-auto px-5 py-4 space-y-3">
        {weeklyPlan.map((activity) => {
          const isCompleted = completedActivities.has(activity.name);
          return (
            <div
              key={activity.name}
              className="rounded-2xl p-5 flex justify-between items-start transition-all cursor-pointer active:scale-[0.98]"
              style={{
                background: "hsl(0 0% 100% / 0.15)",
                backdropFilter: "blur(10px)",
                borderLeft: `4px solid ${activity.color}`,
              }}
              onClick={() => toggleActivity(activity.name)}
            >
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: "hsl(0 0% 100% / 0.6)" }}>
                  {activity.time} · {activity.duration} min
                </p>
                <p className="text-lg font-medium mb-1 onboarding-question">{activity.name}</p>
                <p className="text-sm onboarding-transcript">{activity.description}</p>
              </div>
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? "" : ""
                }`}
                style={
                  isCompleted
                    ? { background: "hsl(0 0% 100% / 0.9)", borderColor: "hsl(0 0% 100% / 0.9)" }
                    : { borderColor: "hsl(0 0% 100% / 0.3)" }
                }
              >
                {isCompleted && <Check className="w-4 h-4 text-primary" />}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav currentView="calendar" setCurrentView={setCurrentView} />
    </div>
  );
};

export default CalendarView;
