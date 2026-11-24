import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { SessionAnalysis } from "../types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Share2,
  Download,
  Image as ImageIcon,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import html2canvas from "html2canvas";

interface AnalysisResultProps {
  analysis: SessionAnalysis | null;
  onBack: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  onBack,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!analysis) return null;

  const handleDownload = async () => {
    if (reportRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(reportRef.current, {
          backgroundColor: "#f8fafc",
          scale: 2,
          logging: false,
          useCORS: true,
          onclone: (clonedDoc) => {
            const scoreElement = clonedDoc.getElementById("score-display");
            if (scoreElement) {
              scoreElement.className =
                "text-6xl font-black text-indigo-600 tracking-tighter";
              scoreElement.style.background = "transparent";
              scoreElement.style.backgroundImage = "none";
              scoreElement.style.webkitTextFillColor = "initial";
              scoreElement.style.color = "#4f46e5";
            }
            const gradientTextElements =
              clonedDoc.querySelectorAll(".text-transparent");
            gradientTextElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.color = "#4f46e5";
                el.style.background = "none";
                el.style.backgroundImage = "none";
                el.style.webkitTextFillColor = "initial";
                (el.style as any).textFillColor = "initial";
                el.classList.remove("text-transparent", "bg-clip-text");
              }
            });
          },
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `SalesAI_Analysis_${new Date().toISOString().split("T")[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed:", error);
        toast.error("Could not generate image. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleShare = async () => {
    const textToShare = `🏆 SalesForce AI Training Results\n\nOverall Score: ${analysis.overallScore}/100\n\n✅ Strengths:\n${analysis.keyStrengths.map((s) => `• ${s}`).join("\n")}\n\n💡 Focus Areas:\n${analysis.areasForImprovement.map((s) => `• ${s}`).join("\n")}\n\n#SalesTraining #AI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sales Training Analysis",
          text: textToShare,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        setIsCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
        toast.error("Could not copy to clipboard.");
      }
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-12 animate-fade-in pb-16 px-6 lg:px-12">
      {/* Printable Area Wrapper */}
      <div ref={reportRef} className="space-y-10 p-4 md:p-0">
        {/* Header Section */}
        <div className="glass-card rounded-3xl p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden border border-white/60 shadow-xl shadow-indigo-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                Session Complete
              </div>
              <div className="text-slate-400 text-sm font-medium">Just now</div>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">
              Analysis Report
            </h2>
            <p className="text-slate-500 text-xl">
              Detailed performance breakdown vs. AI Benchmarks
            </p>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
                Total Score
              </div>
              <div
                id="score-display"
                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 tracking-tighter"
              >
                {analysis.overallScore}
              </div>
            </div>
            <div className="w-px h-20 bg-slate-200 hidden md:block"></div>
            <div className="flex flex-col gap-3" data-html2canvas-ignore>
              <button
                onClick={handleShare}
                className="p-4 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md active:scale-95"
                title={isCopied ? "Copied!" : "Share Analysis"}
              >
                {isCopied ? (
                  <Check className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Share2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Radar Chart Section */}
          <div className="glass-card rounded-3xl p-10 flex flex-col border border-white/60 shadow-lg shadow-indigo-500/5">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              Skill Radar
            </h3>
            <div className="flex-1 min-h-[450px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={analysis.metrics}
                >
                  <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="You"
                    dataKey="userScore"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="AI Target"
                    dataKey="aiBenchmark"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="#e2e8f0"
                    fillOpacity={0.4}
                  />
                  <Legend iconType="circle" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      padding: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Executive Summary & Key Points */}
          <div className="space-y-10">
            <div className="glass-card rounded-3xl p-10 relative overflow-hidden border border-white/60 shadow-lg shadow-indigo-500/5">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award className="w-40 h-40 text-indigo-900" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Executive Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {analysis.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50/50 backdrop-blur-sm rounded-3xl p-10 border border-emerald-100">
                <h4 className="text-emerald-800 font-bold mb-6 flex items-center gap-2 text-xl">
                  <CheckCircle className="w-6 h-6" /> Strengths
                </h4>
                <ul className="space-y-4">
                  {analysis.keyStrengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-emerald-700/90 font-medium flex items-start gap-3 text-lg"
                    >
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/50 backdrop-blur-sm rounded-3xl p-10 border border-amber-100">
                <h4 className="text-amber-800 font-bold mb-6 flex items-center gap-2 text-xl">
                  <AlertTriangle className="w-6 h-6" /> Focus Areas
                </h4>
                <ul className="space-y-4">
                  {analysis.areasForImprovement.map((s, i) => (
                    <li
                      key={i}
                      className="bg-white/60 p-5 rounded-2xl border border-amber-200 hover:border-amber-300 transition-colors shadow-sm flex items-start gap-4"
                    >
                      <div className="mt-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium leading-relaxed">
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics List */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/60 shadow-xl shadow-slate-200/50">
          <div className="px-10 py-8 border-b border-white/50 bg-white/40">
            <h3 className="text-xl font-bold text-slate-800">
              Detailed Metric Breakdown
            </h3>
          </div>
          <div className="divide-y divide-slate-100/50">
            {analysis.metrics.map((metric, index) => (
              <div
                key={index}
                className="p-10 hover:bg-white/40 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <h4 className="font-bold text-xl text-slate-800">
                    {metric.category}
                  </h4>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-medium">You</span>
                      <span className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                        {metric.userScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-medium">Target</span>
                      <span className="px-5 py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-lg border border-slate-200">
                        {metric.aiBenchmark}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 mb-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full relative transition-all duration-1000 ease-out"
                    style={{ width: `${metric.userScore}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50/80 p-6 rounded-2xl border border-slate-100 text-lg">
                  {metric.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="glass-card rounded-3xl p-10 border border-indigo-100/50 relative overflow-hidden shadow-lg shadow-indigo-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <ImageIcon className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Export Analysis Report
              </h3>
              <p className="text-slate-500 text-lg">
                Your performance metrics are ready to download
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`group relative px-10 py-5 border rounded-2xl font-bold text-lg transition-all shadow-md active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden ${
              isDownloading
                ? "bg-indigo-50 border-indigo-100 text-indigo-400"
                : "bg-white border-indigo-100 text-indigo-600 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-indigo-500/20"
            }`}
          >
            {!isDownloading && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}

            <div className="relative flex items-center gap-3">
              {isDownloading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Saving Report...
                </>
              ) : (
                <>
                  Download Report
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onBack}
          className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-slate-500/20 transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 origin-left"></div>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
