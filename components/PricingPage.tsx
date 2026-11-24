import React, { useState } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { AppView } from "../types";
import {
  Check,
  X,
  CreditCard,
  Lock,
  Gift,
  Loader2,
  PartyPopper,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface PricingPageProps {
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onStart,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "processing" | "success"
  >("form");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvc: "",
  });

  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for individual reps wanting to sharpen their skills.",
      features: [
        "3 AI Roleplay Sessions / Month",
        "Basic Performance Analytics",
        "1 Standard Persona",
        "Community Support",
      ],
      cta: "Start for Free",
      highlight: false,
      action: onStart,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/ month",
      desc: "For serious closers who want unlimited practice.",
      features: [
        "Unlimited AI Roleplay Sessions",
        "Advanced Voice & Tone Analysis",
        "All 12 Industry Personas",
        "Custom Objection Builder",
        "Priority Support",
      ],
      cta: "Start Trial",
      highlight: true,
      action: () => setIsCheckoutOpen(true), // Opens Checkout Page
    },
    {
      name: "Team",
      price: "$99",
      period: "/ user / month",
      desc: "For sales managers building high-performance teams.",
      features: [
        "Everything in Professional",
        "Manager Dashboard",
        "Team Leaderboards",
        "SSO & Enterprise Security",
        "Dedicated Success Manager",
        "API Access",
      ],
      cta: "Contact Sales",
      highlight: false,
      action: onStart,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    if (couponCode.toLowerCase() === "salesforceai26") {
      setIsCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setIsCouponApplied(false);

      // Clear error after 3 seconds
      setTimeout(() => setCouponError(""), 3000);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep("processing");

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setPaymentStep("success");
  };

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
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <MarketingNavbar
        currentView={AppView.PRICING}
        onNavigate={onNavigate}
        onStart={onStart}
      />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <h1
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in"
            style={{ animationFillMode: "both" }}
          >
            Simple, Transparent <span className="text-indigo-600">Pricing</span>
          </h1>
          <p
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200"
            style={{ animationFillMode: "both" }}
          >
            Invest in your skills. The ROI of closing just one more deal pays
            for the platform for a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-[2.5rem] transition-all duration-300 flex flex-col h-full ${
                plan.highlight
                  ? "bg-slate-900 text-white shadow-2xl scale-105 border border-slate-800 z-10"
                  : "bg-white text-slate-900 border border-slate-200 hover:shadow-xl hover:border-indigo-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-slate-800"}`}
              >
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span
                    className={`text-sm ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              <p
                className={`mb-8 ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}
              >
                {plan.desc}
              </p>

              <div
                className={`h-px w-full mb-8 ${plan.highlight ? "bg-slate-800" : "bg-slate-100"}`}
              ></div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-indigo-600" : "bg-indigo-100 text-indigo-600"}`}
                    >
                      <Check
                        className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-indigo-600"}`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${plan.highlight ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.action}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
