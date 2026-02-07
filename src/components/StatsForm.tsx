import type { UserData } from "@/hooks/useAppState";

interface StatsFormProps {
  useMetric: boolean;
  setUseMetric: (val: boolean) => void;
  userData: UserData;
  setUserData: (fn: (prev: UserData) => UserData) => void;
  onSubmit: () => void;
}

const StatsForm = ({ useMetric, setUseMetric, userData, setUserData, onSubmit }: StatsFormProps) => {
  const updateField = (key: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="onboarding-screen relative flex flex-col min-h-screen overflow-hidden">
      <div className="onboarding-glow" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <span className="text-sm tracking-widest uppercase mb-4 onboarding-label">
          Almost There
        </span>
        <h1 className="text-2xl md:text-3xl font-medium text-center max-w-lg leading-relaxed onboarding-question mb-8">
          Just a few more details
        </h1>

        <div className="w-full max-w-md space-y-5">
          {/* Unit toggle */}
          <div className="flex gap-2 p-1 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.15)' }}>
            <button
              onClick={() => setUseMetric(false)}
              className={`flex-1 py-2.5 px-5 rounded-full text-base font-medium transition-all ${
                !useMetric
                  ? "text-primary"
                  : "text-white/70"
              }`}
              style={!useMetric ? { background: 'hsl(0 0% 100% / 0.9)' } : {}}
            >
              Imperial
            </button>
            <button
              onClick={() => setUseMetric(true)}
              className={`flex-1 py-2.5 px-5 rounded-full text-base font-medium transition-all ${
                useMetric
                  ? "text-primary"
                  : "text-white/70"
              }`}
              style={useMetric ? { background: 'hsl(0 0% 100% / 0.9)' } : {}}
            >
              Metric
            </button>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 onboarding-label">
                Weight ({useMetric ? "kg" : "lbs"})
              </label>
              <input
                type="number"
                value={userData.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className="w-full p-3 px-4 rounded-xl text-base outline-none onboarding-textarea"
                placeholder={useMetric ? "e.g., 70" : "e.g., 155"}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 onboarding-label">
                Height ({useMetric ? "cm" : "in"})
              </label>
              <input
                type="number"
                value={userData.height}
                onChange={(e) => updateField("height", e.target.value)}
                className="w-full p-3 px-4 rounded-xl text-base outline-none onboarding-textarea"
                placeholder={useMetric ? "e.g., 175" : "e.g., 68"}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 onboarding-label">Birthday</label>
              <input
                type="date"
                value={userData.birthday}
                onChange={(e) => updateField("birthday", e.target.value)}
                className="w-full p-3 px-4 rounded-xl text-base outline-none onboarding-textarea"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 onboarding-label">Gender</label>
              <select
                value={userData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full p-3 px-4 rounded-xl text-base outline-none onboarding-textarea"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="w-full rounded-full px-8 py-4 text-base font-medium onboarding-btn-continue transition-all active:scale-[0.98] mt-2"
          >
            Generate My Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsForm;
