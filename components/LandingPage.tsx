import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  MessageSquare,
  Mic,
  BarChart3,
  Search,
  User,
  Play,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star,
  Bot,
  Building2,
  GraduationCap,
  Check,
  BookOpen,
  Video,
  FileText,
  Layout,
  Phone,
  PieChart,
  Users,
  X,
  CreditCard,
  Lock,
  Gift,
  Loader2,
  PartyPopper,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Briefcase,
  Ticket,
  Download,
  Calendar,
  Hash,
  Home,
  ChevronDown,
} from "lucide-react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import { TermsModal } from "./TermsModal";

import html2canvas from "html2canvas";

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: AppView) => void;
}

interface AnimateOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?:
    | "fade-up"
    | "blur-in"
    | "scale-up"
    | "fade-in"
    | "slide-left"
    | "slide-right";
  delay?: number;
  duration?: number;
  threshold?: number;
}

// Premium easing for professional feel
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

  const variants = {
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

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-200 shadow-sm group ${isOpen ? "bg-indigo-50/30" : "bg-white"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
      >
        <h4 className="text-lg font-bold text-slate-900 pr-8">{question}</h4>
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-indigo-600" : "bg-slate-100 group-hover:bg-indigo-50"}`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-slate-500 group-hover:text-indigo-500"}`}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 border-t border-slate-100/50">
            <p className="text-slate-600 leading-relaxed font-medium">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onNavigate,
}) => {
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "processing" | "success"
  >("form");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Enterprise Contact State
  const [isEnterpriseContactOpen, setIsEnterpriseContactOpen] = useState(false);
  const [enterpriseStep, setEnterpriseStep] = useState<
    "form" | "processing" | "success"
  >("form");
  const [enterpriseFirstName, setEnterpriseFirstName] = useState("");
  const [enterpriseLastName, setEnterpriseLastName] = useState("");
  const [enterpriseCompanyName, setEnterpriseCompanyName] = useState("");
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleCourseClick = () => {
    onNavigate(AppView.COURSES);
  };

  const handleDemoClick = () => {
    onNavigate(AppView.DEMO);
  };

  const handleWebinarClick = () => {
    onNavigate(AppView.WEBINAR);
  };

  const handleTemplatesClick = () => {
    onNavigate(AppView.TEMPLATES);
  };

  // Coupon & Payment Handlers
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    if (couponCode.toLowerCase() === "salesforceai26") {
      setIsCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setIsCouponApplied(false);
      setTimeout(() => setCouponError(""), 3000);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep("processing");
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setPaymentStep("success");
  };

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseStep("processing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setEnterpriseStep("success");
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    setIsDownloadingTicket(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: null, // Transparent background for the canvas itself, keeping the card's styling
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Enterprise_Ticket_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Ticket generation failed", err);
      toast.error("Could not generate ticket. Please try again.");
    } finally {
      setIsDownloadingTicket(false);
    }
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Essential tools for individual skill building.",
      features: [
        "3 AI Roleplay Sessions",
        "Basic Performance Analytics",
        "1 Standard Persona",
      ],
      cta: "Start for Free",
      highlight: false,
      action: onStart,
    },
    {
      name: "Professional",
      price: isAnnual ? "$39" : "$49",
      period: "/mo",
      desc: "Unlimited practice for dedicated sales professionals.",
      features: [
        "Unlimited Sessions",
        "Voice Analysis 2.0",
        "All 12 Personas",
        "Objection Builder",
        "Priority Support",
      ],
      cta: "Start Trial",
      highlight: true,
      action: () => setIsCheckoutOpen(true),
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Scalable solutions for high-performance teams.",
      features: [
        "Everything in Pro",
        "Manager Dashboard",
        "SSO & Security",
        "Custom Scenarios",
        "API Access",
      ],
      cta: "Contact Sales",
      highlight: false,
      action: () => setIsEnterpriseContactOpen(true),
    },
  ];

  // ENTERPRISE CONTACT VIEW
  if (isEnterpriseContactOpen) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in flex flex-col">
        {/* Navbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-lg">
                SalesForce<span className="text-indigo-600">.ai</span>{" "}
                Enterprise
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> SOC2 Compliant
            </div>
          </div>
        </div>

        {/* Success View */}
        {enterpriseStep === "success" ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
            <div className="max-w-3xl w-full text-center space-y-8 animate-scale-up py-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto relative mb-4">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900">
                  Submission Successful
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed font-medium max-w-xl mx-auto">
                  Submission Successful. Our team is reviewing your company
                  details. Please allow up to 3 business days for verification
                  and account setup
                </p>
              </div>

              {/* APPROVAL LETTER */}
              <div className="flex justify-center py-4">
                <div
                  ref={ticketRef}
                  className="w-full max-w-lg bg-white overflow-hidden shadow-2xl border border-slate-200 relative p-10 sm:p-12 text-left"
                >
                  {/* Brand Header */}
                  <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        SalesForce<span className="text-indigo-600">.ai</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base relative z-10">
                    <p className="font-bold text-slate-900 text-lg">
                      Dear {enterpriseFirstName} {enterpriseLastName},
                    </p>
                    <p>
                      We are thrilled to officially announce the approval of
                      your request for the Enterprise Solution for{" "}
                      <span className="font-bold">{enterpriseCompanyName}</span>
                      . Thank you for choosing SalesForce.ai as your strategic
                      partner.
                    </p>
                    <p>
                      Our team has carefully reviewed your application, and we
                      are excited to work together to elevate your team's sales
                      performance through our AI-driven roleplay simulations and
                      analytics.
                    </p>
                    <p>
                      An onboarding specialist will be in touch with you shortly
                      to guide you through the next steps and ensure a seamless
                      setup process for your organization.
                    </p>
                    <div className="pt-6">
                      <p className="font-bold text-slate-900 mb-1">
                        Sincerely,
                      </p>
                      <p className="font-medium text-slate-600">
                        The SalesForce.ai Team
                      </p>
                    </div>
                  </div>

                  {/* Stamp */}
                  <div className="absolute bottom-6 right-8 transform rotate-[-15deg] opacity-90 flex justify-end pointer-events-none z-0">
                    <div className="w-32 h-32 rounded-full border-[3px] border-indigo-600 flex flex-col items-center justify-center p-2 bg-indigo-50/20 shadow-sm relative">
                      <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full border border-indigo-600 border-dashed absolute top-1 left-1 m-0 opacity-50"></div>
                      <span className="text-indigo-600 font-black text-lg uppercase tracking-widest text-center leading-tight z-10 w-full transform -translate-y-1">
                        APPROVED
                      </span>
                      <span className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest text-center z-10 w-full border-t border-indigo-600/30 pt-1 mt-1">
                        SalesForce.ai
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleDownloadTicket}
                  disabled={isDownloadingTicket}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isDownloadingTicket ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download Ticket
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsEnterpriseContactOpen(false);
                    // Removed onStart() to stay on Landing Page
                  }}
                  className="w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center"
                  title="Back to Home"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Enterprise Form View */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto my-8 lg:my-16 px-6">
              <button
                onClick={() => setIsEnterpriseContactOpen(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" /> Cancel
              </button>

              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                {/* Left Panel: Info */}
                <div className="bg-slate-900 text-white p-8 md:p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -ml-16 -mb-16 pointer-events-none"></div>

                  <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-black leading-tight">
                      Upgrade your Sales Organization
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Get a custom solution tailored to your team's specific
                      methodologies and KPIs.
                    </p>
                    <ul className="space-y-4 pt-4">
                      {[
                        "Custom AI Scenario Building",
                        "Team Performance Heatmaps",
                        "API Integration Support",
                        "Dedicated Success Manager",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 font-medium text-slate-200"
                        >
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                            <Check className="w-3.5 h-3.5 text-indigo-300" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative z-10 pt-12">
                    <div className="flex -space-x-3 mb-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"
                        ></div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      Join 500+ Enterprise teams scaling with SalesForce.ai
                    </p>
                  </div>
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 md:p-12 md:w-3/5 bg-white relative">
                  {enterpriseStep === "processing" && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                      <p className="font-bold text-slate-600">
                        Submitting Request...
                      </p>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Contact Sales
                  </h3>
                  <form onSubmit={handleEnterpriseSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          type="email"
                          placeholder="name@company.com"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          First Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="John"
                          value={enterpriseFirstName}
                          onChange={(e) =>
                            setEnterpriseFirstName(e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Last Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Doe"
                          value={enterpriseLastName}
                          onChange={(e) =>
                            setEnterpriseLastName(e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          type="text"
                          placeholder="Acme Inc."
                          value={enterpriseCompanyName}
                          onChange={(e) =>
                            setEnterpriseCompanyName(e.target.value)
                          }
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Team Size
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none text-slate-600">
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>201-1000</option>
                            <option>1000+</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Job Title
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            type="text"
                            placeholder="VP Sales"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Anything else?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your training goals..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all mt-2"
                    >
                      Request Demo & Pricing
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CHECKOUT VIEW
  if (isCheckoutOpen) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in flex flex-col">
        {/* Checkout Navbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-lg">
                SalesForce<span className="text-indigo-600">.ai</span> Checkout
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Secure SSL Encryption
            </div>
          </div>
        </div>

        {/* Success View */}
        {paymentStep === "success" ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-white">
            <div className="max-w-md w-full text-center space-y-8 animate-scale-up">
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto relative">
                <PartyPopper className="w-16 h-16 text-emerald-600 relative z-10" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping"></div>
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">
                  Access Unlocked!
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Congratulations that VIP access was successfully opened.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Transaction ID
                </p>
                <p className="font-mono text-slate-800">
                  TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  onStart();
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 my-8 lg:my-16 px-4 lg:px-0">
              {/* Back Button (Mobile) */}
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="lg:hidden flex items-center gap-2 text-slate-500 font-bold mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Cancel
              </button>

              {/* Left Column: Order Summary */}
              <div className="lg:col-span-5 bg-slate-100 lg:rounded-l-3xl p-8 lg:p-12 border border-slate-200 lg:border-r-0 flex flex-col order-2 lg:order-1">
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Professional Plan
                      </h3>
                      <p className="text-sm text-slate-500">Billed Monthly</p>
                    </div>
                    <span className="font-bold text-slate-900">$49.00</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Unlimited AI Roleplay",
                      "Advanced Analytics",
                      "Priority Support",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs font-bold text-slate-500"
                      >
                        <Check className="w-3 h-3 text-indigo-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Subtotal</span>
                    <span>$49.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Tax (10%)</span>
                    <span>$4.90</span>
                  </div>

                  {isCouponApplied && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-slide-up">
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4" /> Voucher Applied
                      </span>
                      <span>-$53.90</span>
                    </div>
                  )}

                  <div className="h-px bg-slate-200 my-2"></div>

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-slate-900">Total Due</span>
                    <div className="text-right flex flex-col items-end">
                      {isCouponApplied ? (
                        <div className="animate-fade-in flex flex-col items-end">
                          <span className="text-sm text-slate-400 line-through decoration-slate-400 decoration-2">
                            $53.90
                          </span>
                          <span className="text-3xl font-black text-indigo-600">
                            $0.00
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-black text-slate-900">
                          $53.90
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="mt-auto">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isCouponApplied}
                      className={`flex-1 px-4 py-3 bg-white border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                        couponError
                          ? "border-red-300 focus:border-red-500"
                          : isCouponApplied
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 focus:border-indigo-500"
                      }`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || isCouponApplied}
                      className={`px-6 rounded-xl font-bold text-sm transition-all ${
                        isCouponApplied
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isCouponApplied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs font-bold animate-fade-in">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Payment Details */}
              <div className="lg:col-span-7 bg-white lg:rounded-r-3xl p-8 lg:p-12 border-t lg:border-t-0 lg:border-r lg:border-b border-l border-slate-200 shadow-xl shadow-slate-200/50 order-1 lg:order-2 relative overflow-hidden">
                {paymentStep === "processing" && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                    <p className="font-bold text-slate-600">
                      Processing Payment...
                    </p>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  Payment Details
                </h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-2">
                      Billing Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">
                          First Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="John"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">
                          Last Name
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-2">
                      Card Details
                    </h3>
                    <div className="relative">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">
                          Expiry Date
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">
                          CVC
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            required
                            type="text"
                            placeholder="123"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                        isCouponApplied
                          ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"
                      }`}
                    >
                      {isCouponApplied ? "Activate Free Access" : "Pay $53.90"}
                    </button>

                    <div className="flex justify-center items-center gap-2 mt-4 text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Payments are secure and encrypted
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STANDARD PRICING PAGE VIEW
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
                            linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>

      {/* Extended Background */}
      <div className="fixed inset-0 -z-10 bg-white">
        <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
      </div>

      <MarketingNavbar
        currentView={AppView.LANDING}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-visible">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <AnimateOnScroll variant="fade-up" duration={600}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                <Star className="w-3 h-3 fill-current" />
                <span>AI Sales Coach 2.0</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={100} duration={800}>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
                Close More <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Deals Faster.
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={200}>
              <p className="text-lg lg:text-xl text-slate-500 mb-8 lg:mb-10 leading-relaxed max-w-xl font-medium">
                The enterprise-grade AI roleplay partner. Train your team with
                realistic, voice-enabled prospects and get instant, data-driven
                coaching.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onStart}
                  className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-400 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:opacity-90 hover:shadow-indigo-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 animate-[pulse_3s_ease-in-out_infinite] hover:animate-none hover:-translate-y-1 duration-300"
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  Start Free Training <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDemoClick}
                  className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-slate-200/50 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 origin-left"></div>
                  <span className="flex items-center gap-2 relative">
                    <Play className="w-5 h-5 fill-slate-700" />
                    Watch Demo
                  </span>
                </button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-in" delay={500}>
              <div className="mt-10 flex items-center gap-8 border-t border-slate-100 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm"
                    >
                      <User className="w-5 h-5 opacity-50" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    10k+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    Trusted by top revenue teams
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Visual - Expanded UI Mockup */}
          <div className="relative hidden lg:block h-full min-h-[550px] perspective-[2000px]">
            <div className="relative z-10 animate-float-gentle top-6">
              {/* Main Window */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden w-full max-w-[680px]">
                {/* Window Header */}
                <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-600">
                      Live Simulation
                    </span>
                  </div>
                </div>
                {/* Window Body */}
                <div className="p-8 flex gap-8 bg-white/50">
                  {/* Sidebar */}
                  <div className="w-16 flex flex-col gap-6 items-center border-r border-slate-100 pr-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Discovery: Enterprise SaaS
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Persona: CIO (Skeptic)
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-bold text-slate-900">
                          88/100
                        </div>
                        <div className="text-xs text-emerald-600 font-bold">
                          Excellent Pace
                        </div>
                      </div>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                          <Bot className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 max-w-[90%] border border-slate-100 shadow-sm leading-relaxed">
                          I understand the value prop, but our current stack is
                          already complex. How exactly does this integrate
                          without causing downtime?
                        </div>
                      </div>
                      <div className="flex gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-200">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-none text-sm text-white max-w-[90%] shadow-lg shadow-indigo-500/20 leading-relaxed">
                          That's a valid concern. We use a headless API
                          architecture that sits alongside your current stack,
                          allowing you to migrate data incrementally. Zero
                          downtime guaranteed.
                        </div>
                      </div>
                    </div>

                    {/* Real-time Feedback Toast */}
                    <div className="mt-2 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-4 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          Perfect Objection Handling
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          You acknowledged the risk and provided a technical
                          solution immediately.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div
              className="absolute top-28 -right-4 bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-float-gentle"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                    Win Rate
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    +32% Increase
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLING MARQUEE */}
      <div className="py-10 border-y border-slate-100 bg-white overflow-hidden relative flex flex-col items-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8">
          Trusted by innovative teams worldwide
        </p>
        <div className="w-full relative flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 pr-16 items-center">
                {[
                  "Blackcrocks",
                  "Bridgefire",
                  "Veta",
                  "Alphabet",
                  "Macrosoft",
                  "Amasun",
                  "Pear",
                  "Notflix",
                  "Spookify",
                  "Slaack",
                ].map((company, index) => (
                  <div
                    key={`${i}-${index}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-600 transition-colors cursor-default whitespace-nowrap"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="font-black text-2xl tracking-tight">
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PLATFORM FEATURES */}
      <section
        id="platform"
        className="py-16 lg:py-24 px-6 lg:px-12 relative bg-slate-50/50"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Complete Sales Mastery
              </h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                Everything you need to clone your top performers.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: <Bot />,
                title: "AI Personas",
                desc: "Train against diverse customer personalities—from the Skeptic to the Champion. Our AI adapts its objection strategy in real-time.",
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                icon: <Mic />,
                title: "Voice Engine",
                desc: "Realistic, interruptible voice conversations with ultra-low latency processing.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: <BarChart3 />,
                title: "Deep Analytics",
                desc: "Score tone, pacing, empathy, and keyword compliance against top benchmarks.",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: <Globe />,
                title: "Multi-Language",
                desc: "Support for 30+ languages for global teams. Native accent simulation included.",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: <Zap />,
                title: "Instant Feedback",
                desc: "Actionable coaching tips delivered immediately after every call. No waiting.",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: <Shield />,
                title: "Enterprise Ready",
                desc: "SOC2 Type II compliant with SSO, RBAC, and Audit Logs for security.",
                color: "text-slate-700 bg-slate-200",
              },
            ].map((feature, i) => (
              <AnimateOnScroll key={i} variant="scale-up" delay={i * 50}>
                <div className="h-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group">
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    {React.cloneElement(
                      feature.icon as React.ReactElement<any>,
                      { className: "w-7 h-7" },
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION */}
      <section
        id="solutions"
        className="py-16 lg:py-24 px-6 lg:px-12 relative bg-white overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Tailored Solutions
              </h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                Workflows designed for every stage of your sales organization.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="space-y-16 lg:space-y-20">
            {/* Solution 1: Enterprise */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
              <AnimateOnScroll
                variant="slide-right"
                className="flex-1 space-y-6"
              >
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Enterprise Onboarding
                  </h3>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Scale your team without breaking process. Ensure every new
                    rep is pitch-perfect and compliant before they touch a real
                    lead.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    "Unified Pitch Certification",
                    "Compliance Heatmaps",
                    "Automated Ramp-up",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-slate-700 font-medium text-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>

              {/* Abstract UI: Certification Dashboard */}
              <AnimateOnScroll variant="slide-left" className="flex-1 w-full">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                  {/* Mock Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-slate-200 rounded-md"></div>
                      <div className="h-3 w-24 bg-slate-100 rounded-md"></div>
                    </div>
                    <div className="h-10 w-32 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20"></div>
                  </div>
                  {/* Mock Table */}
                  <div className="space-y-5">
                    {[1, 2, 3].map((row) => (
                      <div
                        key={row}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-2.5 w-32 bg-slate-200 rounded"></div>
                            <div className="h-2 w-20 bg-slate-100 rounded"></div>
                          </div>
                        </div>
                        <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Solution 2: SDRs */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-16">
              <AnimateOnScroll
                variant="slide-left"
                className="flex-1 space-y-6"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    High-Velocity SDRs
                  </h3>
                  <p className="text-lg text-slate-500 leading-relaxed">
                    Build muscle memory for cold calls. Give SDRs a safe space
                    to fail, learn, and master rejection handling.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    "Cold Call Simulator",
                    "Gatekeeper Navigation",
                    "Resilience Training",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-slate-700 font-medium text-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </AnimateOnScroll>

              {/* Abstract UI: Call Flow */}
              <AnimateOnScroll variant="slide-right" className="flex-1 w-full">
                <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden flex flex-col items-center justify-center gap-6 group hover:scale-[1.01] transition-transform duration-500">
                  <div className="bg-white px-8 py-4 rounded-2xl border border-blue-200 shadow-sm text-blue-900 font-bold text-base">
                    Opening Pitch
                  </div>
                  <div className="h-8 w-0.5 bg-slate-300"></div>
                  <div className="flex gap-8 w-full justify-center">
                    <div className="bg-white px-6 py-4 rounded-2xl border border-red-200 shadow-sm text-slate-400 text-sm w-36 text-center opacity-60">
                      Objection: Busy
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl border border-emerald-200 shadow-lg shadow-emerald-500/10 text-slate-800 text-sm w-36 text-center ring-4 ring-emerald-500/10">
                      Interest Signal
                    </div>
                  </div>
                  <div className="h-8 w-0.5 bg-slate-300 ml-24"></div>
                  <div className="bg-indigo-600 px-8 py-4 rounded-2xl shadow-lg text-white font-bold text-base">
                    Book Meeting
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section
        id="pricing"
        className="py-16 lg:py-24 px-6 lg:px-12 relative bg-slate-50"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Transparent Pricing
              </h2>
              <p className="text-slate-500 text-lg md:text-xl relative mb-8">
                Invest in skills that pay forever.
              </p>

              {/* Pricing Toggle */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <span
                  className={`text-sm font-bold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative inline-flex h-7 w-14 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none"
                >
                  <span
                    className={`${isAnnual ? "translate-x-8" : "translate-x-1"} inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${isAnnual ? "text-slate-900" : "text-slate-500"}`}
                  >
                    Annually
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2 py-1 rounded-full uppercase tracking-widest whitespace-nowrap outline outline-2 outline-emerald-200">
                    Save 20% on Yearly
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {pricingPlans.map((plan, i) => (
              <AnimateOnScroll
                key={i}
                variant="scale-up"
                delay={i * 100}
                className="h-full"
              >
                <div
                  className={`relative p-10 rounded-3xl transition-all duration-300 h-full flex flex-col group ${
                    plan.highlight
                      ? "bg-slate-900 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10 hover:shadow-indigo-500/50 hover:-translate-y-2"
                      : "bg-white text-slate-900 border border-slate-200 hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-2"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3
                    className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-800"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span
                      className={`text-base font-medium ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-base mb-8 leading-relaxed ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {plan.desc}
                  </p>

                  <div
                    className={`h-px w-full mb-8 ${plan.highlight ? "bg-slate-800" : "bg-slate-100"}`}
                  ></div>

                  <ul className="space-y-5 mb-10 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-indigo-600" : "bg-indigo-50 text-indigo-600"}`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 ${plan.highlight ? "text-white" : "text-indigo-600"}`}
                          />
                        </div>
                        <span
                          className={`text-base font-medium ${plan.highlight ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={plan.action}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 ${
                      plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RESOURCES SECTION */}
      <section
        id="resources"
        className="py-16 lg:py-24 px-6 lg:px-12 relative bg-white"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Knowledge Hub
              </h2>
              <p className="text-slate-500 text-lg md:text-xl">
                Latest strategies from top performers.
              </p>
            </AnimateOnScroll>
            <button className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all text-lg group">
              View All Resources{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <AnimateOnScroll
              delay={0}
              className="group cursor-pointer"
              onClick={handleCourseClick}
            >
              <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-[4/3] relative mb-6 shadow-inner flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                {/* Course Visual */}
                <div className="relative w-32 h-40 transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <div className="absolute top-0 left-4 w-full h-full bg-blue-200 rounded-xl transform rotate-6 opacity-60"></div>
                  <div className="absolute top-2 left-2 w-full h-full bg-blue-400 rounded-xl transform rotate-3 opacity-80"></div>
                  <div className="absolute top-4 left-0 w-full h-full bg-white rounded-xl shadow-lg border border-blue-100 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full w-2/3 bg-blue-500"></div>
                    </div>
                    <div className="mt-auto text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      8 Modules
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 px-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Courses
                </span>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  Complete Sales Guide 2026
                </h3>
                <div className="flex items-center gap-2 text-base text-slate-500 font-medium mt-2">
                  Start Course{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll
              delay={100}
              className="group cursor-pointer"
              onClick={handleWebinarClick}
            >
              <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-[4/3] relative mb-6 shadow-inner flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                {/* Webinar Visual */}
                <div className="relative w-48 h-32 bg-white rounded-xl shadow-xl border border-purple-100 flex items-center justify-center overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white"></div>
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full animate-pulse z-20 shadow-sm">
                    LIVE
                  </div>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl text-purple-600 z-10 relative ring-4 ring-purple-50">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  {/* Abstract waveforms */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end justify-center gap-1.5 pb-0 opacity-40">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-purple-400 rounded-t"
                        style={{ height: `${20 + Math.random() * 60}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3 px-2">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Webinar
                </span>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                  Objection Handling Masterclass
                </h3>
                <div className="flex items-center gap-2 text-base text-slate-500 font-medium mt-2">
                  Watch Replay{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll
              delay={200}
              className="group cursor-pointer"
              onClick={handleTemplatesClick}
            >
              <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-[4/3] relative mb-6 shadow-inner flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                {/* Template Visual */}
                <div className="relative w-36 h-44 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                  <div className="absolute top-0 right-0 w-full h-full bg-white rounded-xl shadow-md border border-slate-200 transform translate-x-2 -translate-y-2 rotate-3"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-white rounded-xl shadow-xl border border-slate-100 flex flex-col p-5 gap-4 relative z-10">
                    <div className="w-1/2 h-2.5 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                      <div className="w-3/4 h-1.5 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                      <div className="w-5/6 h-1.5 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 px-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Templates
                </span>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  10 High-Converting Scripts
                </h3>
                <div className="flex items-center gap-2 text-base text-slate-500 font-medium mt-2">
                  Download Now{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="py-16 lg:py-24 px-6 lg:px-12 bg-white relative overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Don't Just Take Our Word For It
              </h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                Hear how revenue leaders are scaling their teams with
                Salesforce.ai.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="w-full relative flex items-center overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)] lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] pb-8 pt-4">
            <div
              className="flex w-max animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDuration: "60s" }}
            >
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-6 pr-6 items-stretch">
                  {[
                    {
                      name: "Sarah Jenkins",
                      role: "VP of Sales, TechLogix",
                      content:
                        "Learning at Salesforce.ai Academy completely transformed our SDR onboarding. What used to take 3 months now takes 3 weeks, and our revenue is up by 45% this quarter!",
                      image: "https://i.pravatar.cc/150?u=sarah",
                    },
                    {
                      name: "Marcus Chen",
                      role: "Director of Revenue, Apex Solutions",
                      content:
                        "The objection handling analysis from the AI simulator is game-changing. We've seen a 60% increase in meeting booked rates since making Salesforce.ai Academy mandatory for our weekly training.",
                      image: "https://i.pravatar.cc/150?u=marcus",
                    },
                    {
                      name: "Elena Rodriguez",
                      role: "Sales Enablement Lead, CloudScale",
                      content:
                        "Finally, a training platform that reps actually want to use. Learning at Salesforce.ai Academy provided us with the exact blueprints to close enterprise deals.",
                      image: "https://i.pravatar.cc/150?u=elena",
                    },
                    {
                      name: "David Kim",
                      role: "Head of Growth, FinTech Innovators",
                      content:
                        "Being able to use the AI to adopt product personas is incredible. Salesforce.ai Academy taught our team how to navigate complex negotiations, directly doubling our MRR.",
                      image: "https://i.pravatar.cc/150?u=david",
                    },
                    {
                      name: "Jessica Taylor",
                      role: "Regional Sales Manager, GlobalTech",
                      content:
                        "I used to struggle with analyzing my team's performance, but the modules at Salesforce.ai Academy gave us clear direction. My team's conversion rates skyrocketed by 50% after applying the AI-driven tech.",
                      image: "https://i.pravatar.cc/150?u=jessica",
                    },
                    {
                      name: "Emily Watson",
                      role: "Sales Director, FutureSpace",
                      content:
                        "The mentorship and AI roleplays at Salesforce.ai Academy are unparalleled. I scaled my sales team from 5 to 20 reps seamlessly, and our closing rates have never been this consistent.",
                      image: "https://i.pravatar.cc/150?u=emily",
                    },
                    {
                      name: "Michael Chang",
                      role: "VP of Global Sales, Nebula Networks",
                      content:
                        "We increased our outbound sales volume by 300% thanks to the strategies taught at the Academy. The AI simulator helps us refine our pitches before we talk to a real prospect.",
                      image: "https://i.pravatar.cc/150?u=michael",
                    },
                    {
                      name: "Alex Johnson",
                      role: "Recent Graduate",
                      content:
                        "As a fresh college graduate, stepping into sales was daunting. Salesforce.ai Academy broke down complex concepts, and the AI roleplays gave me the hands-on practice I needed to land my first SDR job!",
                      image: "https://i.pravatar.cc/150?u=alex",
                    },
                    {
                      name: "Ryan Matthews",
                      role: "Sales Trainee",
                      content:
                        "I literally knew nothing about sales before joining. The Academy took me from zero to confidently closing deals. Just last week, I closed my biggest client yet! The AI feedback is a game changer for beginners.",
                      image: "https://i.pravatar.cc/150?u=ryan",
                    },
                  ].map((t, i) => (
                    <div
                      key={`${arrayIndex}-${i}`}
                      className="min-w-[320px] md:min-w-[400px] lg:min-w-[450px] bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col"
                    >
                      <div className="flex items-center gap-1 mb-6 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-lg lg:text-xl text-slate-700 font-medium leading-relaxed mb-8 flex-1">
                        "{t.content}"
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{t.name}</p>
                          <p className="text-sm text-slate-500 font-medium">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-16 lg:py-24 px-6 lg:px-12 relative bg-slate-50/50"
      >
        <div className="max-w-[1440px] mx-auto">
          <AnimateOnScroll
            variant="fade-up"
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 border border-slate-300 text-slate-700 font-bold text-sm mb-6 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> FAQ
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                Questions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium">
              Got questions? We've got answers. Here's what you need to know
              about our sales training programs.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll
            variant="fade-up"
            delay={200}
            className="max-w-3xl mx-auto space-y-4"
          >
            <FAQItem
              question="Who is this sales training program for?"
              answer="This program is designed for everyone, from beginners just entering the sales world, to sales managers and leaders who want to increase conversion rates with the latest negotiation and consultative selling strategies."
            />
            <FAQItem
              question="How do I get certified after completing the course?"
              answer="You must complete all video materials, successfully pass the Roleplay simulation using AI, and score at least 70 on the final exam. Certificates can be downloaded directly through the Student Center."
            />
            <FAQItem
              question="Can I access the materials offline?"
              answer="Currently, all video courses and AI roleplays are designed as interactive online experiences to maintain progress tracking and measurement functionality. Please ensure a stable internet connection for the best experience."
            />
            <FAQItem
              question="How long is the access to this program valid?"
              answer="Every purchased program includes lifetime access to the learning modules and all future material updates within those modules."
            />
            <FAQItem
              question="Is there support if I get stuck during the learning process?"
              answer="Absolutely! We provide a Live Roleplay Session feature to discuss with mentors, as well as an AI Roadmap platform that automatically recommends learning materials based on your skill gaps."
            />
          </AnimateOnScroll>
        </div>
      </section>

      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-scale-up border border-slate-100 flex flex-col items-center text-center max-h-[80vh] overflow-y-auto">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shrink-0">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 shrink-0">
              Keamanan Data & Privasi
            </h3>
            <div className="text-slate-600 mb-8 leading-relaxed text-left text-sm space-y-4">
              <p>
                Di SalesForce.ai, kami sangat menghargai privasi dan keamanan
                data Anda. Kami memahami bahwa sesi roleplay dan latihan
                penjualan sering melibatkan informasi simulasi yang berharga.
              </p>
              <h4 className="font-bold text-slate-800 text-base border-b pb-1">
                Penggunaan Data
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Semua iterasi dan jawaban yang Anda berikan selama simulasi
                  akan digunakan{" "}
                  <strong>
                    hanya untuk memberikan feedback dan personalisasi
                  </strong>{" "}
                  pada sesi Anda.
                </li>
                <li>
                  Kami tidak akan mengambil, membagikan, atau menjual data
                  percakapan Anda kepada pihak ketiga manapun.
                </li>
              </ul>
              <h4 className="font-bold text-slate-800 text-base border-b pb-1">
                Keamanan Platform
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Data Anda disimpan secara personal dan dienkripsi menggunakan
                  standar keamanan perusahaan yang sangat ketat.
                </li>
                <li>
                  Kami secara rutin mengaudit infrastruktur kami untuk mencegah
                  akses yang tidak sah dan meningkatkan perlindungan.
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-95 shrink-0"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 lg:py-16 px-6 lg:px-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              SalesForce
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">
                .ai
              </span>
            </span>
          </div>
          <div className="flex items-center gap-8 text-slate-500 font-medium text-sm">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPrivacyModal(true);
              }}
              className="hover:text-indigo-600 transition-colors"
            >
              Privacy
            </button>
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
