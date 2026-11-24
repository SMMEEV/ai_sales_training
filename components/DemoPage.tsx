import React, { useState, useEffect, useRef } from "react";
import { AppView } from "../types";
import {
  Bot,
  User,
  Shield,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  X,
  Brain,
  BarChart3,
  Lock,
  Sparkles,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";

interface DemoPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

interface ScriptStep {
  role: "user" | "ai";
  text: string;
  feature?: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    color: string;
    textColor: string;
    bgColor: string;
  };
  delayBefore: number;
  typingDuration: number;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate, onStart }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingRole, setTypingRole] = useState<"user" | "ai">("user");
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const script: ScriptStep[] = [
    {
      role: "ai",
      text: "Hello? This is Sarah from Acme Corp. Who is this?",
      delayBefore: 800,
      typingDuration: 1000,
      feature: {
        icon: <Bot className="w-5 h-5" />,
        title: "AI Persona: The Skeptic",
        desc: "Simulating a busy executive with low patience.",
        color: "text-slate-600",
        textColor: "text-slate-800",
        bgColor: "bg-slate-100",
      },
    },
    {
      role: "user",
      text: "Hi Sarah, this is Alex calling from SalesForce.ai. I noticed you downloaded our whitepaper on AI training.",
      delayBefore: 500,
      typingDuration: 1200,
    },
    {
      role: "ai",
      text: "Look, we're not buying anything right now. Our budget is frozen until Q4.",
      delayBefore: 600,
      typingDuration: 1000,
      feature: {
        icon: <Shield className="w-5 h-5" />,
        title: "Objection Detected",
        desc: "Category: Budget / Timing Constraint",
        color: "text-amber-600",
        textColor: "text-amber-900",
        bgColor: "bg-amber-100",
      },
    },
    {
      role: "user",
      text: "I completely understand. Most of our partners start with a pilot to prove ROI before committing capital. Is efficiency a priority for you right now?",
      delayBefore: 800,
      typingDuration: 1800,
      feature: {
        icon: <Zap className="w-5 h-5" />,
        title: "Skill Analysis",
        desc: "Technique: Empathy + Value Pivot (+15 XP)",
        color: "text-indigo-600",
        textColor: "text-indigo-900",
        bgColor: "bg-indigo-100",
      },
    },
    {
      role: "ai",
      text: "Well... efficiency is always a priority. If we could reduce ramp time, I might be able to find some budget.",
      delayBefore: 1000,
      typingDuration: 1200,
      feature: {
        icon: <Brain className="w-5 h-5" />,
        title: "Sentiment Shift",
        desc: "Moved from 'Hostile' to 'Curious'",
        color: "text-emerald-600",
        textColor: "text-emerald-900",
        bgColor: "bg-emerald-100",
      },
    },
    {
      role: "user",
      text: "That's exactly what we do. We cut ramp time by 40%. I can show you a 5-minute demo tomorrow?",
      delayBefore: 600,
      typingDuration: 1500,
      feature: {
        icon: <Target className="w-5 h-5" />,
        title: "Closing Signal",
        desc: "Attempting trial close on interest signal.",
        color: "text-blue-600",
        textColor: "text-blue-900",
        bgColor: "bg-blue-100",
      },
    },
    {
      role: "ai",
      text: "Okay, send the invite for 2 PM.",
      delayBefore: 800,
      typingDuration: 1000,
    },
  ];

  useEffect(() => {
    let isActive = true;
    let currentStepIndex = 0;

    // Reset state for strict mode double-mount
    setMessages([]);
    setProgress(0);
    setIsComplete(false);
    setActiveFeature(null);
    setIsTyping(false);

    const runScript = async () => {
      if (!isActive) return;

      if (currentStepIndex >= script.length) {
        setIsComplete(true);
        setActiveFeature(null);
        return;
      }

      const step = script[currentStepIndex];

      // Update progress bar
      if (isActive) {
        setProgress(((currentStepIndex + 1) / script.length) * 100);
      }

      // 1. Wait delay before starting
      await new Promise((r) => setTimeout(r, step.delayBefore));
      if (!isActive) return;

      // 2. Show typing indicator
      setIsTyping(true);
      setTypingRole(step.role);

      // 3. Wait for typing duration
      await new Promise((r) => setTimeout(r, step.typingDuration));
      if (!isActive) return;

      // 4. Show message and feature
      setIsTyping(false);
      setMessages((prev) => [...prev, step]);

      if (step.feature) {
        setActiveFeature(step.feature);
      }

      currentStepIndex++;
      runScript();
    };

    runScript();

    return () => {
      isActive = false;
    };
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center font-sans animate-fade-in overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Light Mode Background */}
      <div className="absolute inset-0 bg-slate-50">
        <div
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-100/60 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/60 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => onNavigate(AppView.LANDING)}
        className="absolute top-8 left-8 z-50 p-3 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all hover:scale-105 shadow-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-7xl p-6 h-full max-h-[900px] flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center">
        {/* LEFT: Phone/Chat Interface - Clean White */}
        <div className="w-full lg:w-[460px] h-[720px] bg-white rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden ring-4 ring-slate-50">
          {/* Status Bar / Notch Area */}
          <div className="h-8 w-full flex justify-center items-center mt-3 mb-1">
            <div className="w-24 h-6 bg-slate-100 rounded-full"></div>
          </div>

          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-20 sticky top-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-slate-200 to-slate-300">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="Sarah"
                    className="w-full h-full object-cover rounded-full border-2 border-white"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Sarah Jenkins
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">
                    VP of Operations
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Acme Corp
                  </span>
                </div>
              </div>
            </div>
            {/* Call controls simplified */}
            <div className="flex gap-2">
              <div className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide relative bg-white"
          >
            {/* Date separator */}
            <div className="flex justify-center mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Today
              </span>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                style={{ animationFillMode: "forwards" }}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-1 shrink-0 border border-slate-200 text-slate-500">
                    <span className="text-[10px] font-bold">SJ</span>
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm transition-all duration-300 hover:shadow-md ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-100"
                      : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                className={`flex ${typingRole === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {typingRole === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-1 shrink-0 border border-slate-200 text-slate-500">
                    <span className="text-[10px] font-bold">SJ</span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl flex gap-1.5 items-center ${
                    typingRole === "user"
                      ? "bg-indigo-50 border border-indigo-100 rounded-tr-sm"
                      : "bg-slate-50 border border-slate-200 rounded-tl-sm"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-bounce ${typingRole === "user" ? "bg-indigo-400" : "bg-slate-400"}`}
                  ></div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-bounce delay-75 ${typingRole === "user" ? "bg-indigo-400" : "bg-slate-400"}`}
                  ></div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-bounce delay-150 ${typingRole === "user" ? "bg-indigo-400" : "bg-slate-400"}`}
                  ></div>
                </div>
              </div>
            )}

            {/* Bottom spacer */}
            <div className="h-4"></div>
          </div>

          {/* Input Area (Mock) */}
          <div className="p-4 bg-white/90 border-t border-slate-100 backdrop-blur-md z-20">
            <div className="flex gap-3 items-center bg-slate-50 p-1.5 rounded-full border border-slate-200 pl-5">
              <span className="text-slate-400 text-sm flex-1 truncate font-medium">
                {isComplete
                  ? "Simulation finished."
                  : "AI analyzing conversation..."}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isTyping && typingRole === "user" ? "bg-indigo-600 shadow-md shadow-indigo-200 scale-105" : "bg-slate-200 text-slate-400"}`}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Bar embedded at bottom */}
          <div className="h-1.5 bg-slate-100 w-full absolute bottom-0 left-0">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* RIGHT: Live Analysis HUD - Professional Dark/Light Text */}
        <div className="w-full lg:w-[500px] flex flex-col justify-center h-[600px] relative">
          {/* Decorative lines connecting chat to HUD */}
          <div className="absolute left-[-48px] top-1/2 w-12 h-px bg-gradient-to-r from-transparent to-indigo-200 hidden lg:block"></div>

          {!isComplete ? (
            <div className="space-y-8 relative">
              {/* Status Indicator */}
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                </div>
                <span className="text-emerald-700 font-bold font-mono text-xs uppercase tracking-widest">
                  Real-time Analysis Active
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Decoding Sales <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                    Psychology
                  </span>
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                  Watch how our AI identifies psychological triggers and scores
                  your technique in real-time.
                </p>
              </div>

              {/* Active Feature Card */}
              <div className="relative min-h-[200px] perspective-[1000px]">
                {activeFeature ? (
                  <div
                    key={activeFeature.title}
                    className="bg-white border border-slate-100 rounded-2xl p-8 animate-scale-up shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transform transition-all hover:scale-[1.02]"
                  >
                    {/* Glowing corner accent */}
                    <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-tr-2xl blur-xl pointer-events-none"></div>

                    <div className="flex items-start gap-6">
                      <div
                        className={`w-14 h-14 rounded-2xl ${activeFeature.bgColor} ${activeFeature.color} flex items-center justify-center shadow-sm shrink-0`}
                      >
                        {React.cloneElement(activeFeature.icon, {
                          className: "w-7 h-7",
                        })}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-3.5 h-3.5 text-indigo-600 fill-current" />
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            Insight Detected
                          </span>
                        </div>
                        <h3
                          className={`text-xl font-bold ${activeFeature.textColor} mb-3`}
                        >
                          {activeFeature.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {activeFeature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 opacity-40 grayscale">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center animate-pulse border border-slate-200">
                      <BarChart3 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in relative z-20">
              <div className="relative group">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-2xl shadow-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -ml-10 -mb-10"></div>

                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                      <CheckCircle className="w-3 h-3" /> Analysis Complete
                    </div>
                    <div className="relative mb-2">
                      <div className="text-8xl font-black text-slate-900 tracking-tighter relative z-10">
                        92
                        <span className="text-3xl text-slate-400 ml-1 font-bold">
                          /100
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-px bg-slate-100 my-8"></div>
                    <p className="text-slate-600 font-medium leading-relaxed text-lg">
                      <span className="text-indigo-600 font-bold">
                        Excellent work.
                      </span>{" "}
                      You successfully navigated the "Budget" objection by
                      pivoting to value and closed with a specific time
                      proposal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onStart}
                  className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5 fill-current" /> Start Training Now
                </button>
                <button
                  onClick={() => onNavigate(AppView.LANDING)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors hover:text-slate-900"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
