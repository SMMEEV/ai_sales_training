import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle,
  Copy,
  Loader2,
  Sparkles,
  Home,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AnimateOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?:
    | "fade-up"
    | "fade-in"
    | "blur-in"
    | "scale-up"
    | "slide-left"
    | "slide-right";
  delay?: number;
  duration?: number;
  threshold?: number;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 50);
          observer.disconnect();
        }
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  const variants: Record<string, { hidden: string; visible: string }> = {
    "fade-up": {
      hidden: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-in": { hidden: "opacity-0", visible: "opacity-100" },
    "blur-in": {
      hidden: "opacity-0 blur-md scale-95",
      visible: "opacity-100 blur-0 scale-100",
    },
    "scale-up": {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
    "slide-left": {
      hidden: "opacity-0 translate-x-12",
      visible: "opacity-100 translate-x-0",
    },
    "slide-right": {
      hidden: "opacity-0 -translate-x-12",
      visible: "opacity-100 translate-x-0",
    },
  };

  return (
    <div
      ref={ref}
      className={`transform will-change-transform ${variants[variant].hidden} ${isVisible ? variants[variant].visible : ""} ${className}`}
      style={{
        transitionProperty: "all",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

interface TemplatesPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

interface Script {
  id: number;
  title: string;
  category: string;
  context: string;
  content: string;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onNavigate,
  onStart,
}) => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const scriptRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const scripts: Script[] = [
    {
      id: 1,
      title: "The 'Pattern Interrupt' Cold Call",
      category: "Cold Outreach",
      context: "Best for busy executives who usually hang up immediately.",
      content: `Sales Rep: "Hi [Name], this is [Your Name]. I'm going to be honest, this is a cold call. You can hang up now, or give me 30 seconds to explain why I called. Your choice."\n\n(Wait for response - usually they laugh or say go ahead)\n\nSales Rep: "Thanks. I noticed you're using [Competitor/Current Tech]. Most VPs I talk to love it for [Feature A], but hate how it handles [Pain Point B]. Is that something you're dealing with, or did you figure out a workaround?"`,
    },
    {
      id: 2,
      title: "The 'Permission-Based' Opener",
      category: "Cold Outreach",
      context: "Respectful approach for technical or conservative industries.",
      content: `Sales Rep: "Hi [Name], [Your Name] from [Company]. We haven't spoken before. I know I'm catching you in the middle of your day—do you have a moment for me to tell you why I'm calling, and you can decide if we keep talking?"\n\nProspect: "Sure, go ahead."\n\nSales Rep: "Great. We're helping teams like [Competitor 1] and [Competitor 2] eliminate [Specific Problem]. I'm calling to see if this is even a priority for you right now, or if I should get lost?"`,
    },
    {
      id: 3,
      title: "Handling 'Send Me Information'",
      category: "Objection Handling",
      context: "Use when prospect tries to brush you off early.",
      content: `Prospect: "Just send me some information."\n\nSales Rep: "I can certainly do that. But to be honest, I have a 20-page PDF and a 2-page summary. To make sure I don't flood your inbox with irrelevant stuff, could you tell me one thing you're hoping to fix regarding [Topic] this quarter?"\n\n(This forces them to engage or admit they aren't interested)`,
    },
    {
      id: 4,
      title: "The 'Budget' Pivot",
      category: "Objection Handling",
      context: "When they say they have no money before seeing value.",
      content: `Prospect: "We don't have budget for this."\n\nSales Rep: "That's completely expected. Most of our partners didn't have a budget line item for this until they saw the ROI. I'm not asking for a check today. I'm asking for 15 minutes to show you how we could save you [Amount] next year. If you don't see the value, we part ways as friends. Fair?"`,
    },
    {
      id: 5,
      title: "The 'Competitor' Trap",
      category: "Objection Handling",
      context: "When they mention they use a competitor.",
      content: `Prospect: "We already use [Competitor]."\n\nSales Rep: "They're a great company. A lot of our current clients used to be with them. Usually, people stick with them for [Competitor Strength], but switch to us because of [Your Unique Value]. How are you finding their [Specific Feature]?"`,
    },
    {
      id: 6,
      title: "Discovery: The Magic Wand",
      category: "Discovery",
      context: "Uncovering deep pain points.",
      content: `Sales Rep: "If you could wave a magic wand and change one thing about your current [Process/Workflow] without worrying about cost or implementation time, what would it be?"\n\nProspect: "[Answer]"\n\nSales Rep: "Interesting. Why that specifically?"`,
    },
    {
      id: 7,
      title: "Discovery: The Cost of Inaction",
      category: "Discovery",
      context: "Creating urgency by highlighting loss.",
      content: `Sales Rep: "What happens if you don't fix [Problem] in the next 6 months?"\n\nProspect: "Well, we'd probably lose X."\n\nSales Rep: "And if you still haven't fixed it a year from now?"\n\n(Let the prospect quantify their own pain)`,
    },
    {
      id: 8,
      title: "The 'Trial Close'",
      category: "Closing",
      context: "Testing the waters before the final ask.",
      content: `Sales Rep: "Based on what we've discussed, it seems like our solution addresses [Pain Point A] and [Pain Point B]. Do you see any reason why this wouldn't work for your team?"\n\n(If they say no, you move to next steps. If they have objections, they come out now)`,
    },
    {
      id: 9,
      title: "The '1-to-10' Close",
      category: "Closing",
      context: "Gauging readiness to buy.",
      content: `Sales Rep: "On a scale of 1 to 10, where 1 is 'I hate this' and 10 is 'Send me the contract right now', where are we?"\n\nProspect: "I'm at a 7."\n\nSales Rep: "That's great. What would we need to see to get you to a 10?"`,
    },
    {
      id: 10,
      title: "Referral Request (Post-Sale)",
      category: "Referral",
      context: "Leveraging happy customers for new leads.",
      content: `Sales Rep: "I'm really glad we could get [Result] for you. I'm trying to help other VPs in your industry achieve similar results. Is there one person in your network who is currently struggling with [Problem] that you think I should talk to?"`,
    },
  ];

  const handleDownloadPDF = async (script: Script) => {
    const element = scriptRefs.current[script.id];
    if (!element) return;

    setDownloadingId(script.id);

    try {
      // Temporarily make the element visible/styled for capture if needed,
      // but here we just capture the card as is.
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${script.title.replace(/\s+/g, "_")}_Script.pdf`);
    } catch (error) {
      console.error("PDF Generation Error", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Script copied to clipboard!");
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <MarketingNavbar
          currentView={AppView.TEMPLATES}
          onNavigate={onNavigate}
          onStart={onStart}
        />

        <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimateOnScroll variant="fade-up" delay={0}>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
                10 <span className="whitespace-nowrap">High-Converting</span>{" "}
                <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Sales Scripts.
                </span>
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll variant="scale-up" delay={150}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3 fill-current" /> Proven to Convert
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={250}>
              <p className="text-lg lg:text-xl text-slate-500 mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Stop reinventing the wheel. These battle-tested scripts have
                generated millions in pipeline revenue. Copy, paste, and close.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Scripts Grid Skeleton */}
          <AnimateOnScroll variant="fade-up" delay={350}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col h-[500px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-24 h-6 bg-slate-200/50 rounded-lg" />
                    <div className="w-8 h-8 rounded-full bg-slate-200/50" />
                  </div>
                  <div className="h-8 w-1/2 bg-slate-200/50 rounded-md mb-2" />
                  <div className="h-4 w-3/4 bg-slate-200/50 rounded-md mb-6" />
                  <div className="flex-1 bg-slate-200/50 rounded-xl mb-8" />
                  <div className="h-12 w-full bg-slate-200/50 rounded-xl mt-auto" />
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <MarketingNavbar
        currentView={AppView.TEMPLATES}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimateOnScroll variant="fade-up" delay={0}>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
              10 <span className="whitespace-nowrap">High-Converting</span>{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Sales Scripts.
              </span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll variant="scale-up" delay={150}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3 fill-current" /> Proven to Convert
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={250}>
            <p className="text-lg lg:text-xl text-slate-500 mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Stop reinventing the wheel. These battle-tested scripts have
              generated millions in pipeline revenue. Copy, paste, and close.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Scripts Grid */}
        <AnimateOnScroll variant="fade-up" delay={350}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {scripts.map((script) => (
              <div
                key={script.id}
                ref={(el) => {
                  if (el) scriptRefs.current[script.id] = el;
                }}
                className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                      {script.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(script.content)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
                        title="Copy Text"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {script.title}
                  </h3>
                  <p className="text-slate-500 text-sm italic mb-6 border-l-2 border-indigo-200 pl-3">
                    {script.context}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner flex-1">
                    {script.content}
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleDownloadPDF(script)}
                      disabled={downloadingId === script.id}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 shadow-sm group/btn"
                    >
                      {downloadingId === script.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />{" "}
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </main>
    </div>
  );
};
