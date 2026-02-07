import { Check } from "lucide-react";
import type { Activity } from "@/hooks/useAppState";
import BottomNav from "./BottomNav";
import type { AppView } from "@/hooks/useAppState";

interface CalendarViewProps {
  weeklyPlan: Activity[];
  completedActivities: Set<string>;
  toggleActivity: (name: string) => void;
  setCurrentView: (view: AppView) => void;
}

const CalendarView = ({ weeklyPlan, completedActivities, toggleActivity, setCurrentView }: CalendarViewProps) => {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-5 py-6">
        <h2 className="text-2xl font-light mb-1">Today's Schedule</h2>
        <p className="text-primary-foreground/80 text-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Activities */}
      <div className="max-w-[600px] mx-auto px-5 py-6 space-y-3">
        {weeklyPlan.map((activity) => {
          const isCompleted = completedActivities.has(activity.name);
          return (
            <div
              key={activity.name}
              className="bg-card rounded-2xl p-5 shadow-card flex justify-between items-start transition-shadow hover:shadow-elevated cursor-pointer"
              style={{ borderLeft: `4px solid ${activity.color}` }}
              onClick={() => toggleActivity(activity.name)}
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {activity.time} · {activity.duration} min
                </p>
                <p className="text-lg font-medium text-foreground mb-1">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted
                    ? "bg-primary border-primary"
                    : "border-border"
                }`}
              >
                {isCompleted && <Check className="w-4 h-4 text-primary-foreground" />}
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
