import { useAppState } from "@/hooks/useAppState";
import Onboarding from "@/components/Onboarding";
import StatsForm from "@/components/StatsForm";
import AuthPage from "@/components/AuthPage";
import Recommendations from "@/components/Recommendations";
import CalendarView from "@/components/CalendarView";
import Dashboard from "@/components/Dashboard";
import FloatingChat from "@/components/FloatingChat";

const Index = () => {
  const {
    currentView, setCurrentView,
    onboardingStep,
    isListening, toggleListening,
    transcript, setTranscript,
    useMetric, setUseMetric,
    userData, setUserData,
    recommendations,
    weeklyPlan,
    completedActivities, toggleActivity,
    chatHistory, sendChat,
    handleOnboardingNext,
    handleOnboardingBack,
    generateRecommendations,
    isGenerating,
  } = useAppState();

  // Show floating chat on calendar and dashboard views
  const showFloatingChat = currentView === "calendar" || currentView === "dashboard";

  const renderView = () => {
    switch (currentView) {
      case "onboarding":
        return (
          <Onboarding
            step={onboardingStep}
            transcript={transcript}
            setTranscript={setTranscript}
            isListening={isListening}
            toggleListening={toggleListening}
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
          />
        );
      case "stats":
        return (
          <StatsForm
            useMetric={useMetric}
            setUseMetric={setUseMetric}
            userData={userData}
            setUserData={setUserData}
            onSubmit={() => setCurrentView("auth")}
          />
        );
      case "auth":
        return (
          <AuthPage
            onComplete={() => generateRecommendations()}
            onSkip={() => generateRecommendations()}
          />
        );
      case "recommendations":
        return (
          <Recommendations
            recommendations={recommendations}
            isGenerating={isGenerating}
            onViewCalendar={() => setCurrentView("calendar")}
            onAdjustPlan={() => setCurrentView("calendar")}
          />
        );
      case "calendar":
        return (
          <CalendarView
            weeklyPlan={weeklyPlan}
            completedActivities={completedActivities}
            toggleActivity={toggleActivity}
            setCurrentView={setCurrentView}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            weeklyPlan={weeklyPlan}
            completedActivities={completedActivities}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderView()}
      {showFloatingChat && (
        <FloatingChat
          chatHistory={chatHistory}
          sendChat={sendChat}
        />
      )}
    </>
  );
};

export default Index;
