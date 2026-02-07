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
    <div className="max-w-[600px] mx-auto px-5 py-10">
      <h1 className="text-[28px] font-light text-foreground leading-snug mb-6">
        Just a few more details
      </h1>

      <div className="bg-card rounded-2xl p-8 shadow-elevated">
        {/* Unit toggle */}
        <div className="flex gap-2 bg-muted p-1 rounded-full mb-6">
          <button
            onClick={() => setUseMetric(false)}
            className={`flex-1 py-2.5 px-5 rounded-full text-base font-medium transition-all ${
              !useMetric ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            Imperial
          </button>
          <button
            onClick={() => setUseMetric(true)}
            className={`flex-1 py-2.5 px-5 rounded-full text-base font-medium transition-all ${
              useMetric ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            Metric
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Weight ({useMetric ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              value={userData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              className="w-full p-3 px-4 border border-input rounded-xl text-base outline-none focus:border-primary transition-colors bg-card"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Height ({useMetric ? "cm" : "in"})
            </label>
            <input
              type="number"
              value={userData.height}
              onChange={(e) => updateField("height", e.target.value)}
              className="w-full p-3 px-4 border border-input rounded-xl text-base outline-none focus:border-primary transition-colors bg-card"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Age</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => updateField("age", e.target.value)}
              className="w-full p-3 px-4 border border-input rounded-xl text-base outline-none focus:border-primary transition-colors bg-card"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Gender</label>
            <select
              value={userData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="w-full p-3 px-4 border border-input rounded-xl text-base outline-none focus:border-primary transition-colors bg-card"
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
          className="w-full mt-6 rounded-full px-8 py-4 text-base font-medium bg-primary text-primary-foreground shadow-button transition-all active:scale-[0.98] hover:opacity-90"
        >
          Generate My Plan
        </button>
      </div>
    </div>
  );
};

export default StatsForm;
