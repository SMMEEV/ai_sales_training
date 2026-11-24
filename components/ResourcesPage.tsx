import React from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import { BookOpen, Video, FileText, ArrowRight } from "lucide-react";

interface ResourcesPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  onNavigate,
  onStart,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <MarketingNavbar
        currentView={AppView.RESOURCES}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <h1
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            Sales <span className="text-indigo-600">Knowledge Hub</span>
          </h1>
          <p
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200"
            style={{ animationFillMode: "both" }}
          >
            Guides, scripts, and strategies to help you dominate your quota.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Resource Card 1 */}
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-xl transition-all group cursor-pointer">
            <div className="h-48 bg-blue-100 relative flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <BookOpen className="w-16 h-16 text-blue-500 opacity-50" />
            </div>
            <div className="p-8">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                E-Book
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                The Ultimate Guide to Cold Calling in 2024
              </h3>
              <p className="text-slate-500 mb-6">
                Learn the 5-step framework that top SDRs use to book 20+
                meetings a week.
              </p>
              <div className="flex items-center text-blue-600 font-bold text-sm gap-2">
                Read Now{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Resource Card 2 */}
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-xl transition-all group cursor-pointer">
            <div className="h-48 bg-purple-100 relative flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Video className="w-16 h-16 text-purple-500 opacity-50" />
            </div>
            <div className="p-8">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
                Webinar
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                Objection Handling Masterclass
              </h3>
              <p className="text-slate-500 mb-6">
                Watch our 60-minute deep dive into psychology-based objection
                handling.
              </p>
              <div className="flex items-center text-purple-600 font-bold text-sm gap-2">
                Watch Replay{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Resource Card 3 */}
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-xl transition-all group cursor-pointer">
            <div className="h-48 bg-emerald-100 relative flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <FileText className="w-16 h-16 text-emerald-500 opacity-50" />
            </div>
            <div className="p-8">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Templates
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                10 Proven Email Scripts
              </h3>
              <p className="text-slate-500 mb-6">
                Copy and paste these high-converting email templates for your
                next campaign.
              </p>
              <div className="flex items-center text-emerald-600 font-bold text-sm gap-2">
                Download PDF{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
