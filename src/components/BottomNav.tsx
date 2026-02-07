import { Calendar, MessageCircle, TrendingUp } from "lucide-react";
import type { AppView } from "@/hooks/useAppState";

interface BottomNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const navItems = [
  { view: "calendar" as AppView, icon: Calendar, label: "Calendar" },
  { view: "chat" as AppView, icon: MessageCircle, label: "Chat" },
  { view: "dashboard" as AppView, icon: TrendingUp, label: "Progress" },
];

const BottomNav = ({ currentView, setCurrentView }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-4 flex justify-around shadow-nav z-50">
      {navItems.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          onClick={() => setCurrentView(view)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-transparent transition-colors ${
            currentView === view ? "text-primary" : "text-muted-foreground/60"
          }`}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
