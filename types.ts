export interface Message {
  role: "user" | "model";
  content: string;
  timestamp: number;
}

export interface Metric {
  category: string;
  userScore: number;
  aiBenchmark: number;
  feedback: string;
}

export interface SessionAnalysis {
  overallScore: number;
  summary: string;
  metrics: Metric[];
  keyStrengths: string[];
  areasForImprovement: string[];
}

export interface HistoricalSession {
  id: string;
  date: string;
  score: number;
  scenario: string;
  createdAt?: number;
  analysisPayload?: string;
}

export enum AppView {
  LANDING = "LANDING",
  PLATFORM = "PLATFORM",
  SOLUTIONS = "SOLUTIONS",
  PRICING = "PRICING",
  RESOURCES = "RESOURCES",
  COURSES = "COURSES",
  WEBINAR = "WEBINAR",
  TEMPLATES = "TEMPLATES",
  ABOUT_US = "ABOUT_US",
  TRAINING_SETUP = "TRAINING_SETUP",
  TRAINING_SESSION = "TRAINING_SESSION",
  ANALYSIS = "ANALYSIS",
  MANAGER_DASHBOARD = "MANAGER_DASHBOARD",
  DEMO = "DEMO",
  SOLUTION_SDR = "SOLUTION_SDR",
  SOLUTION_AE = "SOLUTION_AE",
  SOLUTION_MANAGER = "SOLUTION_MANAGER",
  SOLUTION_ENABLEMENT = "SOLUTION_ENABLEMENT",
}

export enum ScenarioType {
  COLD_CALL = "Cold Call",
  DISCOVERY = "Discovery Call",
  NEGOTIATION = "Negotiation & Closing",
  OBJECTION_HANDLING = "Objection Handling",
}

export enum CustomerArchetype {
  SKEPTICAL = "Skeptical",
  ENTHUSIASTIC = "Enthusiastic",
  BUDGET_CONSCIOUS = "Budget-Conscious",
}

export enum SessionMode {
  TEXT = "TEXT",
  VOICE = "VOICE",
}
