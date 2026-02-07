import { useAppState } from "@/hooks/useAppState";
import Onboarding from "@/components/Onboarding";
import StatsForm from "@/components/StatsForm";
import Recommendations from "@/components/Recommendations";
import CalendarView from "@/components/CalendarView";
import ChatView from "@/components/ChatView";
import Dashboard from "@/components/Dashboard";

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
  } = useAppState();

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
          onSubmit={generateRecommendations}
        />
      );
    case "recommendations":
      return (
        <Recommendations
          recommendations={recommendations}
          onViewCalendar={() => setCurrentView("calendar")}
          onAdjustPlan={() => setCurrentView("chat")}
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
    case "chat":
      return (
        <ChatView
          chatHistory={chatHistory}
          sendChat={sendChat}
          isListening={isListening}
          toggleListening={toggleListening}
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

export default Index;
