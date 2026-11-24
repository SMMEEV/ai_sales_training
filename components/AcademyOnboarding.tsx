import React, { useState, useEffect } from "react";
import {
  User,
  CheckCircle,
  Zap,
  Target,
  BookOpen,
  Loader2,
  ArrowRight,
  Trophy,
} from "lucide-react";

export interface UserProfile {
  name: string;
  education: string;
  background: string;
  experienceLevel: string;
  goals: string[];
}

interface AcademyOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const SALES_FACTS = [
  "Dale Carnegie made millions by improving his sales skills and teaching others the art of winning friends and influencing people.",
  "Joe Girard, listed in the Guinness Book of World Records, sold 13,001 cars in 15 years by mastering relationship building.",
  "Mary Kay Ash built a billion-dollar cosmetics empire starting with a $5,000 investment and unparalleled sales techniques.",
  "Zig Ziglar became one of the most successful motivational speakers by emphasizing that 'you will get all you want in life, if you help enough other people get what they want.'",
  "John H. Patterson developed the world's first sales training manual and helped his company NCR define modern sales practices forever.",
];

export const AcademyOnboarding: React.FC<AcademyOnboardingProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<
    "profile" | "profile_success" | "loading" | "assessment" | "result"
  >("profile");
  const [profileStep, setProfileStep] = useState(1);
  const [currentFact, setCurrentFact] = useState(SALES_FACTS[0]);

  useEffect(() => {
    if (step === "loading") {
      setCurrentFact(
        SALES_FACTS[Math.floor(Math.random() * SALES_FACTS.length)],
      );
    }
  }, [step]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    education: "",
    background: "",
    experienceLevel: "",
    goals: [] as string[],
  });

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleProfileSubmit = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("profile_success");
    }, 2500);
  };

  const [assessmentAnswers, setAssessmentAnswers] = useState<
    Record<number, number>
  >({});

  const handleAssessmentSubmit = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("result");
    }, 3000);
  };

  if (step === "profile_success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-60 -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[100px] opacity-60 -ml-40 -mb-40 pointer-events-none"></div>

        <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-12 border border-white text-center animate-fade-in z-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Your Profile is Ready!
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Thanks for sharing your goals and background. Let's start by
            evaluating your current skills.
          </p>
          <button
            onClick={() => setStep("assessment")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-[1rem] font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-indigo-600/20 group flex items-center justify-center gap-2 mx-auto w-full"
          >
            Take Your First Exam{" "}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (step === "profile") {
    const isStepValid =
      (profileStep === 1 && formData.name.trim() !== "") ||
      (profileStep === 2 && formData.education.trim() !== "") ||
      (profileStep === 3 && formData.background !== "") ||
      (profileStep === 4 && formData.experienceLevel !== "") ||
      (profileStep === 5 && formData.goals.length > 0);

    const handleNextStep = () => {
      if (profileStep < 5) {
        setProfileStep((prev) => prev + 1);
      } else {
        handleProfileSubmit();
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-60 -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[100px] opacity-60 -ml-40 -mb-40 pointer-events-none"></div>

        <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-10 md:p-14 border border-white flex flex-col min-h-[480px] relative overflow-hidden transition-all duration-500 animate-fade-in z-10">
          {/* Progress bar */}
          <div
            className="absolute top-0 left-0 h-2 bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${(profileStep / 5) * 100}%` }}
          ></div>
          <div className="absolute top-0 left-0 h-2 w-full bg-slate-100 -z-10"></div>

          <div className="flex-1">
            <div className="text-sm font-bold text-indigo-600 mb-8 tracking-widest uppercase flex items-center gap-2">
              Step {profileStep} of 5
            </div>

            <div className="animate-fade-in-up" key={profileStep}>
              {profileStep === 1 && (
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                    Siapa namamu?
                  </h2>
                  <input
                    type="text"
                    autoFocus
                    className="w-full text-2xl md:text-4xl font-bold px-0 py-4 border-b-2 border-slate-200 bg-transparent focus:border-indigo-600 focus:outline-none transition-colors placeholder:text-slate-300"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && isStepValid && handleNextStep()
                    }
                    placeholder="Ketik namamu di sini..."
                  />
                </div>
              )}

              {profileStep === 2 && (
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                    Pendidikan terakhirmu?
                  </h2>
                  <input
                    type="text"
                    autoFocus
                    className="w-full text-2xl md:text-4xl font-bold px-0 py-4 border-b-2 border-slate-200 bg-transparent focus:border-indigo-600 focus:outline-none transition-colors placeholder:text-slate-300"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && isStepValid && handleNextStep()
                    }
                    placeholder="Contoh: SMA / S1 Manajemen"
                  />
                </div>
              )}

              {profileStep === 3 && (
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
                    Apa latar belakang pekerjaanmu?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Mahasiswa",
                      "Pekerja Profesional",
                      "Pengusaha / Entrepreneur",
                      "Lainnya",
                    ].map((bg) => (
                      <div
                        key={bg}
                        onClick={() => {
                          setFormData({ ...formData, background: bg });
                          setTimeout(() => handleNextStep(), 300);
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-lg font-bold flex items-center justify-between group ${
                          formData.background === bg
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        {bg}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.background === bg ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                        >
                          {formData.background === bg && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileStep === 4 && (
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
                    Seberapa jauh kamu tahu tentang sales & marketing?
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        val: "beginner",
                        title: "Beginner",
                        desc: "Belum tahu sama sekali",
                      },
                      {
                        val: "intermediate",
                        title: "Intermediate",
                        desc: "Paham teori, tapi jarang praktik",
                      },
                      {
                        val: "professional",
                        title: "I am a professional",
                        desc: "Sudah berpengalaman",
                      },
                    ].map((exp) => (
                      <div
                        key={exp.val}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            experienceLevel: exp.val,
                          });
                          setTimeout(() => handleNextStep(), 300);
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-6 group ${
                          formData.experienceLevel === exp.val
                            ? "border-indigo-600 bg-indigo-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${formData.experienceLevel === exp.val ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                        >
                          {formData.experienceLevel === exp.val && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-bold text-xl mb-1 ${formData.experienceLevel === exp.val ? "text-indigo-900" : "text-slate-900"}`}
                          >
                            {exp.title}
                          </div>
                          <div
                            className={
                              formData.experienceLevel === exp.val
                                ? "text-indigo-700 font-medium"
                                : "text-slate-500"
                            }
                          >
                            {exp.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileStep === 5 && (
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
                    Apa tujuan utamamu di sini?{" "}
                    <span className="text-lg text-slate-400 font-medium ml-2 relative -top-1 block mt-2 sm:inline sm:mt-0">
                      (Pilih minimal satu)
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {[
                      { id: "belajar", label: "Belajar hal baru" },
                      { id: "mengasah", label: "Mengasah skill" },
                      { id: "idk", label: "I don't know (Cari referensi)" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-6 p-6 rounded-2xl border-2 cursor-pointer transition-all group ${
                          formData.goals.includes(opt.id)
                            ? "border-indigo-600 bg-indigo-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors ${formData.goals.includes(opt.id) ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}
                        >
                          {formData.goals.includes(opt.id) && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.goals.includes(opt.id)}
                          onChange={() => handleGoalToggle(opt.id)}
                        />
                        <span
                          className={`text-xl font-bold ${formData.goals.includes(opt.id) ? "text-indigo-900" : "text-slate-700"}`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-10 flex items-center justify-between mt-auto">
            {profileStep > 1 ? (
              <button
                onClick={() => setProfileStep((prev) => prev - 1)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Kembali
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNextStep}
              disabled={!isStepValid}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-[1rem] font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {profileStep === 5 ? "Selesai & Simpan" : "Lanjut"}{" "}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative mb-12 z-10 p-10 md:p-16 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white max-w-2xl mx-auto flex flex-col flex-grow-0 items-center animate-fade-in">
          <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <Zap className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 text-center">
            We are setting up your way...
          </h2>

          <div className="w-full h-px bg-slate-100 my-8"></div>

          <div className="w-full">
            <div className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" /> Did you know?
            </div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed italic text-center">
              "{currentFact}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "assessment") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3 inline-block">
                Basic Assessment
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Let's check your current skills
              </h2>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                id: 1,
                q: "A prospect says 'It's too expensive', how do you respond?",
                opts: [
                  "Agree and offer discount",
                  "Justify the price with features",
                  "Ask 'Compared to what?' to understand their baseline",
                  "Walk away immediately",
                ],
              },
              {
                id: 2,
                q: "When is the best time to attempt a trial close?",
                opts: [
                  "Only at the very end of the meeting",
                  "Right after introducing yourself",
                  "After resolving a major objection or presenting strong value",
                  "When the prospect looks bored",
                ],
              },
              {
                id: 3,
                q: "What is the primary goal of the 'Discovery' phase?",
                opts: [
                  "To pitch your product immediately",
                  "To uncover the true pain points and motivations of the prospect",
                  "To negotiate pricing",
                  "To collect their email address",
                ],
              },
            ].map((q, qId) => (
              <div
                key={q.id}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <h3 className="font-bold text-slate-900 mb-4">
                  {q.id}. {q.q}
                </h3>
                <div className="space-y-3">
                  {q.opts.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                        assessmentAnswers[q.id] === i
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        checked={assessmentAnswers[q.id] === i}
                        onChange={() =>
                          setAssessmentAnswers((prev) => ({
                            ...prev,
                            [q.id]: i,
                          }))
                        }
                      />
                      <span
                        className={`${assessmentAnswers[q.id] === i ? "text-indigo-900 font-medium" : "text-slate-600"}`}
                      >
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-between">
            <button
              onClick={() => setStep("profile_success")}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleAssessmentSubmit}
              disabled={Object.keys(assessmentAnswers).length < 3}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100 animate-fade-in text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl shadow-lg shadow-indigo-500/30 flex items-center justify-center mb-6 transform rotate-3">
            <span className="text-4xl font-black text-white transform -rotate-3">
              78
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Assessment Complete!
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-10">
            AI has analyzed your responses. Here is your baseline profile report
            to guide your upcoming journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" /> 3 Strengths
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>
                    Strong intuitive understanding of discovery process
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>Good awareness of objection handling principles</span>
                </li>
                <li className="flex gap-3 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>Analytical approach to pricing resistance</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" /> 2 Areas for
                Improvement
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-amber-800">
                  <div className="w-4 h-4 rounded-full bg-amber-200 border-2 border-amber-500 shrink-0 mt-0.5"></div>
                  <span>
                    Needs better framing for value justification before
                    discussing price
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-amber-800">
                  <div className="w-4 h-4 rounded-full bg-amber-200 border-2 border-amber-500 shrink-0 mt-0.5"></div>
                  <span>Timing of trial closures can be more strategic</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => onComplete(formData)}
            className="w-full relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 group overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Enter Academy{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
