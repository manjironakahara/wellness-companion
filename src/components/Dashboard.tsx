import { TrendingUp } from "lucide-react";
import type { Activity, AppView } from "@/hooks/useAppState";
import BottomNav from "./BottomNav";

interface DashboardProps {
  weeklyPlan: Activity[];
  completedActivities: Set<string>;
  setCurrentView: (view: AppView) => void;
}

const Dashboard = ({ weeklyPlan, completedActivities, setCurrentView }: DashboardProps) => {
  const trackable = weeklyPlan.filter(a => a.type === "workout" || a.type === "stretch");
  const total = trackable.length;
  const completed = Array.from(completedActivities).filter(name =>
    trackable.some(a => a.name === name)
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const weekData = [65, 80, 90, 75, 100, 70, completionRate];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-5 py-6">
        <h2 className="text-2xl font-light">Your Progress</h2>
      </div>

      <div className="max-w-[600px] mx-auto px-5 py-6 space-y-4">
        {/* Today card */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-medium text-foreground mb-4">Today</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-5xl font-light text-primary">{completionRate}%</span>
            <span className="text-muted-foreground">{completed} of {total} completed</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* This Week */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-medium text-foreground mb-4">This Week</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-4xl font-light text-foreground">3</span>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div>
              <span className="text-4xl font-light text-foreground">8</span>
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-medium text-foreground mb-4">Last 7 Days</h3>
          <div className="flex items-end justify-between gap-2 h-[120px] mb-4">
            {weekData.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 bg-primary rounded-t transition-all duration-300"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {days.map((day, idx) => (
              <span key={idx} className="flex-1 text-center text-xs text-muted-foreground">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="insight-gradient border rounded-2xl p-5 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-insight-accent flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h4 className="text-base font-medium text-foreground mb-1">Insight</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're crushing weekday workouts but struggling on weekends. Let's add lighter weekend activities!
            </p>
          </div>
        </div>
      </div>

      <BottomNav currentView="dashboard" setCurrentView={setCurrentView} />
    </div>
  );
};

export default Dashboard;
