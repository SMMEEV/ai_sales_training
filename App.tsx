import React, { useState, useEffect } from "react";
import { ProfileMenu } from "./components/ProfileMenu";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { Dashboard } from "./components/Dashboard";
// ... the rest stays the same until App component

// Replace App Component imports and setup
import { RoleplaySession } from "./components/RoleplaySession";
import { LiveRoleplaySession } from "./components/LiveRoleplaySession";
import { AnalysisResult } from "./components/AnalysisResult";
import { LandingPage } from "./components/LandingPage";
import { CoursesPage } from "./components/CoursesPage";
import { WebinarPage } from "./components/WebinarPage";
import { DemoPage } from "./components/DemoPage";
import { TemplatesPage } from "./components/TemplatesPage";
import { AboutUsPage } from "./components/AboutUsPage";
import { SolutionPage } from "./components/SolutionPage";
import { analyzeSession } from "./services/geminiService";
import { Toaster, toast } from "react-hot-toast";
import {
  AppView,
  Message,
  ScenarioType,
  CustomerArchetype,
  SessionAnalysis,
  HistoricalSession,
  SessionMode,
} from "./types";
import {
  Target,
  MessageSquare,
  PieChart,
  Phone,
  Home,
  ArrowLeft,
} from "lucide-react";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(
    ScenarioType.COLD_CALL,
  );
  const [selectedArchetype, setSelectedArchetype] = useState<CustomerArchetype>(
    CustomerArchetype.SKEPTICAL,
  );
  const [sessionMode, setSessionMode] = useState<SessionMode>(SessionMode.TEXT);
  const [sessionAnalysis, setSessionAnalysis] =
    useState<SessionAnalysis | null>(null);
  const [history, setHistory] = useState<HistoricalSession[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const loadHistory = async () => {
      try {
        const historyRef = collection(db, "users", user.uid, "roleplays");
        const q = query(historyRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as HistoricalSession[];
        setHistory(data);
      } catch (e) {
        console.error("Failed to load history from Firebase", e);
      }
    };
    loadHistory();
  }, [user]);

  // Function to transition to training setup
  const handleStartTraining = () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk masuk ke mode training.");
      signIn();
      return;
    }
    setCurrentView(AppView.TRAINING_SETUP);
  };

  // Helper to check if current view is a marketing page
  const isMarketingView = [
    AppView.LANDING,
    AppView.COURSES,
    AppView.DEMO,
    AppView.WEBINAR,
    AppView.TEMPLATES,
    AppView.ABOUT_US,
    AppView.SOLUTION_SDR,
    AppView.SOLUTION_AE,
    AppView.SOLUTION_MANAGER,
    AppView.SOLUTION_ENABLEMENT,
  ].includes(currentView);

  // Function to start the actual chat session
  const handleLaunchSession = (
    scenario: ScenarioType,
    archetype: CustomerArchetype,
    mode: SessionMode,
  ) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk masuk ke mode training.");
      signIn();
      return;
    }
    setSelectedScenario(scenario);
    setSelectedArchetype(archetype);
    setSessionMode(mode);
    setCurrentView(AppView.TRAINING_SESSION);
  };

  // Function called when user ends the roleplay
  const handleEndSession = async (messages: Message[]) => {
    if (messages.length < 2) {
      toast.error("Session too short for analysis. Please interact more.");
      setCurrentView(AppView.MANAGER_DASHBOARD);
      return;
    }

    setIsAnalyzing(true);
    // Move to analysis loading view or overlay
    try {
      const analysis = await analyzeSession(
        messages,
        selectedScenario,
        selectedArchetype,
      );
      setSessionAnalysis(analysis);

      // Update history mock
      const newHistoryItem: HistoricalSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        score: analysis.overallScore,
        scenario: selectedScenario,
        createdAt: Date.now(),
        analysisPayload: JSON.stringify(analysis),
      };
      setHistory((prev) => [...prev, newHistoryItem]);

      if (user) {
        try {
          const docRef = doc(
            db,
            "users",
            user.uid,
            "roleplays",
            newHistoryItem.id,
          );
          await setDoc(docRef, newHistoryItem);
        } catch (e) {
          console.error("Failed to save to Firebase", e);
        }
      }

      setCurrentView(AppView.ANALYSIS);
      toast.success("Analysis generated successfully!");
    } catch (error) {
      console.error("Analysis failed", error);
      toast.error(
        "Failed to generate analysis. Please check your API Key or try again.",
      );
      setCurrentView(AppView.MANAGER_DASHBOARD);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Mesh Gradient (Only for App views, not marketing which has its own) */}
      {!isMarketingView && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-purple-300/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
        </div>
      )}

      {/* App Navigation Bar (Only for Dashboard/Training views) */}
      {!isMarketingView && (
        <nav className="sticky top-4 mx-4 md:mx-8 z-50 rounded-2xl glass-panel shadow-sm border border-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
              >
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">
                  Sales
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                    Force
                  </span>{" "}
                  AI
                </span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentView === AppView.MANAGER_DASHBOARD
                      ? "bg-indigo-50/80 text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <PieChart className="w-4 h-4" />{" "}
                  <span className="hidden md:inline">Dashboard</span>
                </button>
                <button
                  onClick={handleStartTraining}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    [AppView.TRAINING_SETUP, AppView.TRAINING_SESSION].includes(
                      currentView,
                    )
                      ? "bg-indigo-50/80 text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />{" "}
                  <span className="hidden md:inline">Training</span>
                </button>
                <button
                  onClick={() => setCurrentView(AppView.LANDING)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-slate-200 ml-2"
                  title="Home"
                >
                  <Home className="w-5 h-5" />
                </button>
                <div className="ml-2 pl-2 border-l border-slate-200 flex items-center">
                  <ProfileMenu />
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main
        className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-0 ${isMarketingView ? "py-0 px-0 max-w-none" : ""}`}
      >
        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Analyzing Performance...
            </h3>
            <p className="text-slate-500 mt-2 font-medium">
              Comparing your responses against AI benchmarks.
            </p>
          </div>
        )}

        {/* View Routing */}
        {currentView === AppView.LANDING && (
          <LandingPage
            onStart={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === AppView.COURSES && (
          <CoursesPage onNavigate={setCurrentView} />
        )}

        {currentView === AppView.WEBINAR && (
          <WebinarPage
            onStart={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === AppView.DEMO && (
          <DemoPage
            onStart={handleStartTraining}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === AppView.TEMPLATES && (
          <TemplatesPage
            onStart={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === AppView.ABOUT_US && (
          <AboutUsPage
            onStart={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            onNavigate={setCurrentView}
          />
        )}

        {[
          AppView.SOLUTION_SDR,
          AppView.SOLUTION_AE,
          AppView.SOLUTION_MANAGER,
          AppView.SOLUTION_ENABLEMENT,
        ].includes(currentView) && (
          <SolutionPage
            view={currentView}
            onNavigate={setCurrentView}
            onStart={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
          />
        )}

        {currentView === AppView.MANAGER_DASHBOARD && (
          <Dashboard
            history={history}
            onStartTraining={handleStartTraining}
            onBack={() => setCurrentView(AppView.LANDING)}
          />
        )}

        {currentView === AppView.TRAINING_SETUP && (
          <div className="max-w-5xl mx-auto animate-fade-in pt-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Select Training Scenario
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
                Choose a specialized roleplay module to sharpen specific sales
                skills. Opt for Text Chat for scripted practice or Live Call for
                high-pressure simulation.
              </p>

              <div className="inline-flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                <span className="pl-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Customer Persona
                </span>
                <div className="flex gap-2">
                  {Object.values(CustomerArchetype).map((arch) => (
                    <button
                      key={arch}
                      onClick={() => setSelectedArchetype(arch)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedArchetype === arch
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {arch}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: ScenarioType.COLD_CALL,
                  title: "Cold Call Simulation",
                  desc: "Practice opening lines and handling immediate brush-offs.",
                  from: "from-blue-500",
                  to: "to-cyan-400",
                  icon: "❄️",
                },
                {
                  id: ScenarioType.DISCOVERY,
                  title: "Discovery Call",
                  desc: "Learn to ask the right questions to uncover pain points.",
                  from: "from-violet-500",
                  to: "to-purple-400",
                  icon: "🔍",
                },
                {
                  id: ScenarioType.OBJECTION_HANDLING,
                  title: "Objection Handling",
                  desc: "Overcome common objections like price, timing, and competition.",
                  from: "from-orange-500",
                  to: "to-amber-400",
                  icon: "🛡️",
                },
                {
                  id: ScenarioType.NEGOTIATION,
                  title: "Closing & Negotiation",
                  desc: "Navigate final terms and close the deal confidently.",
                  from: "from-emerald-500",
                  to: "to-teal-400",
                  icon: "🤝",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden glass-card rounded-[2rem] p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 border-white/60 flex flex-col h-full"
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${item.from} ${item.to} opacity-10 group-hover:scale-110 transition-transform duration-700 blur-2xl pointer-events-none`}
                  ></div>

                  <div className="mb-6 flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${item.from} ${item.to} text-white group-hover:shadow-${item.from}/30`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                    {item.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() =>
                        handleLaunchSession(
                          item.id,
                          selectedArchetype,
                          SessionMode.TEXT,
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4" /> Text Chat
                    </button>
                    <button
                      onClick={() =>
                        handleLaunchSession(
                          item.id,
                          selectedArchetype,
                          SessionMode.VOICE,
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
                    >
                      <Phone className="w-4 h-4" /> Live Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === AppView.TRAINING_SESSION &&
          (sessionMode === SessionMode.TEXT ? (
            <RoleplaySession
              scenario={selectedScenario}
              archetype={selectedArchetype}
              onEndSession={handleEndSession}
              onAbort={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            />
          ) : (
            <LiveRoleplaySession
              scenario={selectedScenario}
              archetype={selectedArchetype}
              onEndSession={handleEndSession}
              onAbort={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
            />
          ))}

        {currentView === AppView.ANALYSIS && sessionAnalysis && (
          <AnalysisResult
            analysis={sessionAnalysis}
            onBack={() => setCurrentView(AppView.MANAGER_DASHBOARD)}
          />
        )}
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
