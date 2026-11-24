import React, { useState, useEffect } from "react";
import { Target, ChevronRight, ChevronLeft } from "lucide-react";
import { UserProfile } from "./AcademyOnboarding";
import { useAuth } from "../contexts/AuthContext";

export const AcademyTourAndRegistration: React.FC<{
  onComplete: (profile: UserProfile) => void;
}> = ({ onComplete }) => {
  const [formStep, setFormStep] = useState(0); // 0: delayed intro, 1: name, 2: background, 3: experience, 4: generation
  const [formData, setFormData] = useState({
    name: "",
    background: "",
    salesExperience: "",
  });

  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.name && !formData.name) {
      setFormData((prev) => ({ ...prev, name: profile.name }));
    }
  }, [profile?.name]);

  // Initial delay
  useEffect(() => {
    if (formStep === 0) {
      const timer = setTimeout(() => {
        setFormStep(1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [formStep]);

  // Prevent background scrolling
  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const handleNext = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else if (formStep === 3) {
      setFormStep(4);
      startGeneration();
    }
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const startGeneration = () => {
    let p = 0;
    const step = () => {
      let increment = Math.floor(Math.random() * 3) + 1;
      if (p > 30) increment = Math.floor(Math.random() * 5) + 3;
      if (p > 60) increment = Math.floor(Math.random() * 10) + 5;
      if (p > 85) increment = Math.floor(Math.random() * 15) + 10;

      p += increment;
      if (p >= 100) p = 100;
      setProgress(p);

      if (p < 30) setProgressMsg("Mapping your profile...");
      else if (p < 60) setProgressMsg("Determining best learning paths...");
      else if (p < 90) setProgressMsg("Finalizing your custom curriculum...");
      else setProgressMsg("Your program has been successfully generated!");

      if (p < 100) {
        const delay = p > 80 ? 100 : p > 50 ? 250 : 500;
        setTimeout(step, delay);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete({
              name: formData.name || "Student",
              education: "Not specified",
              background: formData.background,
              experienceLevel: formData.salesExperience,
              goals: ["Improve sales skills"],
            });
          }, 500);
        }, 1500);
      }
    };
    setTimeout(step, 500);
  };

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
        {formStep === 0 ? (
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 animate-pulse">
              <Target className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 drop-shadow-md">
              Welcome to Academy
            </h2>
            <p className="text-indigo-100 font-medium text-lg max-w-md mx-auto">
              Preparing your onboarding experience...
            </p>
          </div>
        ) : (
          <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-slide-up">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Build Your Profile
              </h2>
              <p className="text-slate-500 font-medium max-w-md">
                Tell us a bit about yourself to personalize your academy
                experience.
              </p>
            </div>

            <div className="p-8">
              {formStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">
                      What is your name?
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 text-lg"
                      placeholder="e.g., John Doe"
                      autoFocus
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!formData.name.trim()}
                      className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md"
                    >
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">
                      What is your professional background?
                    </label>
                    <input
                      type="text"
                      value={formData.background}
                      onChange={(e) =>
                        setFormData({ ...formData, background: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 text-lg"
                      placeholder="e.g., Marketing, Customer Success, etc."
                      autoFocus
                    />
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!formData.background.trim()}
                      className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md"
                    >
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <label className="block text-lg font-bold text-slate-700 mb-4">
                    How long have you known about the sales world?
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      "Brand new to sales",
                      "Less than 1 year",
                      "1-3 years",
                      "3+ years",
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          setFormData({ ...formData, salesExperience: opt })
                        }
                        className={`px-5 py-4 rounded-xl border-2 font-bold text-left transition-all ${
                          formData.salesExperience === opt
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!formData.salesExperience}
                      className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-md"
                    >
                      Generate Program <Target className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {formStep === 4 && (
                <div className="py-8 flex flex-col items-center text-center animate-fade-in">
                  <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="8"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all"
                        style={{ transitionDuration: "400ms" }}
                      />
                    </svg>
                    <span className="text-2xl font-black text-slate-900">
                      {progress}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    {progress === 100 ? "Ready!" : "Curating Academy..."}
                  </h3>
                  <p className="text-slate-500 font-medium">{progressMsg}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
