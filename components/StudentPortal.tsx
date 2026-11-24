import React, { useState, useMemo } from "react";
import { Course } from "./CoursesPage";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import {
  ArrowLeft,
  Edit2,
  Check,
  Award,
  Flame,
  Compass,
  Target,
  Book,
  Zap,
  Calendar,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

interface UserProfile {
  name: string;
  education: string;
  background: string;
  experienceLevel: string;
  goals: string[];
}

interface StudentPortalProps {
  courses: Course[];
  studentName: string;
  userProfile?: UserProfile | null;
  onUpdateName: (name: string) => void;
  onBack: () => void;
  onPlayCourse: (id: number) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  courses,
  studentName,
  userProfile,
  onUpdateName,
  onBack,
  onPlayCourse,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
    } else {
      setTempName(studentName);
    }
    setIsEditingName(false);
  };

  // 1. Progress Tracker
  const completedCoursesCount = courses.filter(
    (c) => c.progress === 100,
  ).length;
  const totalCourses = courses.length;
  const progressPercentage =
    totalCourses > 0
      ? Math.round((completedCoursesCount / totalCourses) * 100)
      : 0;

  // 2. Skill Radar
  // Generate dummy radar data based on course progress/exam passed
  const skillData = useMemo(() => {
    let mirroring = 40;
    let negotiation = 50;
    let closing = 30;
    let relationship = 60;
    let objection = 45;

    // boost stats based on completed courses
    courses.forEach((c) => {
      if (c.progress === 100) {
        if (c.level === "Mindset") {
          objection += 5;
          negotiation += 5;
        }
        if (c.level === "Technique") {
          mirroring += 15;
          closing += 10;
        }
        if (c.level === "Advanced") {
          relationship += 10;
          closing += 10;
        }
      }
      if (c.examPassed) {
        mirroring += 10;
        negotiation += 10;
        closing += 15;
        relationship += 10;
        objection += 10;
      }
    });

    return [
      { subject: "Mirroring", A: Math.min(mirroring, 100), fullMark: 100 },
      { subject: "Negotiation", A: Math.min(negotiation, 100), fullMark: 100 },
      { subject: "Closing", A: Math.min(closing, 100), fullMark: 100 },
      {
        subject: "Relationship",
        A: Math.min(relationship, 100),
        fullMark: 100,
      },
      {
        subject: "Objection Handling",
        A: Math.min(objection, 100),
        fullMark: 100,
      },
    ];
  }, [courses]);

  // 3. Daily Habit Log (Mock data)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const habitData = [true, true, false, true, true, false, true];

  // 4. AI Roadmap (Recommendations)
  const recommendations = courses.filter((c) => c.progress < 100).slice(0, 2);

  // 5. Discovery Corner
  const wildcardTopics = [
    {
      id: 201,
      title: "Tech Trends 2026 for Business",
      category: "Wildcard",
      imageColor: "bg-teal-600",
      level: "Insight",
      duration: "12m 00s",
    },
    {
      id: 202,
      title: "Public Speaking Fundamentals",
      category: "Wildcard",
      imageColor: "bg-rose-600",
      level: "Skill",
      duration: "20m 15s",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in pb-20 pt-8">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-12 flex flex-col lg:flex-row items-center gap-8 relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 -ml-20 -mt-20 pointer-events-none"></div>

          <div className="flex-1 text-center lg:text-left pt-6">
            <h1
              className="text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-[1.05] animate-fade-in"
              style={{ animationFillMode: "both" }}
            >
              Student <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                Portal.
              </span>
            </h1>
            <p
              className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-medium animate-slide-up delay-200"
              style={{ animationFillMode: "both" }}
            >
              Track your progress, view your AI-driven skill roadmap, and
              continue your journey to sales mastery.
            </p>
            <div
              className="mt-8 animate-slide-up delay-300"
              style={{ animationFillMode: "both" }}
            >
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Academy
              </button>
            </div>
          </div>
        </div>

        {/* Top Section: Profile & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm col-span-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-[2rem] rotate-3 flex items-center justify-center text-white text-4xl font-black shadow-xl mb-6 shadow-indigo-500/30 border-4 border-white">
              <div className="-rotate-3">
                {studentName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2 w-full">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-2xl font-black text-slate-900 text-center border-b-2 border-indigo-600 focus:outline-none bg-transparent w-[80%]"
                  autoFocus
                />
              ) : (
                <h2 className="text-2xl font-black text-slate-900">
                  {studentName}
                </h2>
              )}
            </div>

            {isEditingName ? (
              <button
                onClick={handleSaveName}
                className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full hover:bg-emerald-100 transition-colors mt-2"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full hover:text-slate-900 transition-colors mt-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Name
              </button>
            )}

            {userProfile && (
              <div className="mt-8 w-full border-t border-slate-100 pt-6 text-left">
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Education
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {userProfile.education}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Background
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {userProfile.background}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Experience Level
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {userProfile.experienceLevel}
                  </p>
                </div>
                {userProfile.goals.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Goals
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.goals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!userProfile && (
              <p className="text-sm text-slate-500 mt-6 font-medium">
                Any changes here will reflect on your certificates.
              </p>
            )}
          </div>

          {/* Progress Tracker & Habit Log */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm col-span-1 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold uppercase tracking-wider text-sm">
                  <Target className="w-5 h-5" /> Curriculum Progress
                </div>
                <h3 className="text-5xl font-black mb-2 text-slate-900">
                  {progressPercentage}%
                  <span className="text-2xl text-slate-400 font-bold ml-2">
                    Completed
                  </span>
                </h3>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mt-6">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[bounce-x_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-4">
                  {completedCoursesCount} out of {totalCourses} courses
                  finished. Keep up the great work!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-w-[280px] shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold uppercase tracking-wider text-sm">
                  <Flame className="w-5 h-5" /> Daily Habit Log
                </div>
                <div className="flex gap-2 justify-between items-end h-16 mb-2">
                  {habitData.map((active, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${active ? "bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-900" : "bg-white border border-slate-200 text-slate-300"}`}
                      >
                        {active ? <Check className="w-5 h-5" /> : null}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {daysOfWeek[idx]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm font-bold text-slate-600 bg-white py-1.5 rounded-full border border-slate-100">
                  5 Day Learning Streak! 🔥
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Radar */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Skill Radar
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={skillData}
                >
                  <defs>
                    <linearGradient
                      id="neonGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B00FF" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#00F5AA"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="neonGradientStroke"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B00FF" />
                      <stop offset="100%" stopColor="#00F5AA" />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: "bold" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="url(#neonGradientStroke)"
                    fill="url(#neonGradient)"
                    strokeWidth={3}
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-slate-500 font-medium">
              Your mapped strengths based on simulation and exam results.
            </p>
          </div>

          <div className="space-y-6">
            {/* AI Roadmap */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 border border-cyan-100">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  AI Roadmap
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-4">
                Recommended for you based on current skill gaps:
              </p>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors cursor-pointer group"
                      onClick={() => onPlayCourse(rec.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white ${rec.imageColor}`}
                        >
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {rec.level} • {rec.duration}
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> You've completed all
                    core recommendations!
                  </div>
                )}
              </div>
            </div>

            {/* Discovery Corner */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                  <Book className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Discovery Corner
                </h3>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-4">
                Wildcard topics to broaden your perspective:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wildcardTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 transition-all cursor-pointer group hover:shadow-md"
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-2">
                        {topic.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mb-4 group-hover:text-indigo-600 transition-colors">
                        {topic.title}
                      </h4>
                      <div className="mt-auto flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold">
                          {topic.duration}
                        </span>
                        <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path / Course Steps */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Your Learning Path
              </h3>
              <p className="text-slate-500 font-medium">
                Complete the courses in this order to master the core
                curriculum.
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10 pt-4">
            {courses.slice(0, 5).map((course, idx) => {
              const isCompleted = course.progress === 100;
              // Course is active if it's the first one, or if the previous one is completed
              const isPreviousCompleted =
                idx === 0 || courses[idx - 1].progress === 100;
              const isActive = !isCompleted && isPreviousCompleted;

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (isPreviousCompleted || isCompleted) {
                      onPlayCourse(course.id);
                    }
                  }}
                  className={`relative flex items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                      : isActive
                        ? "border-indigo-500 bg-white shadow-lg shadow-indigo-500/10 cursor-pointer hover:border-indigo-600 translate-y-0 hover:-translate-y-1"
                        : "border-slate-100 bg-slate-50/80 opacity-70 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-6 ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : isActive
                          ? "bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30"
                          : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <span className="text-xl font-black">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4
                      className={`text-xl font-black mb-1 ${
                        isCompleted
                          ? "text-emerald-900"
                          : isActive
                            ? "text-slate-900"
                            : "text-slate-500"
                      }`}
                    >
                      {course.title}
                    </h4>
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {course.level} • {course.duration}
                    </p>
                  </div>

                  <div className="ml-4 shrink-0 flex items-center">
                    {isCompleted ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-emerald-200">
                        Completed
                      </span>
                    ) : isActive ? (
                      <button className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                        <PlayCircle className="w-5 h-5" /> Start Course
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-bold px-6 py-3 bg-slate-100 rounded-xl">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Gallery */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Achievement Gallery
              </h3>
              <p className="text-slate-500 font-medium">
                Badges earned from mastering modules and passing exams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {courses
              .filter((c) => c.examPassed)
              .map((c) => (
                <div
                  key={c.id}
                  className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 hover:bg-amber-50 hover:border-amber-200 transition-colors cursor-default"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-3 shadow-sm border border-amber-200">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 leading-tight">
                    Mastered {c.level}
                  </span>
                </div>
              ))}
            <div className="aspect-square bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-3 shadow-sm shadow-indigo-500/30">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-900 leading-tight">
                Consistent Learner
              </span>
            </div>
          </div>
          {courses.filter((c) => c.examPassed).length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">
              Pass exams to earn achievement badges here.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
