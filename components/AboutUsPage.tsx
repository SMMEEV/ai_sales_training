import React, { useEffect, useState } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  Users,
  CheckCircle,
  Target,
  Building2,
  Zap,
  Layout,
  Loader2,
} from "lucide-react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            );
            // using easeOutExpo for smoother animation
            const easeProgress =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * value));

            if (progress < 1) {
              animationFrameId = window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

interface AboutUsPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

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

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigate,
  onStart,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 animate-fade-in">
      <style>
        {`
          @keyframes slowGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background: linear-gradient(-45deg, #f8fafc, #e0e7ff, #cffafe, #f1f5f9, #f8fafc);
            background-size: 400% 400%;
            animation: slowGradient 15s ease infinite;
          }
        `}
      </style>
      <MarketingNavbar
        currentView={AppView.ABOUT_US}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <main className="pt-24 lg:pt-28 animate-gradient-bg min-h-[100vh]">
        {/* Hero Section */}
        <section className="px-6 lg:px-12 pb-10 lg:pb-16 pt-2 lg:pt-4 relative z-10">
          <div className="max-w-[1440px] mx-auto text-center">
            <div className="max-w-4xl mx-auto mb-16">
              <AnimateOnScroll variant="fade-up" delay={0} duration={800}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 py-2">
                  Revolutionizing Sales <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                    With Artificial Intelligence
                  </span>
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll variant="scale-up" delay={200} duration={800}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 border border-slate-300 text-slate-700 font-bold text-sm mb-6 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 animate-pulse" /> About Us
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={300} duration={800}>
                <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                  We believe that every salesperson deserves world-class
                  training. SalesForce.ai bridges the gap between learning and
                  doing with hyper-realistic AI roleplays.
                </p>
              </AnimateOnScroll>
            </div>

            {/* Team Illustration / Image */}
            <AnimateOnScroll
              variant="blur-in"
              delay={400}
              className="relative max-w-6xl mx-auto aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white p-2 bg-white/50 backdrop-blur-sm animate-float-gentle"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
                alt="The Salesforce.ai Team collaborating"
                className="w-full h-full object-cover rounded-[1.5rem]"
              />
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transition to Story */}
        <div className="h-32 md:h-48 bg-gradient-to-b from-transparent to-white w-full pointer-events-none relative z-10"></div>

        {/* Story Section */}
        <section className="pb-16 lg:pb-24 pt-4 px-6 lg:px-12 bg-white relative">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <AnimateOnScroll variant="fade-up" delay={50}>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                  Our Mission
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={150}>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Traditional sales training is broken. It's often passive,
                  repetitive, and fails to prepare representatives for
                  real-world objections. We founded SalesForce.ai to change this
                  paradigm by introducing immersive, AI-driven roleplay
                  simulations.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={250}>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our platform provides a safe space for reps to practice, make
                  mistakes, and receive immediate, actionable feedback without
                  risking real deals. We're on a mission to empower 1 million
                  sales professionals globally.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={350}>
                <ul className="space-y-4 font-bold text-slate-800 mt-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Make top-tier coaching accessible.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Provide objective, data-driven feedback.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span>Reduce onboarding time by up to 50%.</span>
                  </li>
                </ul>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll
              variant="scale-up"
              delay={200}
              className="grid grid-cols-2 gap-6 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mt-12 col-span-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  <AnimatedNumber value={50} suffix="K+" />
                </h3>
                <p className="font-semibold text-slate-500">Users Trained</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-12 col-span-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  <AnimatedNumber value={98} suffix="%" />
                </h3>
                <p className="font-semibold text-slate-500">Confidence Boost</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mt-12 col-span-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  <AnimatedNumber value={2} suffix="M+" />
                </h3>
                <p className="font-semibold text-slate-500">Simulations Run</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-12 col-span-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-2">
                  <AnimatedNumber value={24} suffix="/7" />
                </h3>
                <p className="font-semibold text-slate-500">Platform Access</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl mix-blend-multiply"></div>
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <AnimateOnScroll variant="scale-up" delay={50}>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  Request a Demo
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll variant="fade-up" delay={150}>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Want to see how SalesForce.ai can transform your team's
                  performance? Drop us a line and we'll schedule a personalized
                  walkthrough.
                </p>
              </AnimateOnScroll>
            </div>
            <AnimateOnScroll variant="scale-up" delay={250}>
              <form
                className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-white/50 max-w-2xl mx-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setShowSuccessModal(true);
                  }, 1500);
                }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-bold text-slate-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-bold text-slate-700"
                      >
                        Work Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-bold text-slate-700"
                    >
                      How can we help?
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                      placeholder="Tell us about your team size and goals..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-up border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Selesai!
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Permintaan Anda telah dikonfirmasi. Tim kami akan segera
              menghubungi Anda.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Footer (Simplified for About Page) */}
      <footer className="py-12 lg:py-16 px-6 lg:px-12 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center">
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer"
            onClick={() => onNavigate(AppView.LANDING)}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              SalesForce.ai
            </span>
          </div>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
            © {new Date().getFullYear()} SalesForce.ai Inc. All rights reserved.
            Empowering sales teams worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};
