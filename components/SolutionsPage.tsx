import React from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  Target,
  Users,
  TrendingUp,
  Building2,
  GraduationCap,
  Briefcase,
} from "lucide-react";

interface SolutionsPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigate,
  onStart,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <MarketingNavbar
        currentView={AppView.SOLUTIONS}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          <h1
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            Solutions for Every{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Team
            </span>
          </h1>
          <p
            className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-200"
            style={{ animationFillMode: "both" }}
          >
            Whether you are scaling a massive SDR team or refining the skills of
            senior AEs, SalesForce.ai has a tailored solution.
          </p>
        </div>

        <div className="space-y-24">
          {/* Enterprise Sales */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Enterprise Sales Teams
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Scale your onboarding process by 300%. Ensure every new rep is
                pitch-perfect before they touch a real lead. Standardize
                messaging across global teams and track compliance
                automatically.
              </p>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>{" "}
                  Unified Pitch Certification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>{" "}
                  Automated Roleplay Assignments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>{" "}
                  Team-wide Performance Heatmaps
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <Building2 className="w-24 h-24" />
              </div>
            </div>
          </div>

          {/* High Velocity Sales */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                High-Velocity SDRs
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Reduce ramp time and burnout. Give your SDRs a safe space to
                practice cold calls and handle rejection without fear. Build
                "muscle memory" for objection handling.
              </p>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>{" "}
                  Cold Call Simulators
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>{" "}
                  Gatekeeper Navigation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>{" "}
                  Rejection Resilience Training
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <TrendingUp className="w-24 h-24" />
              </div>
            </div>
          </div>

          {/* Sales Coaching */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Sales Enablement Leaders
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Deploy new messaging strategies instantly. Verify that reps are
                using the new positioning. Identify skill gaps across the
                organization with data, not intuition.
              </p>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>{" "}
                  Custom Scenario Builder
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>{" "}
                  Skill Gap Analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>{" "}
                  ROI Tracking
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <GraduationCap className="w-24 h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
