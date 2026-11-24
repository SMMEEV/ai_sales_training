import {
  Message,
  SessionAnalysis,
  ScenarioType,
  CustomerArchetype,
} from "../types";

export const sendChatMessage = async (
  scenario: ScenarioType,
  archetype: CustomerArchetype,
  history: Message[],
  message: string,
): Promise<string> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario, archetype, history, message }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Failed to connect to AI service.");
  }

  return data.text || "I'm thinking...";
};

export const analyzeSession = async (
  messages: Message[],
  scenario: ScenarioType,
  archetype: CustomerArchetype,
): Promise<SessionAnalysis> => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, scenario, archetype }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "No analysis generated");
  }

  return data as SessionAnalysis;
};
