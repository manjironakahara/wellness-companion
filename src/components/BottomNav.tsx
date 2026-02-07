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
    <nav
      className="fixed bottom-0 left-0 right-0 px-5 py-4 flex justify-around z-50"
      style={{
        background: "hsl(174 65% 45% / 0.6)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid hsl(0 0% 100% / 0.15)",
      }}
    >
      {navItems.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          onClick={() => setCurrentView(view)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-transparent transition-all ${
            currentView === view ? "" : ""
          }`}
          style={{
            color: currentView === view ? "hsl(0 0% 100%)" : "hsl(0 0% 100% / 0.5)",
          }}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
