"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  FileCheck2, 
  Mic, 
  MicOff,
  Volume2,
  MessageSquare, 
  Users, 
  Calculator,
  Languages
} from "lucide-react";

interface AgentStep {
  agentName: string;
  action: string;
  detail: string;
  timestamp: string;
}

interface FarmerSplit {
  name: string;
  volumeKg: number;
  individualFreightCost: number;
  pooledFreightCost: number;
  netPayout: number;
}

interface ArbitrageResult {
  distressRisk: string;
  distressReason: string;
  localMandiCrashPrice: number;
  optimalMandi: {
    name: string;
    distanceKm: number;
    projectedPricePerKg: number;
    transitCostTotal: number;
    netGainRupees: number;
  };
  agentExecutionSteps: AgentStep[];
  negotiationTurns: { speaker: string; message: string; quote?: number }[];
  farmerCluster: FarmerSplit[];
  consignmentVoucher: {
    voucherId: string;
    coldStorageHub: string;
    initialQuotePerCrate: number;
    negotiatedRatePerCrate: number;
    holdingPeriodDays: number;
    status: string;
  };
}

export default function Home() {
  // Input parameters
  const [crop, setCrop] = useState("Hybrid Tomato");
  const [volume, setVolume] = useState("2600");
  const [location, setLocation] = useState("Kolar APMC Rural Belt, Karnataka");
  
  // Voice & Speech State
  const [selectedLanguage, setSelectedLanguage] = useState<"kn-IN" | "hi-IN" | "en-IN">("kn-IN");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const recognitionRef = useRef<any>(null);

  // Execution & Agent state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArbitrageResult | null>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscriptText(speechResult);
          setIsRecording(false);
          parseSpokenInput(speechResult);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
      }
    }
  }, [selectedLanguage]);

  // Natural Language Parser for Voice Input
  const parseSpokenInput = (text: string) => {
    const lower = text.toLowerCase();
    
    // Extract Crop
    if (lower.includes("tomato") || lower.includes("ಟೊಮೆಟೊ") || lower.includes("tamatar") || lower.includes("ಟೊಮೇಟೊ")) {
      setCrop("Hybrid Tomato");
    } else if (lower.includes("onion") || lower.includes("ಈರುಳ್ಳಿ") || lower.includes("pyaz")) {
      setCrop("Bellary Red Onion");
    } else if (lower.includes("chili") || lower.includes("ಮೆಣಸಿನಕಾಯಿ") || lower.includes("mirchi")) {
      setCrop("Byadagi Red Chili");
    } else if (lower.includes("capsicum") || lower.includes("ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ")) {
      setCrop("Green Capsicum");
    }

    // Extract Volume (look for numeric matches)
    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      setVolume(numbers[0]);
    }

    // Extract Location Context
    if (lower.includes("kolar") || lower.includes("ಕೋಲಾರ")) {
      setLocation("Kolar APMC Rural Belt, Karnataka");
    } else if (lower.includes("nashik") || lower.includes("lasalgaon")) {
      setLocation("Lasalgaon Mandi, Nashik, Maharashtra");
    } else if (lower.includes("haveri") || lower.includes("byadagi") || lower.includes("ಬ್ಯಾಡಗಿ")) {
      setLocation("Byadagi APMC, Haveri, Karnataka");
    }
  };

  // Toggle Live Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Live speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscriptText("");
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Instant Preset Vocal Simulation (Kannada / Hindi)
  const playSimulatedAudioNote = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    const presetKannada = "ನಮಸ್ಕಾರ, ಕೋಲಾರದಿಂದ ರಮೇಶ್. 800 ಕೆಜಿ ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ ಸಿದ್ಧವಿದೆ, ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಲೆ ಕುಸಿದಿದೆ.";
    setTranscriptText(presetKannada);
    setCrop("Hybrid Tomato");
    setVolume("2600");
    setLocation("Kolar APMC Rural Belt, Karnataka");

    const utterance = new SpeechSynthesisUtterance(presetKannada);
    utterance.lang = "kn-IN";
    utterance.rate = 0.92;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Orchestration Trigger
  const runArbitrageSentinel = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/arbitrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, volumeKg: Number(volume), location })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
            KM
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              KisanMesh <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Agentic v2.6</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Agricultural Supply Arbitrage & Distress Mitigation Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Grid Active
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Left Column: Multimodal Voice Ingest + Manual Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Voice Ingest Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Omnichannel Voice Ingest
              </span>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                <Languages className="h-3 w-3 text-emerald-400" />
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-transparent text-slate-200 outline-none cursor-pointer"
                >
                  <option value="kn-IN" className="bg-slate-900">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi-IN" className="bg-slate-900">हिन्दी (Hindi)</option>
                  <option value="en-IN" className="bg-slate-900">English (India)</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Accepts live spoken voice notes or regional IVR WhatsApp audio streams.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleListening}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  isRecording 
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse" 
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-emerald-400" />}
                {isRecording ? "Listening..." : "Speak Live"}
              </button>

              <button
                onClick={playSimulatedAudioNote}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudio ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
                Demo Audio
              </button>
            </div>

            {/* Live Audio Transcript Display */}
            {transcriptText && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono italic">
                &ldquo;{transcriptText}&rdquo;
                <div className="text-emerald-400 not-italic font-sans text-[10px] mt-1 font-semibold flex items-center gap-1">
                  ✓ Parsed into Collective Telemetry
                </div>
              </div>
            )}
          </div>

          {/* Manual Parameter Override Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" /> Dynamic Telemetry Parameters
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Perishable Crop Commodity</label>
              <select 
                value={crop} 
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>Hybrid Tomato</option>
                <option>Bellary Red Onion</option>
                <option>Byadagi Red Chili</option>
                <option>Green Capsicum</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Pooled Volume (kg)</label>
              <input 
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Agricultural Production Corridor</label>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Kolar APMC Rural Belt, Karnataka">Kolar Belt (Karnataka) ➔ Bengaluru</option>
                <option value="Lasalgaon Mandi, Nashik, Maharashtra">Nashik Belt (Maharashtra) ➔ Mumbai</option>
                <option value="Byadagi APMC, Haveri, Karnataka">Haveri Belt (Karnataka) ➔ Hubballi</option>
                <option value="Agra Rural Corridor, Uttar Pradesh">Agra Belt (Uttar Pradesh) ➔ Delhi-NCR</option>
              </select>
            </div>

            <button
              onClick={runArbitrageSentinel}
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Agents Orchestrating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Execute Autonomous Network
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Agent Streams, Reverse Auction, & Payout Ledger */}
        <div className="lg:col-span-8 space-y-6">
          {/* Real-Time Agent Stream */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" /> Autonomous Multi-Agent Reasoning & Execution Log
              </h2>
              {loading && <span className="text-xs text-emerald-400 animate-pulse font-mono">LIVE_AGENT_STREAM</span>}
            </div>

            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs overflow-y-auto space-y-3">
              {!result && !loading && (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Ready. Speak live, trigger audio demo, or click [Execute Autonomous Network].
                </div>
              )}

              {loading && (
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="animate-spin">⠋</span> [SENTINEL_AGENT]: Analyzing mandi arrival velocity and weather delta...
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="animate-spin">⠙</span> [CLUSTER_ENGINE]: Consolidating micro-lots into shared freight batch...
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="animate-spin">⠹</span> [AUCTIONEER_AGENT]: Initiating reverse Dutch auction across cold hubs...
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="text-rose-400 bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
                    <strong>[ALERT: {result.distressRisk} RISK DETECTED]</strong> {result.distressReason}
                  </div>
                  {result.agentExecutionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300 border-l-2 border-emerald-500/40 pl-3 py-1">
                      <span className="text-slate-500 text-[10px]">{step.timestamp}</span>
                      <div>
                        <span className="text-emerald-400 font-semibold">[{step.agentName}]</span>{" "}
                        <span className="text-slate-200">{step.action}:</span>{" "}
                        <span className="text-slate-400">{step.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results: Reverse Auction Dialogue, Ledger, and Smart Contract */}
          {result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* B2B Reverse Auction */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Live Inter-Agent B2B Reverse Auction
                </span>
                <div className="space-y-2 text-xs font-mono">
                  {result.negotiationTurns.map((turn, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        turn.speaker.includes("KisanMesh") ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {turn.speaker}
                      </span>
                      <span className="text-slate-300 flex-1">{turn.message}</span>
                      {turn.quote && <span className="font-bold text-white">₹{turn.quote}/crate</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verifiable Smallholder Payout Ledger */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="h-4 w-4" /> Verifiable Smallholder Payout Ledger
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Total Value Protected: +₹{result.optimalMandi.netGainRupees.toLocaleString()}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">Smallholder</th>
                        <th className="pb-2">Yield</th>
                        <th className="pb-2">Solo Freight Cost</th>
                        <th className="pb-2">Pooled Freight Cost</th>
                        <th className="pb-2 text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {result.farmerCluster.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-800/20">
                          <td className="py-2.5 font-sans font-medium text-white">{f.name}</td>
                          <td className="py-2.5">{f.volumeKg} kg</td>
                          <td className="py-2.5 text-rose-400 line-through">₹{f.individualFreightCost}</td>
                          <td className="py-2.5 text-emerald-400 font-semibold">₹{f.pooledFreightCost}</td>
                          <td className="py-2.5 text-right font-bold text-emerald-300">₹{f.netPayout.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Consignment Voucher */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Smart Consignment #{result.consignmentVoucher.voucherId}</div>
                    <div className="text-[11px] text-slate-400">{result.consignmentVoucher.coldStorageHub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ESCROW LOCKED
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Settled @ ₹{result.consignmentVoucher.negotiatedRatePerCrate}/crate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}