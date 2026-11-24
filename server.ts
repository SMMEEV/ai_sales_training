import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer } from "ws";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Type,
  Schema,
} from "@google/genai";

const TEXT_MODEL = "gemini-4-hydrogen";
const LIVE_MODEL = "gemini-3.8-live";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY1;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY1 is not configured on the server.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getSystemInstruction(scenario: string, archetype: string): string {
  let archetypeInstructions = "";
  switch (archetype) {
    case "Skeptical":
      archetypeInstructions =
        "You are highly skeptical. Question the value of everything, ask for proof, data, and show reluctance to believe claims easily.";
      break;
    case "Enthusiastic":
      archetypeInstructions =
        "You are very enthusiastic and eager to solve your problem. You are positive but quickly ask about implementation, timeline, and want to move forward if it fits.";
      break;
    case "Budget-Conscious":
      archetypeInstructions =
        "Your primary concern is budget. You are interested but constantly push back on price, ask for discounts, and worry about hidden fees or ROI.";
      break;
  }

  return `You are simulating a realistic sales scenario. 
  Scenario: ${scenario}.
  
  Your role: You are a potential customer/prospect. 
  Archetype: ${archetype}. ${archetypeInstructions}
  
  Do not make it too easy, but do not be impossible. 
  Keep your responses relatively concise (1-3 sentences) to simulate real conversation flow.
  If the user is rude or incompetent, react accordingly.
  If the user is excellent, show signs of being won over.
  
  LANGUAGE INSTRUCTIONS:
  - The user may communicate in English or Indonesian (Bahasa Indonesia).
  - You must reply in the SAME language the user uses.
  - If the user switches languages, switch with them.
  - Adapt to cultural nuances suitable for the language.
  
  IMPORTANT: Do not break character. Do not give advice during the chat. Just play the role.`;
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for text roleplay chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { scenario, archetype, history = [], message } = req.body;
      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const ai = getGeminiClient();
      const formattedHistory = Array.isArray(history)
        ? history
            .filter(
              (m: any) =>
                m &&
                (m.role === "user" || m.role === "model") &&
                typeof m.content === "string" &&
                m.content.trim().length > 0,
            )
            .map((m: any) => ({
              role: m.role,
              parts: [{ text: m.content }],
            }))
        : [];

      if (
        formattedHistory.length > 0 &&
        formattedHistory[0].role === "model"
      ) {
        formattedHistory.unshift({
          role: "user",
          parts: [{ text: "Start the sales roleplay simulation." }],
        });
      }

      const chat = ai.chats.create({
        model: TEXT_MODEL,
        history: formattedHistory,
        config: {
          systemInstruction: getSystemInstruction(
            scenario || "Cold Call",
            archetype || "Skeptical",
          ),
        },
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text || "I'm thinking..." });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: error?.message || "Failed to generate chat response",
      });
    }
  });

  // API Route for analyzing completed roleplay session
  app.post("/api/analyze", async (req, res) => {
    try {
      const { messages = [], scenario, archetype } = req.body;
      const transcript = Array.isArray(messages)
        ? messages
            .map(
              (m: any) =>
                `${String(m.role || "user").toUpperCase()}: ${m.content || ""}`,
            )
            .join("\n")
        : "";

      const analysisSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          overallScore: {
            type: Type.NUMBER,
            description: "Overall performance score out of 100",
          },
          summary: {
            type: Type.STRING,
            description: "Executive summary of the session",
          },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description:
                    "Skill category (e.g., Empathy, Closing, Clarity, Product Knowledge)",
                },
                userScore: {
                  type: Type.NUMBER,
                  description: "User's score 0-100",
                },
                aiBenchmark: {
                  type: Type.NUMBER,
                  description:
                    "The ideal AI benchmark score 0-100 for this metric",
                },
                feedback: {
                  type: Type.STRING,
                  description:
                    "Specific feedback for this category based on how they handled the archetype objections",
                },
              },
              required: ["category", "userScore", "aiBenchmark", "feedback"],
            },
          },
          keyStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          areasForImprovement: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "overallScore",
          "summary",
          "metrics",
          "keyStrengths",
          "areasForImprovement",
        ],
      };

      const prompt = `
        Analyze the following sales training transcript for the scenario: "${scenario}".
        The customer archetype was "${archetype}". Evaluate how well the user handled this specific archetype.
        Provide feedback particularly on their communication style, product knowledge, and ability to overcome the objections typical of a ${archetype} prospect.
        
        Transcript:
        ${transcript}
        
        Compare the user's performance against "AI Analytical Skills" benchmarks (representing the ideal, data-driven perfect sales approach).
        Provide a JSON response with scoring, specific metrics comparing User vs AI Benchmark, strengths, and weaknesses.

        Note: The transcript may be in English or Indonesian. Please analyze the content effectively regardless of the language. 
        Ensure the output report (summary, feedback text, etc.) is in English to match the application interface.
      `;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No analysis generated");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({
        error: error?.message || "Failed to analyze session",
      });
    }
  });

  // API Route for evaluating exam answers
  app.post("/api/evaluate", async (req, res) => {
    try {
      const { answers, questions } = req.body;

      const ai = getGeminiClient();
      const prompt = `You are an expert sales trainer evaluating a student's short answers based on the following course material about Consultative Selling:

Levels Covered:
1 - Psychology of Influence (Scarcity, Social Proof)
2 - The Art of Connection (Empathy, Listening)
3 - Strategic Prospecting (BANT framework: Budget, Authority, Need, Timeline)
4 - Masterful Discovery (Diagnosing root problems)
5 - Tactical Persuasion (Tactical Empathy, Mirroring, Labeling)
6 - Consultative Selling (ROI, Data, Advisor role)
7 - Objection Resilience (Feel, Felt, Found)
8 - Closing & Relationship Mastery (Hukum 250, Referrals)

Here are the questions and the student's answers:
${JSON.stringify({ questions, answers }, null, 2)}

For each question, evaluate if the student's answer is correct or conceptually aligned with the material. 
Return a JSON array of objects with the following schema:
[
  {
    "questionId": "string",
    "isCorrect": boolean,
    "feedback": "string (1-2 sentences explaining why, and what the ideal answer should include)"
  }
]
IMPORTANT: RETURN ONLY THE RAW JSON ARRAY. NO MARKDOWN, NO BACKTICKS.`;

      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
      });

      let responseText = response.text || "[]";
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const evaluation = JSON.parse(responseText);

      res.json(evaluation);
    } catch (error: any) {
      console.error("Evaluation error:", error);
      res.status(500).json({ error: "Failed to evaluate answers" });
    }
  });

  // WebSocket bridge for Gemini Live API
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url && req.url.startsWith("/api/live")) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", async (clientWs, req) => {
    let liveSession: any = null;
    try {
      const url = new URL(req.url || "/api/live", "http://localhost");
      const scenario = url.searchParams.get("scenario") || "Cold Call";
      const archetype = url.searchParams.get("archetype") || "Skeptical";
      const cleanInstruction = getSystemInstruction(scenario, archetype)
        .replace(/[\r\n]+/g, " ")
        .trim();

      const ai = getGeminiClient();
      liveSession = await ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: cleanInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ type: "open" }));
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== clientWs.OPEN) return;

            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(
                  JSON.stringify({ type: "audio", data: part.inlineData.data }),
                );
              }
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: "interrupted" }));
            }

            if (message.serverContent?.inputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: "inputTranscription",
                  text: message.serverContent.inputTranscription.text,
                }),
              );
            }

            if (message.serverContent?.outputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: "outputTranscription",
                  text: message.serverContent.outputTranscription.text,
                }),
              );
            }

            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: "turnComplete" }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ type: "close" }));
              clientWs.close();
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error Detail:", err);
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: "error",
                  message: err?.message || "Live API connection error",
                }),
              );
            }
          },
        },
      });

      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ type: "open" }));
      }
    } catch (error: any) {
      console.error("Failed to connect Gemini Live:", error);
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "error",
            message: error?.message || "Failed to connect to Gemini Live",
          }),
        );
        clientWs.close();
      }
      return;
    }

    clientWs.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg?.type === "audio" && msg?.data && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: msg.mimeType || "audio/pcm;rate=16000",
            },
          });
        }
      } catch (e) {
        console.error("Invalid client WS message:", e);
      }
    });

    clientWs.on("close", () => {
      if (liveSession && typeof liveSession.close === "function") {
        try {
          liveSession.close();
        } catch {}
      }
    });
  });

  // Vite middleware for development
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.argv[1]?.endsWith("server.cjs");

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method === "GET" || req.method === "HEAD") {
        res.sendFile(path.join(distPath, "index.html"));
      } else {
        next();
      }
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
