import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, Flame, Dumbbell, Salad, Wind } from "lucide-react";
import type { Activity, AppView } from "@/hooks/useAppState";
import BottomNav from "./BottomNav";

interface CalendarViewProps {
  weeklyPlan: Activity[];
  completedActivities: Set<string>;
  toggleActivity: (name: string) => void;
  setCurrentView: (view: AppView) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6am to 10pm

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "workout": return Dumbbell;
    case "meal": return Salad;
    case "stretch": return Wind;
    default: return Flame;
  }
}

function parseHour(time: string): number {
  const [h] = time.split(":").map(Number);
  return h;
}

function getWeekDates(baseDate: Date): Date[] {
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const CalendarView = ({ weeklyPlan, completedActivities, toggleActivity, setCurrentView }: CalendarViewProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const baseWeekDate = new Date(today);
  baseWeekDate.setDate(baseWeekDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseWeekDate);

  const isToday = isSameDay(selectedDate, today);

  // Map activities to their hour slots
  const activityByHour = new Map<number, Activity[]>();
  weeklyPlan.forEach(activity => {
    const hour = parseHour(activity.time);
    if (!activityByHour.has(hour)) activityByHour.set(hour, []);
    activityByHour.get(hour)!.push(activity);
  });

  return (
    <div className="onboarding-screen relative min-h-screen overflow-hidden pb-24">
      <div className="onboarding-glow" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-light onboarding-question">Schedule</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2 rounded-full transition-all active:scale-95"
              style={{ background: "hsl(0 0% 100% / 0.15)" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => { setWeekOffset(0); setSelectedDate(today); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
              style={{ background: weekOffset === 0 ? "hsl(0 0% 100% / 0.25)" : "hsl(0 0% 100% / 0.1)" }}
            >
              <span className="onboarding-question text-xs">Today</span>
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2 rounded-full transition-all active:scale-95"
              style={{ background: "hsl(0 0% 100% / 0.15)" }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Week day selector */}
        <div className="flex justify-between gap-1">
          {weekDates.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isSameDay(date, today);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className="flex-1 flex flex-col items-center py-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: isSelected ? "hsl(0 0% 100% / 0.25)" : "transparent",
                }}
              >
                <span className="text-[10px] font-medium mb-1" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                  {dayLabels[i]}
                </span>
                <span
                  className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full ${isTodayDate && !isSelected ? "ring-1 ring-white/40" : ""}`}
                  style={{
                    color: isSelected ? "hsl(174 84% 32%)" : "hsl(0 0% 100% / 0.9)",
                    background: isSelected ? "hsl(0 0% 100% / 0.9)" : "transparent",
                  }}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-sm onboarding-label mt-3">
          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Hourly Grid */}
      <div className="relative z-10 px-4 py-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
        <div className="relative">
          {HOURS.map(hour => {
            const activities = activityByHour.get(hour) || [];
            const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
            const formattedLabel = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;

            return (
              <div key={hour} className="flex min-h-[52px]">
                {/* Time gutter */}
                <div className="w-14 flex-shrink-0 pt-0.5 text-right pr-3">
                  <span className="text-[11px] font-medium" style={{ color: "hsl(0 0% 100% / 0.4)" }}>
                    {formattedLabel}
                  </span>
                </div>

                {/* Grid line + activities */}
                <div className="flex-1 relative border-t" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
                  {activities.length === 0 ? (
                    <div className="h-[52px]" />
                  ) : (
                    <div className="py-1 space-y-1">
                      {activities.map(activity => {
                        const isCompleted = completedActivities.has(activity.name);
                        const isExpanded = expandedActivity === activity.name;
                        const Icon = getActivityIcon(activity.type);
                        // Height based on duration
                        const blocks = Math.max(1, Math.ceil(activity.duration / 30));

                        return (
                          <div
                            key={activity.name}
                            className="rounded-xl px-3 py-2 cursor-pointer transition-all active:scale-[0.98]"
                            style={{
                              background: `${activity.color}22`,
                              borderLeft: `3px solid ${activity.color}`,
                              minHeight: `${blocks * 44}px`,
                            }}
                            onClick={() => setExpandedActivity(isExpanded ? null : activity.name)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: activity.color }} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium onboarding-question truncate">{activity.name}</p>
                                  <p className="text-[11px]" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                                    {activity.time} · {activity.duration} min
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleActivity(activity.name); }}
                                className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all"
                                style={
                                  isCompleted
                                    ? { background: "hsl(0 0% 100% / 0.9)", borderColor: "hsl(0 0% 100% / 0.9)" }
                                    : { borderColor: "hsl(0 0% 100% / 0.25)" }
                                }
                              >
                                {isCompleted && <Check className="w-3 h-3 text-primary" />}
                              </button>
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                              <div
                                className="mt-3 pt-3 space-y-2 animate-fade-in"
                                style={{ borderTop: `1px solid ${activity.color}44` }}
                              >
                                <p className="text-sm onboarding-transcript">{activity.description}</p>
                                <div className="flex items-center gap-4 text-[11px]" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {activity.duration} minutes
                                  </span>
                                  <span className="capitalize">{activity.type}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav currentView="calendar" setCurrentView={setCurrentView} />
    </div>
  );
};

export default CalendarView;
