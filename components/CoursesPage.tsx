import React, { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AppView } from "../types";
import {
  User,
  Play,
  Clock,
  Star,
  Award,
  CheckCircle,
  Zap,
  BarChart,
  ArrowLeft,
  Check,
  Medal,
  X,
  Loader2,
  Download,
  Home,
  Brain,
  Target,
  ArrowRight,
} from "lucide-react";
import html2canvas from "html2canvas";
import { ExamPage } from "./ExamPage";
import { StudentPortal } from "./StudentPortal";
import { AcademyTourAndRegistration } from "./AcademyTourAndRegistration";
import { UserProfile } from "./AcademyOnboarding";
import { useProgress } from "../contexts/ProgressContext";
import { useAuth } from "../contexts/AuthContext";

interface CoursesPageProps {
  onNavigate: (view: AppView) => void;
}

type CourseView = "CATALOG" | "LESSON" | "EXAM" | "STUDENT_PORTAL";

export interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  rating: number;
  students: string;
  category: string;
  imageColor: string;
  progress: number;
  level: string;
  videoId: string;
  desc: string;
  examPassed?: boolean;
}

// Placeholder ID - In production, replace these with real Google Drive File IDs

const AcademyIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [cursor, setCursor] = useState({ x: 50, y: 90, duration: 800 });
  const [cursorActive, setCursorActive] = useState(false);
  const [cam, setCam] = useState({
    scale: 0.95,
    oX: 50,
    oY: 50,
    rX: 5,
    rY: -3,
    duration: 1000,
  });
  const [ui, setUi] = useState({
    videoHover: false,
    videoPlaying: false,
    examOpen: false,
    focusAnswer: -1,
    congratsOpen: false,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    const skipTimer = setTimeout(() => {
      if (activeRef.current) {
        setShowSkip(true);
      }
    }, 6000);

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const moveCursor = async (x: number, y: number, duration: number = 800) => {
      if (!activeRef.current) return;
      setCursor({ x, y, duration });
      await wait(duration);
    };
    const zoomCam = async (
      scale: number,
      oX: number,
      oY: number,
      rX: number,
      rY: number,
      duration: number = 800,
    ) => {
      if (!activeRef.current) return;
      setCam({ scale, oX, oY, rX, rY, duration });
      await wait(duration);
    };
    const click = async () => {
      if (!activeRef.current) return;
      setCursorActive(true);
      await wait(150);
      if (!activeRef.current) return;
      setCursorActive(false);
      await wait(150);
    };

    const run = async () => {
      // 1. Initial 3D Tilt adjust
      await zoomCam(0.95, 50, 50, 2, -2, 1000);

      // 2. Fast move to Video
      moveCursor(18, 45, 800);
      await zoomCam(1.6, 20, 40, -1, 3, 1000);
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, videoHover: true }));
      await wait(400);

      // 3. Play Video
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, videoPlaying: true }));
      await zoomCam(1.05, 50, 50, 2, -2, 1500);
      await wait(1500);

      // 4. Move to Take Exam
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, videoPlaying: false, videoHover: false }));
      moveCursor(18, 70, 700);
      await zoomCam(2, 18, 75, 4, 3, 1000);
      await wait(300);

      // 5. Click Take Exam
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, examOpen: true }));
      await zoomCam(1.15, 50, 50, -1, 1, 900);
      await wait(600);

      // 6. Fast answering
      moveCursor(40, 48, 400);
      await wait(400);
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, focusAnswer: 0 }));

      moveCursor(40, 57, 300);
      await wait(300);
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, focusAnswer: 1 }));

      moveCursor(40, 66, 300);
      await wait(300);
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, focusAnswer: 2 }));

      // 7. Click Submit
      moveCursor(50, 75, 500);
      await wait(500);
      await click();
      if (!activeRef.current) return;
      setUi((p) => ({ ...p, examOpen: false, congratsOpen: true }));
      await wait(1000);

      // 8. Download Certificate
      moveCursor(50, 72, 600);
      await zoomCam(1.6, 50, 72, -3, 2, 1200);
      await click();
      await wait(800);

      // 9. Done
      await zoomCam(1, 50, 50, 0, 0, 1000);
      if (!activeRef.current) return;
      setIsComplete(true);
    };

    run();

    return () => {
      activeRef.current = false;
      clearTimeout(skipTimer);
    };
  }, []);

  const handleSkip = () => {
    activeRef.current = false;
    setShowSkip(false);
    setIsComplete(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center font-sans overflow-hidden perspective-[1200px]">
      {/* Background elements to match light UI style */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-100/60 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/60 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
      </div>

      {/* Blurred Edges Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 150px 80px rgba(248, 250, 252, 1)",
        }}
      ></div>

      {/* Skip Button */}
      {!isComplete && (
        <button
          onClick={handleSkip}
          className={`absolute top-8 right-8 z-[110] bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 font-bold text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all duration-500 delay-300 ${showSkip ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          Skip <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Container to maintain aspect ratio and bounds for the animation */}
      <div
        className="relative w-full max-w-[1024px] aspect-video bg-slate-50 overflow-hidden shadow-2xl shadow-indigo-500/10 ring-1 ring-slate-200 mx-4 rounded-3xl group z-10 will-change-transform"
        style={{
          transform: `scale(${cam.scale}) rotateX(${cam.rX}deg) rotateY(${cam.rY}deg)`,
          transformOrigin: `${cam.oX}% ${cam.oY}%`,
          transition: `transform ${cam.duration}ms cubic-bezier(0.25, 1, 0.2, 1), transform-origin ${cam.duration}ms cubic-bezier(0.25, 1, 0.2, 1)`,
        }}
      >
        {/* Inner Wrapper */}
        <div className="absolute inset-0">
          {/* ----- Mock UI Content ----- */}

          {/* Navbar */}
          <div className="h-14 border-b border-slate-200 bg-white flex items-center px-8 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">
                SalesForce.ai
              </span>
            </div>
            <div className="ml-auto flex gap-6 text-sm font-bold text-slate-400">
              <div className="text-indigo-600">Academy</div>
              <div>Dashboard</div>
              <div>Simulations</div>
            </div>
          </div>

          {/* Hero */}
          <div className="h-40 bg-indigo-900 text-white flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
            <h1 className="text-4xl font-black mb-2 tracking-tight relative z-10">
              Sales Mastery Academy
            </h1>
            <p className="text-indigo-200 font-medium relative z-10">
              Master the art of closing with AI roleplay.
            </p>
          </div>

          {/* Course Grid */}
          <div className="absolute top-[216px] bottom-0 left-0 right-0 p-8 grid grid-cols-3 gap-6 bg-slate-50">
            {/* Course 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[280px]">
              <div className="h-32 bg-slate-900 relative">
                {/* Video Preview effect */}
                {ui.videoPlaying ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800&h=400"
                      className="w-full h-full object-cover opacity-60 animate-fade-in"
                      alt="video"
                    />
                    <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-1/3 animate-[progress_3s_linear_infinite]"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${ui.videoHover ? "bg-indigo-600 scale-110 shadow-lg shadow-indigo-500/50" : "bg-white/20 backdrop-blur-sm"}`}
                    >
                      <Play
                        className={`w-5 h-5 fill-current ${ui.videoHover ? "text-white" : "text-slate-200"}`}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-base mb-1.5">
                  Psychology of Winning
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  Learn to read your prospects and overcome any objection with
                  psychological frameworks.
                </p>
                <div className="mt-auto relative">
                  <div
                    className={`h-10 text-white text-sm font-bold rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 ${ui.videoHover ? "bg-indigo-100 text-indigo-400 cursor-not-allowed" : "bg-indigo-600 shadow-indigo-200"}`}
                  >
                    Take Exam
                  </div>
                </div>
              </div>
            </div>

            {/* Course 2 Mock */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[280px] opacity-60">
              <div className="h-32 bg-slate-200"></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-100 rounded mb-1"></div>
                <div className="h-3 w-4/5 bg-slate-100 rounded mb-4"></div>
                <div className="mt-auto h-10 bg-slate-100 rounded-xl"></div>
              </div>
            </div>

            {/* Course 3 Mock */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[280px] opacity-60">
              <div className="h-32 bg-slate-200"></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-100 rounded mb-1"></div>
                <div className="h-3 w-4/5 bg-slate-100 rounded mb-4"></div>
                <div className="mt-auto h-10 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Exam Modal */}
          <div
            className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-30 flex items-center justify-center transition-opacity duration-300 ${ui.examOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div
              className={`bg-white w-[480px] rounded-3xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-500 ${ui.examOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"} ring-1 ring-slate-100`}
            >
              <div className="bg-indigo-600 text-white px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 -mr-10 -mt-10"></div>
                <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1 relative z-10">
                  Final Assessment
                </div>
                <div className="font-black text-xl tracking-tight relative z-10">
                  Psychology of Winning
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="font-bold text-slate-800 mb-6">
                  Select the best approach to handle a hard price objection:
                </div>

                {[0, 1, 2].map((ans) => (
                  <div
                    key={ans}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${ui.focusAnswer === ans ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-slate-50"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${ui.focusAnswer === ans ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"}`}
                    >
                      {ui.focusAnswer === ans && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div
                      className={`text-sm font-medium ${ui.focusAnswer === ans ? "text-indigo-900" : "text-slate-600"}`}
                    >
                      {ans === 0 && "Highlight the core value and ROI first."}
                      {ans === 1 && "Offer an immediate 10% discount to close."}
                      {ans === 2 && "Walk away to show product confidence."}
                    </div>
                  </div>
                ))}

                <div className="h-12 mt-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-200">
                  Submit Assessment
                </div>
              </div>
            </div>
          </div>

          {/* Congrats Modal */}
          <div
            className={`absolute inset-0 bg-slate-900/20 backdrop-blur-md z-40 flex items-center justify-center transition-opacity duration-300 ${ui.congratsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div
              className={`bg-white w-[480px] rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center transform transition-all duration-700 ${ui.congratsOpen ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"} ring-1 ring-slate-100`}
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <Medal className="w-12 h-12 text-emerald-500 relative z-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                Assessment Passed!
              </h2>
              <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed max-w-sm">
                Incredible work. You've mastered this module and proven your
                readiness.
              </p>

              <div className="w-full flex gap-4">
                <div className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-200/50">
                  <Download className="w-5 h-5" /> Download Certificate
                </div>
              </div>
            </div>
          </div>

          {/* ----- End Mock UI Content ----- */}
        </div>

        {/* Global CTA Overlay (appears after sequence) */}
        <div
          className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${isComplete ? "bg-slate-50 opacity-100 pointer-events-auto" : "bg-slate-50/0 opacity-0 pointer-events-none"}`}
        >
          <div
            className={`max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transform transition-all duration-1000 delay-300 ${isComplete ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"}`}
          >
            <div className="text-left relative flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] pointer-events-none"></div>
              <h2 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tight relative z-10 leading-[1.05] drop-shadow-sm">
                Your Journey <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-[gradient_3s_ease_infinite] drop-shadow-sm">
                  Awaits.
                </span>
              </h2>
              <p className="text-slate-600 text-lg lg:text-xl font-medium mb-12 max-w-lg relative z-10 leading-relaxed">
                The academy is ready. Start learning, taking exams, and
                unlocking achievements to elevate your skills.
              </p>
              <button
                onClick={onComplete}
                className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 z-10 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:opacity-90 hover:shadow-indigo-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 animate-[pulse_3s_ease-in-out_infinite] hover:animate-none hover:-translate-y-1 duration-300"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Enter Academy{" "}
                  <ArrowRight
                    className="w-5 h-5 animate-bounce-x"
                    style={{ animationDuration: "2s" }}
                  />
                </span>
              </button>
            </div>

            {/* Visuals on the right */}
            <div className="relative h-[600px] w-full hidden lg:flex items-center justify-center perspective-1000">
              <div className="w-[80%] h-[80%] rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/30 border-8 border-white transform rotate-3 hover:rotate-6 transition-all duration-500 z-20 hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                  alt="Sales Teaching Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* The Animated Cursor */}
        {!isComplete && (
          <div
            className="absolute z-[100] will-change-[left,top,transform] pointer-events-none drop-shadow-2xl"
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
              transform: `translate(0%, 0%) scale(${cursorActive ? 0.8 : 1})`,
              transition: `left ${cursor.duration}ms cubic-bezier(0.25, 1, 0.5, 1), top ${cursor.duration}ms cubic-bezier(0.25, 1, 0.5, 1), transform 150ms ease-out`,
            }}
          >
            <svg
              width="32"
              height="48"
              viewBox="0 0 24 36"
              fill="none"
              className="text-slate-900"
            >
              <path
                d="M2.5 2.5L16.5 19L11 19.5L15.5 29.5L11.5 31L7 21.5L2.5 25.5V2.5Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export const INITIAL_COURSES: Course[] = [
  // The Psychology of Winning
  {
    id: 1,
    title: "Limiting Beliefs",
    instructor: "TR",
    duration: "08m 30s",
    lessons: 1,
    rating: 4.9,
    students: "15.2k",
    category: "The Psychology of Winning",
    imageColor: "bg-indigo-600",
    progress: 100,
    level: "Mindset",
    videoId: "1UkaGj4cU72TBPRbLxjI45smY1yh7T3Mu",
    desc: "Identify & eliminate mind viruses.",
  },
  {
    id: 2,
    title: "The Power of Focus",
    instructor: "TR",
    duration: "07m 01s",
    lessons: 1,
    rating: 4.8,
    students: "14.1k",
    category: "The Psychology of Winning",
    imageColor: "bg-indigo-700",
    progress: 100,
    level: "Mindset",
    videoId: "14ACPK6clE6y7Jq0XMcWPFuTqvGcyni6g",
    desc: "Directed energy generates revenue.",
  },
  {
    id: 3,
    title: "Decision Making",
    instructor: "TR",
    duration: "06m 28s",
    lessons: 1,
    rating: 4.9,
    students: "13.8k",
    category: "The Psychology of Winning",
    imageColor: "bg-violet-600",
    progress: 60,
    level: "Mindset",
    videoId: "1lsN5qrWooqEMvL0fRtNrVQXPxcNXFZN_",
    desc: "Thinking fast & accurately under pressure.",
  },
  {
    id: 4,
    title: "Wealth & Mindset",
    instructor: "TR",
    duration: "07m 27s",
    lessons: 1,
    rating: 5.0,
    students: "16.5k",
    category: "The Psychology of Winning",
    imageColor: "bg-purple-700",
    progress: 0,
    level: "Mindset",
    videoId: "1gpfYutGEyNfbbZMDy7oOqEC_Y9WSG8sn",
    desc: "The money psychology of top performers.",
  },

  // The Architecture of Persuasion
  {
    id: 5,
    title: "Introduction to Sales",
    instructor: "TR",
    duration: "05m 03s",
    lessons: 1,
    rating: 4.7,
    students: "18k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-800",
    progress: 0,
    level: "Fundamental",
    videoId: "1UCNAM5YtUvWTjcUqrOYSbfp-FiXpQee4",
    desc: "The roadmap of modern selling.",
  },
  {
    id: 6,
    title: "The Psychology of Selling",
    instructor: "TR",
    duration: "07m 58s",
    lessons: 1,
    rating: 4.9,
    students: "17.2k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-700",
    progress: 0,
    level: "Advanced",
    videoId: "1pNzQZMLHC4XCHgc3nJnHRFnlpiLlnWmZ",
    desc: "Why people buy (Emotion vs. Logic).",
  },
  {
    id: 7,
    title: "Building Rapport",
    instructor: "TR",
    duration: "15m 15s",
    lessons: 1,
    rating: 4.8,
    students: "14.9k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-gray-800",
    progress: 0,
    level: "Technique",
    videoId: "1XNpGDIGoZqlpOILmCbY0dnd2-4y9qJcp",
    desc: "The art of frequency alignment.",
  },
  {
    id: 8,
    title: "How to Become a Top Salesperson",
    instructor: "TR",
    duration: "07m 56s",
    lessons: 1,
    rating: 4.9,
    students: "15.5k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-zinc-700",
    progress: 0,
    level: "Strategy",
    videoId: "1T4RR-Dwibc5Rbn9VovWTNn_ryyUtXFNo",
    desc: "Elite competency standards.",
  },
  {
    id: 9,
    title: "Sales Mentality",
    instructor: "TR",
    duration: "07m 28s",
    lessons: 1,
    rating: 4.8,
    students: "13.9k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-800",
    progress: 0,
    level: "Mindset",
    videoId: "15VuIkRZcI8S0KmMXdVzEubSeSSVD7IUU",
    desc: "Resilience in the field.",
  },
  {
    id: 10,
    title: "Sales Types Breakdown",
    instructor: "TR",
    duration: "15m 29s",
    lessons: 1,
    rating: 4.7,
    students: "12.8k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-gray-700",
    progress: 0,
    level: "Knowledge",
    videoId: "1OfgKd54XeodSl9VFnZaShm3S4dZsIAei",
    desc: "Knowing your battlefield.",
  },
  {
    id: 11,
    title: "Objection Handling Matrix",
    instructor: "TR",
    duration: "12m 45s",
    lessons: 1,
    rating: 4.9,
    students: "11.1k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-800",
    progress: 0,
    level: "Advanced",
    videoId: "1pNzQZMLHC4XCHgc3nJnHRFnlpiLlnWmZ",
    desc: "Transforming 'No' into 'Yes'.",
  },
  {
    id: 12,
    title: "The Closing Framework",
    instructor: "TR",
    duration: "18m 10s",
    lessons: 1,
    rating: 5.0,
    students: "10.5k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-700",
    progress: 0,
    level: "Advanced",
    videoId: "1T4RR-Dwibc5Rbn9VovWTNn_ryyUtXFNo",
    desc: "Sealing the deal with confidence.",
  },
  {
    id: 13,
    title: "Follow-up Strategies",
    instructor: "TR",
    duration: "09m 20s",
    lessons: 1,
    rating: 4.8,
    students: "9.8k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-gray-800",
    progress: 0,
    level: "Strategy",
    videoId: "1XNpGDIGoZqlpOILmCbY0dnd2-4y9qJcp",
    desc: "Persistent without being annoying.",
  },
  {
    id: 14,
    title: "High-Ticket Sales",
    instructor: "TR",
    duration: "21m 30s",
    lessons: 1,
    rating: 4.9,
    students: "14.2k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-zinc-700",
    progress: 0,
    level: "Mastery",
    videoId: "15VuIkRZcI8S0KmMXdVzEubSeSSVD7IUU",
    desc: "Selling premium products & services.",
  },
  {
    id: 15,
    title: "Negotiation Tactics",
    instructor: "TR",
    duration: "14m 50s",
    lessons: 1,
    rating: 4.7,
    students: "12.0k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-slate-800",
    progress: 0,
    level: "Technique",
    videoId: "1UCNAM5YtUvWTjcUqrOYSbfp-FiXpQee4",
    desc: "Creating win-win scenarios.",
  },
  {
    id: 16,
    title: "The Ultimate Pitch",
    instructor: "TR",
    duration: "16m 05s",
    lessons: 1,
    rating: 4.9,
    students: "19.5k",
    category: "The Architecture of Persuasion",
    imageColor: "bg-gray-700",
    progress: 0,
    level: "Mastery",
    videoId: "1OfgKd54XeodSl9VFnZaShm3S4dZsIAei",
    desc: "Crafting an irresistible offer.",
  },
];

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [studentName, setStudentName] = useState("John Doe");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentView, setCurrentView] = useState<CourseView>("CATALOG");
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Certificate State
  const [viewingCertificate, setViewingCertificate] = useState<Course | null>(
    null,
  );
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const { progress, updateProgress } = useProgress();
  const { user, profile } = useAuth();

  useEffect(() => {
    // Check if the user has already visited the academy
    if (
      progress?.hasVisitedAcademy ||
      (user && localStorage.getItem("academy_visited_by_" + user.uid))
    ) {
      setShowIntro(false);
      setShowOnboarding(false);
      // Wait for page loading animation
    } else {
      // If it's a new user flow but page is done loading
      if (!pageLoading && user) {
        updateProgress({ hasVisitedAcademy: true });
        localStorage.setItem("academy_visited_by_" + user.uid, "true");
      }
    }
  }, [progress, user, pageLoading]);

  // Stats Calculation
  const stats = useMemo(() => {
    const getSeconds = (str: string) => {
      if (!str) return 0;
      const parts = str.split(" ");
      let m = 0,
        s = 0;
      parts.forEach((p) => {
        if (p.includes("m")) m = parseInt(p) || 0;
        if (p.includes("s")) s = parseInt(p) || 0;
      });
      return m * 60 + s;
    };

    const totalTime = courses.reduce(
      (acc, c) => acc + getSeconds(c.duration),
      0,
    );
    const learnedTime = courses.reduce(
      (acc, c) => acc + getSeconds(c.duration) * (c.progress / 100),
      0,
    );
    const completed = courses.filter((c) => c.progress === 100).length;

    return {
      hoursLearned: (learnedTime / 3600).toFixed(1),
      completedCount: completed,
      totalCount: courses.length,
      progress: Math.round((learnedTime / totalTime) * 100) || 0,
    };
  }, [courses]);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === activeCourseId),
    [activeCourseId, courses],
  );
  const relatedCourses = activeCourse
    ? courses.filter((c) => c.category === activeCourse.category)
    : [];

  const handlePlayCourse = (courseId: number) => {
    setActiveCourseId(courseId);
    setCurrentView("LESSON");
    window.scrollTo(0, 0);
  };

  const handleMarkComplete = (courseId: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, progress: 100 } : c)),
    );
  };

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current || !viewingCertificate) return;
    setIsDownloadingCert(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Ensure render

      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: "#ffffff",
        scale: 4, // High Resolution Scale
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `SalesForceAI_Certificate_${viewingCertificate.title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Certificate error:", err);
      toast.error("Failed to generate certificate.");
    } finally {
      setIsDownloadingCert(false);
    }
  };

  if (showIntro) {
    return <AcademyIntro onComplete={() => setShowIntro(false)} />;
  }

  // --- RENDER: LESSON VIEW ---
  if (currentView === "LESSON" && activeCourse) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in pb-20">
        <nav className="sticky top-0 w-full z-50 transition-all duration-500 border-b bg-white/90 backdrop-blur-md backdrop-saturate-150 border-slate-200/60 py-4 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView("CATALOG")}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              {/* RESTORED BRANDING */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onNavigate(AppView.LANDING)}
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-bold text-slate-900 hidden sm:inline-block">
                  SalesForce
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">
                    .ai
                  </span>{" "}
                  Academy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {activeCourse.progress === 100 ? (
                activeCourse.examPassed ? (
                  <button
                    onClick={() => setViewingCertificate(activeCourse)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Medal className="w-4 h-4" /> Claim Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentView("EXAM")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" /> Take Exam
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleMarkComplete(activeCourse.id)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-[1600px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200">
              {videoLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                </div>
              )}
              <iframe
                className="w-full h-full relative z-10"
                src={`https://drive.google.com/file/d/${activeCourse.videoId}/preview`}
                allow="autoplay; fullscreen"
                onLoad={() => setVideoLoading(false)}
              />
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
                  {activeCourse.category}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold uppercase tracking-wider">
                  {activeCourse.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {activeCourse.title}
              </h1>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {activeCourse.desc}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Instructor
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {activeCourse.instructor}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Duration
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {activeCourse.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Menu - RESTORED & VISIBLE */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] sticky top-28">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">Curriculum</h3>
                <span className="text-xs font-bold text-slate-600 bg-slate-200/50 border border-slate-200 px-2.5 py-1 rounded-full">
                  {relatedCourses.length} Lessons
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                {relatedCourses.map((c, i) => (
                  <div
                    key={c.id}
                    onClick={() => handlePlayCourse(c.id)}
                    className={`p-4 mb-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${c.id === activeCourse.id ? "bg-indigo-50 border-indigo-200 shadow-sm" : "hover:bg-slate-50 border-transparent hover:border-slate-200"}`}
                  >
                    <div className="shrink-0">
                      {c.id === activeCourse.id ? (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <Play className="w-3 h-3 ml-0.5 fill-current" />
                        </div>
                      ) : c.progress === 100 ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold truncate ${c.id === activeCourse.id ? "text-indigo-700" : "text-slate-700"}`}
                      >
                        {c.title}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {c.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* CERTIFICATE MODAL - UPGRADED */}
        {viewingCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col overflow-hidden relative animate-scale-up max-h-[95vh]">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Award className="w-5 h-5 text-amber-500" /> Certificate
                  Preview
                </div>
                <button
                  onClick={() => setViewingCertificate(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 hover:text-slate-900" />
                </button>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto bg-slate-100 flex justify-center">
                {/* THE CERTIFICATE DOM */}
                <div
                  ref={certificateRef}
                  className="bg-slate-900 text-center relative shadow-2xl flex flex-col overflow-hidden"
                  style={{
                    width: "1100px",
                    minWidth: "1100px",
                    height: "770px",
                    minHeight: "770px",
                  }}
                >
                  {/* Premium Backgrounds */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black pointer-events-none"></div>
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                  {/* Opulent Gold Border Framework */}
                  <div className="absolute inset-8 border-[2px] border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute inset-10 border border-amber-500/20 pointer-events-none"></div>
                  <div className="absolute inset-[44px] border-[6px] border-amber-500/10 pointer-events-none"></div>

                  {/* Corner Accents (Gold) */}
                  <div className="absolute top-6 left-6 w-16 h-16 border-t-[2px] border-l-[2px] border-amber-400"></div>
                  <div className="absolute top-6 right-6 w-16 h-16 border-t-[2px] border-r-[2px] border-amber-400"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 border-b-[2px] border-l-[2px] border-amber-400"></div>
                  <div className="absolute bottom-6 right-6 w-16 h-16 border-b-[2px] border-r-[2px] border-amber-400"></div>

                  {/* Decorative Corner SVG Elements */}
                  <svg
                    className="absolute top-8 left-8 w-12 h-12 text-amber-500/30"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M0,0 L100,0 C50,0 0,50 0,100 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="absolute top-8 right-8 w-12 h-12 text-amber-500/30"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M100,0 L0,0 C50,0 100,50 100,100 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="absolute bottom-8 left-8 w-12 h-12 text-amber-500/30"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M0,100 L100,100 C50,100 0,50 0,0 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="absolute bottom-8 right-8 w-12 h-12 text-amber-500/30"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M100,100 L0,100 C50,100 100,50 100,0 Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-12 px-20 relative z-10 h-full">
                    <div className="space-y-4 text-center mt-4">
                      <div className="inline-flex items-center justify-center gap-3 text-amber-400 opacity-90 mb-4 border border-amber-500/30 px-6 py-2 rounded-full bg-amber-500/5">
                        <Zap className="w-5 h-5 fill-amber-400/50" />
                        <span className="text-xl font-bold tracking-widest uppercase">
                          SalesForce.ai Academy
                        </span>
                      </div>
                      <h1 className="text-[64px] leading-[1] font-black text-white uppercase tracking-[0.2em] font-serif drop-shadow-lg">
                        Certificate
                      </h1>
                      <p className="text-xl text-amber-400/80 uppercase tracking-[0.4em] font-semibold">
                        Of Outstanding Achievement
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full text-center flex-1 my-4">
                      <p className="text-base text-slate-400 uppercase tracking-widest mb-4">
                        This certifies that
                      </p>
                      <div className="w-full max-w-2xl px-12 mb-6">
                        <h2 className="text-[56px] font-serif italic text-white drop-shadow-md leading-tight">
                          {studentName}
                        </h2>
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-2 w-full"></div>
                      </div>
                      <p className="text-lg text-slate-400 mb-4">
                        Has successfully completed the masterclass program
                      </p>
                      <div className="w-full max-w-4xl px-8 mx-auto mb-4">
                        <h3 className="text-4xl font-black text-amber-400 drop-shadow-md break-words leading-tight">
                          {viewingCertificate.title}
                        </h3>
                      </div>
                      <div className="w-full max-w-3xl px-8 mx-auto">
                        <p className="text-base text-slate-400 leading-relaxed">
                          Demonstrating exceptional mastery in advanced sales
                          methodologies, strategic negotiation, and the
                          application of AI-driven persuasion tactics.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center items-end mt-8 mb-4 px-12">
                      <div className="text-center flex flex-col items-center opacity-80">
                        <div className="text-lg font-serif text-white/90 border-b border-amber-500/30 pb-2 mb-2 px-8">
                          {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                          Date Issued
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 z-20">
                <button
                  onClick={() => setViewingCertificate(null)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloadingCert}
                  className="px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  {isDownloadingCert ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}{" "}
                  Download High-Res PNG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER: EXAM VIEW ---
  if (currentView === "EXAM" && activeCourse) {
    return (
      <ExamPage
        onBack={() => setCurrentView("LESSON")}
        onComplete={(score) => {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === activeCourse.id ? { ...c, examPassed: true } : c,
            ),
          );
          setCurrentView("LESSON");
          setViewingCertificate(activeCourse);
        }}
      />
    );
  }

  // --- RENDER: STUDENT PORTAL ---
  if (currentView === "STUDENT_PORTAL") {
    return (
      <StudentPortal
        courses={courses}
        studentName={studentName}
        userProfile={userProfile}
        onUpdateName={setStudentName}
        onBack={() => setCurrentView("CATALOG")}
        onPlayCourse={(id) => {
          setActiveCourseId(id);
          setCurrentView("LESSON");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // --- RENDER: CATALOG VIEW (Default) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in pb-20 relative">
      {showOnboarding && (
        <AcademyTourAndRegistration
          onComplete={(profile) => {
            setUserProfile(profile);
            setStudentName(profile.name);
            setShowOnboarding(false);
            setCurrentView("STUDENT_PORTAL");
          }}
        />
      )}
      <nav className="sticky top-0 w-full z-50 transition-all duration-500 border-b bg-white/90 backdrop-blur-md backdrop-saturate-150 border-slate-200/60 py-4 shadow-sm relative">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate(AppView.LANDING)}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              SalesForce
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">
                .ai
              </span>{" "}
              Academy
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate(AppView.LANDING)}
              className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors"
              title="Go to Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              id="tour-step-5"
              onClick={() => setCurrentView("STUDENT_PORTAL")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-full text-sm font-bold text-slate-600"
            >
              <User className="w-4 h-4" /> <span>Student Center</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-20 flex flex-col lg:flex-row items-center gap-12 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 animate-scale-up delay-100"
              style={{ animationFillMode: "both" }}
            >
              <Star className="w-4 h-4 fill-current" />
              Premium Training
            </div>
            <h1
              className="text-5xl lg:text-7xl xl:text-[5.5rem] font-black text-slate-900 mb-6 tracking-tight leading-[1.05] animate-slide-up"
              style={{ animationFillMode: "both" }}
            >
              Sales Mastery <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">
                Academy.
              </span>
            </h1>
            <p
              className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 mb-6 tracking-tight animate-slide-up delay-200"
              style={{ animationFillMode: "both" }}
            >
              Win the Mind, Secure the Deal.
            </p>
            <p
              className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-slide-up delay-300"
              style={{ animationFillMode: "both" }}
            >
              Elevate your sales game with our premium training modules. Master
              the psychology of winning and the architecture of persuasion.
            </p>
          </div>

          <div
            className="flex-1 relative w-full max-w-lg lg:max-w-none animate-slide-up delay-400"
            style={{ animationFillMode: "both" }}
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-white aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
                alt="Sales Training Group"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-20">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <BarChart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-500">Win Rate</div>
                <div className="text-xl font-black text-slate-900">+48%</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 lg:-right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-2 z-20">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden`}
                  >
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm">
                  +2k
                </div>
              </div>
              <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
                Active Students
              </div>
            </div>
          </div>
        </div>

        {pageLoading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="h-[140px] bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
                <div className="w-3/4 h-6 bg-slate-200/50 rounded-md" />
                <div className="w-1/2 h-10 bg-slate-200/50 rounded-md" />
              </div>
              <div className="h-[140px] bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
                <div className="w-3/4 h-6 bg-slate-200/50 rounded-md" />
                <div className="w-1/2 h-10 bg-slate-200/50 rounded-md" />
              </div>
              <div className="h-[140px] bg-slate-200/20 border border-slate-200/50 rounded-2xl md:col-span-2 p-6 flex flex-col justify-between">
                <div className="w-1/2 h-6 bg-slate-200/50 rounded-md" />
                <div className="w-full h-8 bg-slate-200/50 rounded-full" />
              </div>
            </div>
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
              <div className="h-10 w-24 bg-slate-200/50 rounded-full"></div>
              <div className="h-10 w-32 bg-slate-200/50 rounded-full"></div>
              <div className="h-10 w-28 bg-slate-200/50 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col"
                >
                  <div className="h-32 bg-slate-200/50 rounded-xl mb-4"></div>
                  <div className="h-6 w-3/4 bg-slate-200/50 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-slate-200/50 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div
              id="tour-step-2"
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Hours Learned
                  </span>
                </div>
                <span className="text-4xl font-black text-slate-900">
                  {stats.hoursLearned}
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Completed
                  </span>
                </div>
                <span className="text-4xl font-black text-slate-900">
                  {stats.completedCount}
                  <span className="text-slate-400 text-2xl">
                    /{stats.totalCount}
                  </span>
                </span>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 rounded-2xl shadow-xl flex flex-col justify-between text-white col-span-1 md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-indigo-100" />
                  </div>
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">
                    Total Progress
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-4xl font-black">
                      {stats.progress}%
                    </span>
                    <span className="text-indigo-200 font-bold text-sm uppercase tracking-wider">
                      Keep going
                    </span>
                  </div>
                  <div className="w-full h-2 bg-indigo-950/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog */}
            <div
              id="tour-step-3"
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900">
                Course Catalog
              </h2>
              <div className="flex flex-wrap gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
                {[
                  "All",
                  "The Psychology of Winning",
                  "The Architecture of Persuasion",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? "bg-white text-indigo-600 border border-slate-200 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter 1 */}
            {(activeCategory === "All" ||
              activeCategory === "The Psychology of Winning") && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-8 rounded-full bg-indigo-600"></span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    The Psychology of Winning
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {courses
                    .filter((c) => c.category === "The Psychology of Winning")
                    .map((course, index) => (
                      <div
                        id={index === 0 ? "tour-step-4" : undefined}
                        key={course.id}
                        onClick={() => handlePlayCourse(course.id)}
                        className="group bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative z-10"
                      >
                        <div
                          className={`h-48 ${course.imageColor} relative p-6 flex flex-col justify-between overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-0"></div>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0"></div>

                          <div className="relative z-10 flex justify-between items-start">
                            <span className="inline-flex px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                              {course.level}
                            </span>
                            {course.progress === 100 && (
                              <span className="inline-flex px-2 py-1 bg-emerald-500/90 backdrop-blur-md border border-emerald-400 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>

                          <div className="relative z-10 flex justify-between items-end">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                              <Play className="w-5 h-5 fill-current ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-white">
                          <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                            {course.desc}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />{" "}
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{" "}
                              {course.rating}
                            </span>
                          </div>
                        </div>
                        {course.progress > 0 && course.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Chapter 2 */}
            {(activeCategory === "All" ||
              activeCategory === "The Architecture of Persuasion") && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-8 rounded-full bg-cyan-500"></span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    The Architecture of Persuasion
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {courses
                    .filter(
                      (c) => c.category === "The Architecture of Persuasion",
                    )
                    .map((course) => (
                      <div
                        key={course.id}
                        onClick={() => handlePlayCourse(course.id)}
                        className="group bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative z-10"
                      >
                        <div
                          className={`h-48 ${course.imageColor} relative p-6 flex flex-col justify-between overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-0"></div>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0"></div>

                          <div className="relative z-10 flex justify-between items-start">
                            <span className="inline-flex px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                              {course.level}
                            </span>
                            {course.progress === 100 && (
                              <span className="inline-flex px-2 py-1 bg-emerald-500/90 backdrop-blur-md border border-emerald-400 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>

                          <div className="relative z-10 flex justify-between items-end">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                              <Play className="w-5 h-5 fill-current ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-white">
                          <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                            {course.desc}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />{" "}
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{" "}
                              {course.rating}
                            </span>
                          </div>
                        </div>
                        {course.progress > 0 && course.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 font-bold text-slate-900">
            <Zap className="w-5 h-5 text-indigo-600 fill-current" />{" "}
            SalesForce.ai Academy
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 SalesForce AI Trainer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
