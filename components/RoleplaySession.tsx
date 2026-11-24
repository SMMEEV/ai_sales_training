import React, { useState, useEffect, useRef } from "react";
import { Message, ScenarioType, CustomerArchetype } from "../types";
import { sendChatMessage } from "../services/geminiService";
import { Send, User, Bot, StopCircle, Mic, Sparkles } from "lucide-react";

interface RoleplaySessionProps {
  scenario: ScenarioType;
  archetype: CustomerArchetype;
  onEndSession: (messages: Message[]) => void;
  onAbort: () => void;
}

export const RoleplaySession: React.FC<RoleplaySessionProps> = ({
  scenario,
  archetype,
  onEndSession,
  onAbort,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsReady(true);
    setMessages([
      {
        role: "model",
        content: `[System: Simulation Started for ${scenario} - ${archetype}]\nHello. I was told you wanted to speak with me. What is this about?`,
        timestamp: Date.now(),
      },
    ]);
  }, [scenario, archetype]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isReady || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    const historySnapshot = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Reset height manually after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsLoading(true);

    try {
      const text = await sendChatMessage(
        scenario,
        archetype,
        historySnapshot,
        userMsg.content,
      );

      const botMsg: Message = {
        role: "model",
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Simulation Connection Error.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60 relative animate-fade-in bg-white/40">
      {/* Decorative Blur Header */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-10"></div>

      {/* Header */}
      <div className="p-6 md:p-8 flex justify-between items-center shrink-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-800 tracking-tight">
              Sales Simulation
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${isReady ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
              ></span>
              <p className="text-slate-500 text-sm font-medium">{scenario}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onEndSession(messages)}
          className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm border border-slate-200 flex items-center gap-2 group hover:shadow-md"
        >
          <StopCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">End Session</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth z-0">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`flex max-w-[85%] md:max-w-[75%] gap-5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white ${isUser ? "bg-indigo-50 text-indigo-600" : "bg-white text-slate-600"}`}
                >
                  {isUser ? (
                    <User className="w-6 h-6" />
                  ) : (
                    <Bot className="w-6 h-6" />
                  )}
                </div>
                <div
                  className={`p-6 rounded-3xl shadow-sm text-[16px] leading-relaxed relative whitespace-pre-wrap ${
                    isUser
                      ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none shadow-indigo-500/20"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-200/50"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex max-w-[80%] gap-5">
              <div className="w-11 h-11 rounded-2xl bg-white text-slate-400 flex items-center justify-center shrink-0 shadow-sm border border-white">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white/80 p-6 rounded-3xl rounded-tl-none border border-slate-100">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-6" />
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border-t border-white/50 shrink-0 z-20">
        <div className="relative flex items-end gap-4 max-w-5xl mx-auto">
          <button
            onClick={onAbort}
            className="p-4 mb-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            title="Abort"
          >
            <StopCircle className="w-6 h-6" />
          </button>

          <div className="relative flex-1 group bg-white rounded-3xl border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isReady
                  ? "Type your response here... (Shift+Enter for new line)"
                  : "Connecting..."
              }
              className="w-full pl-6 pr-14 py-5 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none min-h-[64px] max-h-[200px] rounded-3xl scrollbar-hide text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isReady}
              autoFocus
              rows={1}
              style={{ lineHeight: "1.5" }}
            />
            <button
              className="absolute right-4 bottom-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              disabled={!isReady}
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !isReady}
            className="p-5 mb-1 bg-gradient-to-r from-indigo-600 to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center group"
          >
            <Send className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
