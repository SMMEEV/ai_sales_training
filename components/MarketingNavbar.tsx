import React, { useState, useEffect } from "react";
import { Zap, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { AppView } from "../types";
import { ProfileMenu } from "./ProfileMenu";

interface MarketingNavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStart: () => void;
}

export const MarketingNavbar: React.FC<MarketingNavbarProps> = ({
  currentView,
  onNavigate,
  onStart,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      label: "Platform",
      href: "#platform",
      dropdown: [
        {
          label: "AI Roleplay Engine",
          href: "#",
          view: AppView.TRAINING_SETUP,
          desc: "Live simulations with adaptive AI buyers.",
        },
        {
          label: "Voice & Tone Analytics",
          href: "#platform",
          desc: "Intelligent scoring on pacing and empathy.",
        },
        {
          label: "Objection Builder",
          href: "#platform",
          desc: "Train teams to overcome specific hurdles.",
        },
        {
          label: "Instant Coaching",
          href: "#platform",
          desc: "Real-time actionable feedback after calls.",
        },
      ],
    },
    {
      label: "Solutions",
      href: "#solutions",
      dropdown: [
        {
          label: "For SDRs & BDRs",
          href: "#",
          view: AppView.SOLUTION_SDR,
          desc: "Perfect cold calls and qualify faster.",
        },
        {
          label: "For Account Executives",
          href: "#",
          view: AppView.SOLUTION_AE,
          desc: "Master closing and deal negotiations.",
        },
        {
          label: "For Sales Managers",
          href: "#",
          view: AppView.SOLUTION_MANAGER,
          desc: "Scale coaching across the entire team.",
        },
        {
          label: "For Enablement",
          href: "#",
          view: AppView.SOLUTION_ENABLEMENT,
          desc: "Onboard new reps in days, not months.",
        },
      ],
    },
    { label: "Pricing", href: "#pricing" },
    {
      label: "Resources",
      href: "#resources",
      dropdown: [
        {
          label: "Academy",
          href: "#",
          view: AppView.COURSES,
          desc: "Learn from the experts in sales training.",
        },
        {
          label: "Webinar",
          href: "#",
          view: AppView.WEBINAR,
          desc: "Watch our latest live sessions and replays.",
        },
        {
          label: "Templates",
          href: "#",
          view: AppView.TEMPLATES,
          desc: "Download battlecards and scripts.",
        },
      ],
    },
    { label: "FAQ", href: "#faq" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    view?: AppView,
  ) => {
    e.preventDefault();
    if (view) {
      onNavigate(view);
      setIsMenuOpen(false);
      return;
    }
    if (href.startsWith("#")) {
      const scrollTarget = () => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      };

      if (currentView !== AppView.LANDING) {
        onNavigate(AppView.LANDING);
        // Wait for the DOM to update to the Landing page view
        setTimeout(scrollTarget, 150);
      } else {
        scrollTarget();
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled || isMenuOpen
          ? "bg-white/90 backdrop-blur-md backdrop-saturate-150 border-slate-200/60 py-4 shadow-sm"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            if (currentView !== AppView.LANDING) {
              onNavigate(AppView.LANDING);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            SalesForce
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">
              .ai
            </span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-[15px] text-slate-600">
          {navItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.label} className="relative group py-1">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group-hover:text-indigo-600"
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-300" />
                  </a>
                  <div className="absolute top-full left-0 mt-2 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 p-3 flex flex-col gap-1.5 before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={(e) =>
                          handleNavClick(e, sub.href, (sub as any).view)
                        }
                        className="px-4 py-3 group/sub flex flex-col gap-1 rounded-xl transition-colors hover:bg-slate-50"
                      >
                        <span className="text-sm font-bold text-slate-900 group-hover/sub:text-indigo-600 transition-colors">
                          {sub.label}
                        </span>
                        {sub.desc && (
                          <span className="text-xs font-normal text-slate-500 line-clamp-2">
                            {sub.desc}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-indigo-600 transition-colors relative py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            );
          })}
          <button
            onClick={() => onNavigate(AppView.ABOUT_US)}
            className="hover:text-indigo-600 transition-colors relative py-1 group"
          >
            About Us
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ProfileMenu />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-900 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full max-h-[80vh] overflow-y-auto bg-white border-b border-slate-200 p-6 flex flex-col gap-4 shadow-2xl md:hidden animate-fade-in">
          {navItems.map((item) => (
            <div key={item.label} className="flex flex-col">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-lg font-medium text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
              >
                {item.label}
              </a>
              {item.dropdown && (
                <div className="flex flex-col pl-4 mt-2 gap-2">
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      onClick={(e) =>
                        handleNavClick(e, sub.href, (sub as any).view)
                      }
                      className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[15px] font-bold text-slate-700">
                        {sub.label}
                      </span>
                      {sub.desc && (
                        <span className="text-[13px] text-slate-500">
                          {sub.desc}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              onNavigate(AppView.ABOUT_US);
              setIsMenuOpen(false);
            }}
            className="text-lg font-medium text-left px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
          >
            About Us
          </button>
          <div className="h-px bg-slate-100 my-2"></div>
          <div className="flex flex-col gap-3">
            <div className="w-full flex justify-center py-2">
              <ProfileMenu />
            </div>
            <button
              onClick={onStart}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
