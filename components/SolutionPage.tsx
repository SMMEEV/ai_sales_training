import React, { useEffect } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  PhoneCall,
  Target,
  Briefcase,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Brain,
  Video,
  MessagesSquare,
  Zap,
} from "lucide-react";

import { TermsModal } from "./TermsModal";

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
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

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

interface SolutionPageProps {
  view: AppView;
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const SolutionPage: React.FC<SolutionPageProps> = ({
  view,
  onNavigate,
  onStart,
}) => {
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  let content = {
    titleMain: "",
    titleHighlight: "",
    titleTag: "",
    subtitle: "",
    titleIcon: <PhoneCall className="w-5 h-5 text-indigo-600 animate-pulse" />,
    icon: <PhoneCall className="w-12 h-12 text-indigo-600" />,
    whatIs: "",
    whatIsDesc: "",
    features: [] as { title: string; desc: string; icon: React.ReactNode }[],
    imageLeft: "",
    imageRight: "",
    colorFrom: "from-indigo-600",
    colorTo: "to-cyan-500",
    bgColor: "bg-indigo-50",
  };

  if (view === AppView.SOLUTION_SDR) {
    content = {
      titleMain: "Master Your",
      titleHighlight: "Cold Outreach",
      titleTag: "For SDRs & BDRs",
      subtitle:
        "Perfect your cold calling and qualification process with AI-driven roleplays.",
      titleIcon: <PhoneCall className="w-5 h-5 text-blue-600 animate-pulse" />,
      icon: <PhoneCall className="w-12 h-12 text-blue-600" />,
      whatIs: "What is SalesForce.ai for SDRs?",
      whatIsDesc:
        "Our platform provides a risk-free environment for Sales Development Reps (SDRs) and Business Development Reps (BDRs) to practice cold calling, objection handling, and lead qualification via hyper-realistic AI simulations.",
      features: [
        {
          title: "Cold Call Simulations",
          desc: "Practice with AI personas that simulate different gatekeepers and prospects.",
          icon: <PhoneCall className="w-6 h-6 text-blue-600" />,
        },
        {
          title: "Objection Handling",
          desc: "Learn to overcome common objections like 'Not interested' or 'Send me an email'.",
          icon: <MessagesSquare className="w-6 h-6 text-indigo-600" />,
        },
        {
          title: "Pitch Perfecting",
          desc: "Get instant AI feedback on your pacing, tone, and opening value proposition.",
          icon: <TrendingUp className="w-6 h-6 text-cyan-600" />,
        },
      ],
      imageLeft:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop",
      imageRight:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2669&auto=format&fit=crop",
      colorFrom: "from-blue-600",
      colorTo: "to-cyan-500",
      bgColor: "bg-blue-50/50",
    };
  } else if (view === AppView.SOLUTION_AE) {
    content = {
      titleMain: "Close More",
      titleHighlight: "Complex Deals",
      titleTag: "For Account Executives",
      subtitle: "Master closing strategies and complex deal negotiations.",
      titleIcon: <Briefcase className="w-5 h-5 text-amber-600 animate-pulse" />,
      icon: <Briefcase className="w-12 h-12 text-amber-600" />,
      whatIs: "What is SalesForce.ai for AEs?",
      whatIsDesc:
        "For Account Executives, SalesForce.ai offers advanced negotiation simulations, multi-stakeholder decision maker scenarios, and closing techniques to improve win rates.",
      features: [
        {
          title: "Discovery Mastery",
          desc: "Conduct deeper discovery with AI buyers to identify true pain points and needs.",
          icon: <Target className="w-6 h-6 text-amber-600" />,
        },
        {
          title: "Deal Negotiation",
          desc: "Navigate complex pricing and timeline negotiations with tough AI personas.",
          icon: <Briefcase className="w-6 h-6 text-orange-600" />,
        },
        {
          title: "Competitor Traps",
          desc: "Learn how to respond when prospects bring up competitors during a demo.",
          icon: <Brain className="w-6 h-6 text-yellow-600" />,
        },
      ],
      imageLeft:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2532&auto=format&fit=crop",
      imageRight:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop",
      colorFrom: "from-amber-500",
      colorTo: "to-orange-500",
      bgColor: "bg-amber-50/50",
    };
  } else if (view === AppView.SOLUTION_MANAGER) {
    content = {
      titleMain: "Scale Your",
      titleHighlight: "Sales Coaching",
      titleTag: "For Sales Managers",
      subtitle:
        "Scale your coaching and track your team's readiness in real-time.",
      titleIcon: <Target className="w-5 h-5 text-rose-600 animate-pulse" />,
      icon: <Target className="w-12 h-12 text-rose-600" />,
      whatIs: "What is SalesForce.ai for Managers?",
      whatIsDesc:
        "Sales managers use our platform as a force multiplier. Instead of listening to hours of call recordings, you view a dashboard of AI-analyzed practice sessions to pinpoint exactly who needs coaching on what.",
      features: [
        {
          title: "Team Skill Heatmaps",
          desc: "Identify strengths and weaknesses across the entire floor instantly.",
          icon: <TrendingUp className="w-6 h-6 text-rose-600" />,
        },
        {
          title: "Automated Coaching",
          desc: "Provide baseline training automatically before you step in for advanced coaching.",
          icon: <Brain className="w-6 h-6 text-pink-600" />,
        },
        {
          title: "Readiness Scoring",
          desc: "Know exactly which reps are ready to handle live calls based on simulation scores.",
          icon: <Target className="w-6 h-6 text-fuchsia-600" />,
        },
      ],
      imageLeft:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
      imageRight:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      colorFrom: "from-rose-600",
      colorTo: "to-pink-500",
      bgColor: "bg-rose-50/50",
    };
  } else if (view === AppView.SOLUTION_ENABLEMENT) {
    content = {
      titleMain: "Accelerate Team",
      titleHighlight: "Onboarding",
      titleTag: "For Enablement Teams",
      subtitle:
        "Reduce ramp time and continuously deploy new playbooks at scale.",
      titleIcon: (
        <GraduationCap className="w-5 h-5 text-emerald-600 animate-pulse" />
      ),
      icon: <GraduationCap className="w-12 h-12 text-emerald-600" />,
      whatIs: "What is SalesForce.ai for Enablement?",
      whatIsDesc:
        "Sales Enablement teams leverage our AI to enforce new messaging and accelerate onboarding. Instead of static quizzes, reps prove they understand your product by pitching it to an AI.",
      features: [
        {
          title: "Faster Onboarding",
          desc: "Cut ramp time in half. Let reps stumble with AI, not with your actual leads.",
          icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
        },
        {
          title: "Playbook Rollouts",
          desc: "Launch new messaging and force reps to practice it before they can hit the phones.",
          icon: <Video className="w-6 h-6 text-teal-600" />,
        },
        {
          title: "Custom Scenario Builder",
          desc: "Easily craft training scenarios matching your specific product and target audience.",
          icon: <Target className="w-6 h-6 text-green-600" />,
        },
      ],
      imageLeft:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
      imageRight:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop",
      colorFrom: "from-emerald-600",
      colorTo: "to-teal-600",
      bgColor: "bg-emerald-50/50",
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <MarketingNavbar
        currentView={view}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <main className="flex-grow pt-32 pb-24">
        <div key={view} className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
            <AnimateOnScroll variant="fade-up" delay={0} duration={800}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 py-2">
                {content.titleMain} <br className="hidden md:block" />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${content.colorFrom} ${content.colorTo} pr-2 pb-2 inline-block -mr-2 -mb-2`}
                >
                  {content.titleHighlight}
                </span>
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll variant="scale-up" delay={150} duration={800}>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${content.bgColor} border border-slate-300 text-slate-700 font-bold text-sm mb-6 uppercase tracking-wider`}
              >
                {content.titleIcon} {content.titleTag}
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={250} duration={800}>
              <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            </AnimateOnScroll>
          </div>

          {/* What Is Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
            <div>
              <AnimateOnScroll variant="fade-up" delay={50}>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                  {content.whatIs}
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={150}>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {content.whatIsDesc}
                </p>
              </AnimateOnScroll>
              <div className="space-y-6">
                {content.features.map((feature, idx) => (
                  <AnimateOnScroll
                    key={idx}
                    variant="fade-up"
                    delay={250 + idx * 100}
                  >
                    <div
                      className={`flex gap-4 p-5 rounded-2xl ${content.bgColor} border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="mt-1">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-slate-500 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <AnimateOnScroll variant="scale-up" delay={200}>
                <img
                  src={content.imageLeft}
                  alt="Professional working"
                  className="rounded-3xl w-full h-[300px] md:h-[450px] object-cover shadow-2xl mt-0 md:mt-12"
                />
              </AnimateOnScroll>
              <AnimateOnScroll variant="scale-up" delay={400}>
                <img
                  src={content.imageRight}
                  alt="Team collaboration"
                  className="rounded-3xl w-full h-[300px] md:h-[450px] object-cover shadow-2xl"
                />
              </AnimateOnScroll>
            </div>
          </div>

          {/* Bottom CTA */}
          <AnimateOnScroll variant="scale-up" delay={50}>
            <div className="text-center bg-white border border-slate-100 rounded-[2.5rem] p-12 lg:p-20 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 opacity-50 blur-[80px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 opacity-50 blur-[80px] rounded-full"></div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Ready to transform your process?
                </h2>
                <p className="text-xl text-slate-500 mb-10 font-medium">
                  Join thousands of top performers mastering their craft.
                </p>
                <button
                  onClick={onStart}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2 group hover:-translate-y-0.5"
                >
                  Start Practicing Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </main>

      <footer className="py-12 lg:py-16 px-6 lg:px-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#4f46e5] to-[#3730a3] rounded-xl flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              SalesForce<span className="text-indigo-600">.ai</span>
            </span>
          </div>
          <div className="flex gap-8 text-slate-500 font-medium text-sm">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Privacy
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowTermsModal(true);
              }}
              className="hover:text-indigo-600 transition-colors"
            >
              Terms
            </button>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 SalesForce AI Trainer. All rights reserved.
          </p>
        </div>
      </footer>
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
