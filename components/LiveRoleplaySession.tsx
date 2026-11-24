import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Message, ScenarioType, CustomerArchetype } from "../types";
import { Phone, Mic, MicOff, Volume2 } from "lucide-react";

interface LiveRoleplaySessionProps {
  scenario: ScenarioType;
  archetype: CustomerArchetype;
  onEndSession: (messages: Message[]) => void;
  onAbort: () => void;
}

export const LiveRoleplaySession: React.FC<LiveRoleplaySessionProps> = ({
  scenario,
  archetype,
  onEndSession,
  onAbort,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<string>("Connecting...");
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Session Refs
  const wsRef = useRef<WebSocket | null>(null);
  const isMutedRef = useRef<boolean>(false);
  const messagesRef = useRef<Message[]>([]);
  const currentInputTransRef = useRef<string>("");
  const currentOutputTransRef = useRef<string>("");
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Initialize Session
  useEffect(() => {
    isMountedRef.current = true;

    const initSession = async () => {
      try {
        // Setup Audio Contexts
        inputAudioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )({ sampleRate: 16000 });
        outputAudioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )({ sampleRate: 24000 });

        const outputNode = outputAudioContextRef.current.createGain();
        outputNode.connect(outputAudioContextRef.current.destination);

        // Get Microphone Access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const params = new URLSearchParams({ scenario, archetype });
        const ws = new WebSocket(
          `${protocol}//${window.location.host}/api/live?${params.toString()}`,
        );
        wsRef.current = ws;

        const startInputStream = () => {
          if (!inputAudioContextRef.current || audioSourceRef.current) return;
          const source =
            inputAudioContextRef.current.createMediaStreamSource(stream);
          audioSourceRef.current = source;

          const processor =
            inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;

            const inputData = e.inputBuffer.getChannelData(0);

            // Simple volume visualization
            let sum = 0;
            for (let i = 0; i < inputData.length; i++)
              sum += inputData[i] * inputData[i];
            const rms = Math.sqrt(sum / inputData.length);
            setVolumeLevel(Math.min(rms * 5, 1));

            const pcmBlob = createBlob(inputData);
            ws.send(
              JSON.stringify({
                type: "audio",
                data: pcmBlob.data,
                mimeType: pcmBlob.mimeType,
              }),
            );
          };

          source.connect(processor);
          processor.connect(inputAudioContextRef.current.destination);
        };

        ws.onmessage = async (event) => {
          const msg = JSON.parse(event.data);

          if (msg.type === "open") {
            if (isMountedRef.current) {
              setIsConnected(true);
              setStatus("Connected - Call in progress");
              startInputStream();
            }
          } else if (msg.type === "audio" && msg.data && outputAudioContextRef.current) {
            const ctx = outputAudioContextRef.current;
            nextStartTimeRef.current = Math.max(
              nextStartTimeRef.current,
              ctx.currentTime,
            );

            const audioBuffer = await decodeAudioData(
              decode(msg.data),
              ctx,
              24000,
              1,
            );

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.addEventListener("ended", () => {
              sourcesRef.current.delete(source);
            });

            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          } else if (msg.type === "interrupted") {
            sourcesRef.current.forEach((source) => {
              try {
                source.stop();
              } catch {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          } else if (msg.type === "outputTranscription" && msg.text) {
            currentOutputTransRef.current += msg.text;
          } else if (msg.type === "inputTranscription" && msg.text) {
            currentInputTransRef.current += msg.text;
          } else if (msg.type === "turnComplete") {
            if (currentInputTransRef.current.trim()) {
              messagesRef.current.push({
                role: "user",
                content: currentInputTransRef.current.trim(),
                timestamp: Date.now(),
              });
              currentInputTransRef.current = "";
            }
            if (currentOutputTransRef.current.trim()) {
              messagesRef.current.push({
                role: "model",
                content: currentOutputTransRef.current.trim(),
                timestamp: Date.now(),
              });
              currentOutputTransRef.current = "";
            }
          } else if (msg.type === "error") {
            console.error("Live API Error Detail:", msg.message);
            if (isMountedRef.current) {
              setStatus("Connection Error");
              toast.error(
                msg.message ||
                  "Connection failed. Please check your internet connection.",
              );
            }
          } else if (msg.type === "close") {
            if (isMountedRef.current) setStatus("Call Ended");
          }
        };

        ws.onerror = () => {
          if (isMountedRef.current) {
            setStatus("Connection Error");
            toast.error("Failed to connect to live audio session.");
          }
        };

        ws.onclose = () => {
          if (isMountedRef.current) {
            setIsConnected(false);
            setStatus((prev) =>
              prev === "Connection Error" ? prev : "Call Ended",
            );
          }
        };
      } catch (error) {
        console.error("Failed to start session:", error);
        setStatus("Failed to connect");
        toast.error("Microphone permission or connection failed.");
      }
    };

    initSession();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [scenario, archetype]);

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (audioSourceRef.current) audioSourceRef.current.disconnect();

    if (
      inputAudioContextRef.current &&
      inputAudioContextRef.current.state !== "closed"
    ) {
      inputAudioContextRef.current.close();
    }
    if (
      outputAudioContextRef.current &&
      outputAudioContextRef.current.state !== "closed"
    ) {
      outputAudioContextRef.current.close();
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  };

  const handleEndCall = () => {
    cleanup();
    if (currentInputTransRef.current.trim()) {
      messagesRef.current.push({
        role: "user",
        content: currentInputTransRef.current,
        timestamp: Date.now(),
      });
    }
    if (currentOutputTransRef.current.trim()) {
      messagesRef.current.push({
        role: "model",
        content: currentOutputTransRef.current,
        timestamp: Date.now(),
      });
    }

    if (messagesRef.current.length === 0) {
      messagesRef.current.push({
        role: "model",
        content: "Call ended without significant transcription.",
        timestamp: Date.now(),
      });
    }

    onEndSession(messagesRef.current);
  };

  // Helper Functions
  function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    return {
      data: base64,
      mimeType: "audio/pcm;rate=16000",
    };
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-lg mx-auto glass-card rounded-[3rem] shadow-2xl overflow-hidden border border-white/60 relative animate-fade-in bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="p-8 text-center border-b border-white/10">
        <h2 className="text-xl font-medium text-slate-200">
          Sales Simulation Call
        </h2>
        <p className="text-indigo-400 font-bold mt-1">{scenario}</p>
        <div
          className={`mt-2 text-sm flex items-center justify-center gap-2 ${isConnected ? "text-emerald-400" : "text-amber-400"}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
          ></span>
          {status}
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8">
        <div className="relative">
          {isConnected && (
            <>
              <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20 delay-75"></div>
              <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20 delay-300"></div>
            </>
          )}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 relative z-10 border-4 border-slate-800">
            <Phone className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="mt-12 w-full max-w-xs space-y-2">
          <p className="text-center text-slate-400 text-sm font-medium uppercase tracking-widest">
            Audio Signal
          </p>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
            <div
              className="h-full bg-emerald-500 transition-all duration-100 ease-out rounded-full"
              style={{ width: `${Math.min(volumeLevel * 100 * 2, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-12 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${isMuted ? "bg-white text-slate-900" : "bg-slate-800 text-white hover:bg-slate-700"}`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleEndCall}
            className="p-6 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/40 hover:scale-105 transition-all"
          >
            <Phone className="w-8 h-8 fill-current rotate-[135deg]" />
          </button>

          <button className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all opacity-50 cursor-not-allowed">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <p className="text-center text-slate-500 text-xs mt-8">
          AI responses are generated in real-time. Speak clearly.
        </p>
      </div>
    </div>
  );
};
