import { TrendingUp, CalendarDays } from "lucide-react";
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

  // Monthly insights data
  const monthlyInsights = {
    totalWorkouts: 24,
    avgCompletionRate: 78,
    streakRecord: 7,
    mostActiveDay: "Wednesday",
    improvement: "+12%",
    topActivity: "Morning Cardio",
    caloriesBurned: 4800,
    minutesActive: 720,
  };

  return (
    <div className="onboarding-screen relative min-h-screen overflow-hidden pb-24">
      <div className="onboarding-glow" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <h2 className="text-2xl font-light onboarding-question">Your Progress</h2>
      </div>

      <div className="relative z-10 max-w-[600px] mx-auto px-5 py-4 space-y-4">
        {/* Today card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(10px)" }}
        >
          <h3 className="text-lg font-medium onboarding-question mb-4">Today</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-5xl font-light onboarding-question">{completionRate}%</span>
            <span className="onboarding-transcript text-sm">{completed} of {total} completed</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.2)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%`, background: "hsl(0 0% 100% / 0.8)" }}
            />
          </div>
        </div>

        {/* This Week */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(10px)" }}
        >
          <h3 className="text-lg font-medium onboarding-question mb-4">This Week</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-4xl font-light onboarding-question">3</span>
              <p className="text-sm onboarding-label">Day Streak</p>
            </div>
            <div>
              <span className="text-4xl font-light onboarding-question">8</span>
              <p className="text-sm onboarding-label">Workouts</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(10px)" }}
        >
          <h3 className="text-lg font-medium onboarding-question mb-4">Last 7 Days</h3>
          <div className="flex items-end justify-between gap-2 h-[120px] mb-4">
            {weekData.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t transition-all duration-300"
                style={{ height: `${value}%`, background: "hsl(0 0% 100% / 0.4)" }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {days.map((day, idx) => (
              <span key={idx} className="flex-1 text-center text-xs onboarding-label">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div
          className="rounded-2xl p-5 flex gap-3"
          style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "hsl(0 0% 100% / 0.2)" }}
          >
            <TrendingUp className="w-5 h-5 onboarding-question" />
          </div>
          <div>
            <h4 className="text-base font-medium onboarding-question mb-1">Insight</h4>
            <p className="text-sm onboarding-transcript leading-relaxed">
              You're crushing weekday workouts but struggling on weekends. Let's add lighter weekend activities!
            </p>
          </div>
        </div>

        {/* Monthly Insights */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 onboarding-question" />
            <h3 className="text-lg font-medium onboarding-question">Monthly Insights</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-5"
              style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-3xl font-light onboarding-question">{monthlyInsights.totalWorkouts}</span>
              <p className="text-sm onboarding-label mt-1">Total Workouts</p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-3xl font-light onboarding-question">{monthlyInsights.avgCompletionRate}%</span>
              <p className="text-sm onboarding-label mt-1">Avg Completion</p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-3xl font-light onboarding-question">{monthlyInsights.streakRecord}</span>
              <p className="text-sm onboarding-label mt-1">Best Streak</p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
            >
              <span className="text-3xl font-light onboarding-question">{monthlyInsights.improvement}</span>
              <p className="text-sm onboarding-label mt-1">vs Last Month</p>
            </div>
          </div>

          {/* Monthly summary card */}
          <div
            className="rounded-2xl p-5 mt-3"
            style={{ background: "hsl(0 0% 100% / 0.12)", backdropFilter: "blur(10px)" }}
          >
            <h4 className="text-base font-medium onboarding-question mb-3">This Month's Highlights</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm onboarding-transcript">Most Active Day</span>
                <span className="text-sm font-medium onboarding-question">{monthlyInsights.mostActiveDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm onboarding-transcript">Top Activity</span>
                <span className="text-sm font-medium onboarding-question">{monthlyInsights.topActivity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm onboarding-transcript">Minutes Active</span>
                <span className="text-sm font-medium onboarding-question">{monthlyInsights.minutesActive} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm onboarding-transcript">Calories Burned</span>
                <span className="text-sm font-medium onboarding-question">{monthlyInsights.caloriesBurned} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentView="dashboard" setCurrentView={setCurrentView} />
    </div>
  );
};

export default Dashboard;
