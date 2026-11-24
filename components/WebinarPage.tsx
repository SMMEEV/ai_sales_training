import React, { useState, useEffect, useRef } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  Play,
  Calendar,
  Clock,
  User,
  Mic,
  Video,
  Users,
  ArrowRight,
  Zap,
  Star,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Check,
  Download,
  Share2,
  Home,
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

interface WebinarPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const WebinarPage: React.FC<WebinarPageProps> = ({
  onNavigate,
  onStart,
}) => {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "PAST">("UPCOMING");
  const [selectedWebinar, setSelectedWebinar] = useState<any | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<
    "IDLE" | "SUBMITTING" | "SUCCESS"
  >("IDLE");
  const [pageLoading, setPageLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    challenge: "",
  });

  const upcomingWebinars = [
    {
      id: 1,
      title: "Advanced Objection Handling: The Psychology of 'No'",
      date: "Oct 24, 2025",
      time: "2:00 PM EST",
      instructor: "TR",
      role: "Sales Expert",
      attendees: "2.4k Registered",
      desc: "Learn the 3-step framework to turn hard rejections into discovery opportunities.",
      tags: ["Negotiation", "Psychology"],
    },
    {
      id: 2,
      title: "Cold Calling in 2026: What Still Works?",
      date: "Oct 31, 2025",
      time: "1:00 PM EST",
      instructor: "Sarah Jenkins",
      role: "VP of Sales",
      attendees: "1.8k Registered",
      desc: "Data-backed strategies for modern outreach. Stop getting blocked by gatekeepers.",
      tags: ["Outreach", "SDR Strategy"],
    },
  ];

  const pastWebinars = [
    {
      id: 101,
      title: "The Art of the Discovery Call",
      duration: "58m 20s",
      instructor: "TR",
      views: "15k Views",
      date: "Sep 15, 2025",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: 102,
      title: "Closing Enterprise Deals Faster",
      duration: "1h 12m",
      instructor: "David Chen",
      views: "12k Views",
      date: "Aug 28, 2025",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      id: 103,
      title: "AI-Powered Sales Workflows",
      duration: "45m 10s",
      instructor: "Sarah Jenkins",
      views: "18k Views",
      date: "Aug 10, 2025",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 104,
      title: "Negotiation Mastery: Price vs Value",
      duration: "1h 05m",
      instructor: "TR",
      views: "22k Views",
      date: "Jul 22, 2025",
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      id: 105,
      title: "Building a High-Velocity SDR Team",
      duration: "55m 00s",
      instructor: "Elena Rodriguez",
      views: "9.5k Views",
      date: "Jul 05, 2025",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: 106,
      title: "Email Copywriting That Converts",
      duration: "48m 30s",
      instructor: "Mike Ross",
      views: "14k Views",
      date: "Jun 18, 2025",
      gradient: "from-rose-500 to-orange-500",
    },
  ];

  const handleRegisterClick = (webinar: any) => {
    setSelectedWebinar(webinar);
    setRegistrationStatus("IDLE");
    setFormData({ name: "", email: "", phone: "", challenge: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedWebinar(null);
    setRegistrationStatus("IDLE");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStatus("SUBMITTING");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRegistrationStatus("SUCCESS");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // REGISTRATION PAGE VIEW
  if (selectedWebinar) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        </div>

        <MarketingNavbar
          currentView={AppView.WEBINAR}
          onNavigate={onNavigate}
          onStart={onStart}
        />

        <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-8 group"
          >
            <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm">Back to Webinars</span>
          </button>

          <div className="max-w-4xl mx-auto">
            {registrationStatus === "SUCCESS" ? (
              <div className="max-w-xl mx-auto relative animate-scale-up">
                {/* Confetti/Decoration Background */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                {/* Ticket Card */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 relative z-10">
                  {/* Gradient Banner */}
                  <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  </div>

                  {/* Content Body */}
                  <div className="px-8 pb-10 -mt-12 relative text-center">
                    <div className="w-24 h-24 bg-white rounded-full p-2 mx-auto shadow-xl mb-6 flex items-center justify-center relative z-20">
                      <div className="w-full h-full bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-200/20 animate-ping rounded-full"></div>
                        <CheckCircle className="w-10 h-10 text-emerald-500 relative z-10" />
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                      Registration Confirmed!
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-base">
                      You've secured your spot. A calendar invite has been sent
                      to{" "}
                      <span className="font-bold text-slate-900">
                        {formData.email}
                      </span>
                      .
                    </p>

                    {/* Ticket Details */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/60 relative overflow-hidden mb-8 text-left shadow-inner">
                      {/* Ticket Cutouts */}
                      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border-r border-slate-200 rounded-r-full"></div>
                      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border-l border-slate-200 rounded-l-full"></div>

                      <div className="p-6 pb-4 relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-indigo-600">
                            <Video className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Event
                            </div>
                            <div className="font-bold text-slate-900 text-lg leading-tight">
                              {selectedWebinar.title}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Date
                            </div>
                            <div className="font-semibold text-slate-700 flex items-center gap-1.5 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {selectedWebinar.date}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Time
                            </div>
                            <div className="font-semibold text-slate-700 flex items-center gap-1.5 text-sm">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {selectedWebinar.time}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dashed Separator */}
                      <div className="relative flex items-center justify-center px-4">
                        <div className="w-full border-t-2 border-dashed border-slate-200"></div>
                      </div>

                      <div className="p-4 bg-slate-100/50">
                        <div className="flex gap-3">
                          <button className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 text-xs shadow-sm hover:shadow-md">
                            <Calendar className="w-3.5 h-3.5" /> Add to Calendar
                          </button>
                          <button className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 text-xs shadow-sm hover:shadow-md">
                            <Share2 className="w-3.5 h-3.5" /> Share Event
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBack}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                    >
                      Browse More Webinars
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-fade-in">
                {/* Webinar Details Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg sticky top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
                    Live Session
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                    {selectedWebinar.title}
                  </h1>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          Date
                        </div>
                        <div className="font-bold text-slate-900">
                          {selectedWebinar.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          Time
                        </div>
                        <div className="font-bold text-slate-900">
                          {selectedWebinar.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          Format
                        </div>
                        <div className="font-bold text-slate-900">
                          Live Zoom Webinar
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-slate-500 text-xs">
                        {selectedWebinar.instructor.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedWebinar.instructor}
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedWebinar.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">
                    Secure Your Spot
                  </h2>
                  <p className="text-slate-500 mb-8 relative z-10">
                    Fill out the form below to receive your access link.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 relative z-10"
                  >
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email"
                          placeholder="john@company.com"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        What is your biggest challenge in closing?
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          required
                          name="challenge"
                          value={formData.challenge}
                          onChange={handleInputChange}
                          placeholder="e.g. Handling price objections..."
                          rows={3}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={registrationStatus === "SUBMITTING"}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                      {registrationStatus === "SUBMITTING" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                      By registering, you agree to our{" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-700 underline"
                      >
                        Terms of Service
                      </button>{" "}
                      and Privacy Policy.
                    </p>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Elements (Matching Landing Page) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-purple-300/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <MarketingNavbar
        currentView={AppView.WEBINAR}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <AnimateOnScroll variant="fade-up" delay={0}>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
              Master Sales with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                Elite Mentorship.
              </span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll variant="scale-up" delay={150}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Coaching Series
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={250}>
            <p className="text-lg lg:text-xl text-slate-500 mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Join weekly deep-dive sessions with industry veterans. Dissect
              live calls, learn advanced negotiation, and get your questions
              answered in real-time.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 border-t border-slate-200/60 pt-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                ></div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">50k+</div>
              <div className="text-xs text-slate-500 font-medium">
                Attendees
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">Weekly</div>
              <div className="text-xs text-slate-500 font-medium">
                Live Sessions
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">Free</div>
              <div className="text-xs text-slate-500 font-medium">
                For Members
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <AnimateOnScroll variant="fade-up" delay={250}>
          <div className="flex justify-center mb-12">
            <div className="p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm inline-flex relative">
              <button
                onClick={() => setActiveTab("UPCOMING")}
                className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
                  activeTab === "UPCOMING"
                    ? "text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Upcoming Events
                {activeTab === "UPCOMING" && (
                  <div className="absolute inset-0 bg-slate-900 rounded-xl -z-10 animate-fade-in"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("PAST")}
                className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
                  activeTab === "PAST"
                    ? "text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                On-Demand Library
                {activeTab === "PAST" && (
                  <div className="absolute inset-0 bg-slate-900 rounded-xl -z-10 animate-fade-in"></div>
                )}
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* List Content */}
        <AnimateOnScroll variant="fade-up" delay={350}>
          <div className="space-y-8">
            {pageLoading ? (
              activeTab === "UPCOMING" ? (
                <div className="grid gap-6 w-full animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[2rem] p-1 border border-slate-200 shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                        <div className="shrink-0 bg-slate-200/50 rounded-2xl p-4 w-full md:w-28 h-24 md:h-28"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-5 w-32 bg-slate-200/50 rounded-full"></div>
                          <div className="h-8 md:h-10 w-full max-w-lg bg-slate-200/50 rounded-xl"></div>
                          <div className="h-6 w-full max-w-2xl bg-slate-200/50 rounded-md"></div>
                          <div className="flex flex-wrap items-center gap-4 pt-4 mt-6">
                            <div className="h-10 w-32 bg-slate-200/50 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden"
                    >
                      <div className="h-48 bg-slate-200/50 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-slate-300/50"></div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 lg:p-8 flex flex-col space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-20 bg-slate-200/50 rounded-md"></div>
                          <div className="h-5 w-20 bg-slate-200/50 rounded-md"></div>
                        </div>
                        <div className="h-12 w-full bg-slate-200/50 rounded-lg"></div>
                        <div className="h-4 w-1/2 bg-slate-200/50 rounded-md mt-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : activeTab === "UPCOMING" ? (
              <AnimateOnScroll variant="fade-up">
                <div className="grid gap-6">
                  {upcomingWebinars.map((webinar) => (
                    <div
                      key={webinar.id}
                      className="group bg-white rounded-[2rem] p-1 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                        {/* Date Badge */}
                        <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 md:gap-0 bg-slate-50 rounded-2xl border border-slate-100 p-4 md:w-28 text-center group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            {webinar.date.split(" ")[0]}
                          </span>
                          <span className="text-3xl font-black text-slate-900">
                            {webinar.date.split(" ")[1].replace(",", "")}
                          </span>
                          <span className="text-xs font-medium text-slate-400 mt-1">
                            {webinar.time}
                          </span>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {webinar.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                              {webinar.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed max-w-2xl">
                              {webinar.desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                              <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                              <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                                +2k
                              </div>
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                              By{" "}
                              <span className="font-bold text-slate-900">
                                {webinar.instructor}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center shrink-0">
                          <button
                            onClick={() => handleRegisterClick(webinar)}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group/btn transform hover:-translate-y-1"
                          >
                            Register Now
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>
            ) : (
              <AnimateOnScroll variant="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastWebinars.map((webinar) => (
                    <div
                      key={webinar.id}
                      className="group bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full cursor-pointer hover:border-indigo-100"
                    >
                      <div
                        className={`h-48 relative overflow-hidden bg-gradient-to-br ${webinar.gradient}`}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        {/* Abstract Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-white group-hover:text-indigo-600">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-white text-[10px] font-bold border border-white/10">
                          {webinar.duration}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                            {webinar.date}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                            <Play className="w-3 h-3" /> {webinar.views}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                          {webinar.title}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500">
                            {webinar.instructor}
                          </span>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Watch <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </AnimateOnScroll>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Zap className="w-5 h-5 text-indigo-600 fill-current" />{" "}
            SalesForce.ai Webinars
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
