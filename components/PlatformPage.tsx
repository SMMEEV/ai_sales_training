import React from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import { Bot, Zap, Shield, BarChart3, Globe, Mic } from "lucide-react";

interface PlatformPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const PlatformPage: React.FC<PlatformPageProps> = ({
  onNavigate,
  onStart,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <MarketingNavbar
        currentView={AppView.PLATFORM}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          <h1
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            The Complete{" "}
            <span className="text-indigo-600">AI Sales Platform</span>
          </h1>
          <p
            className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200"
            style={{ animationFillMode: "both" }}
          >
            Built on Gemini 2.5 Flash technology, our platform provides an
            end-to-end environment for sales mastery, from voice simulation to
            deep behavioral analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Bot className="w-8 h-8 text-white" />,
              title: "Adaptive AI Personas",
              desc: "Train against diverse customer personalities—from the Skeptic to the Champion. Our AI adapts its objection strategy in real-time.",
              color: "bg-indigo-600",
            },
            {
              icon: <Mic className="w-8 h-8 text-white" />,
              title: "Real-time Voice Engine",
              desc: "Ultra-low latency voice processing enables natural, interruptible conversations that feel just like a real phone call.",
              color: "bg-blue-600",
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-white" />,
              title: "Behavioral Analytics",
              desc: "Beyond simple transcription. We analyze tone, pacing, empathy, and objection handling techniques against top-performer benchmarks.",
              color: "bg-purple-600",
            },
            {
              icon: <Globe className="w-8 h-8 text-white" />,
              title: "Multi-Language Support",
              desc: "Global teams need global training. Practice in English, Spanish, French, German, and more with native-level fluency.",
              color: "bg-emerald-600",
            },
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              title: "Instant Feedback Loop",
              desc: "Stop waiting for manager reviews. Get a detailed scorecard seconds after every roleplay session.",
              color: "bg-amber-500",
            },
            {
              icon: <Shield className="w-8 h-8 text-white" />,
              title: "Enterprise Grade Security",
              desc: "Your proprietary sales scripts and training data are protected with SOC2 compliant infrastructure.",
              color: "bg-slate-900",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
