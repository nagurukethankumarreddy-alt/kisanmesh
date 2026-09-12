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
  Languages,
  Sliders,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Printer,
  SendHorizontal,
  QrCode,
  CloudSun,
  Banknote,
  Check
} from "lucide-react";

interface AgentStep {
  agentName: string;
  action: string;
  detail: string;
  timestamp: string;
}

interface FarmerSplit {
  name: string;
  state: string;
  volumeKg: number;
  individualFreightCost: number;
  pooledFreightCost: number;
  netPayout: number;
  upiId?: string;
}

interface ArbitrageResult {
  distressRisk: string;
  distressReason: string;
  localMandiCrashPrice: number;
  weatherTelemetry?: {
    temperature: string;
    humidity: string;
    spoilageAcceleration: string;
    condition: string;
  };
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

const PAN_INDIA_CORRIDORS = [
  {
    id: "kolar-blr",
    name: "Kolar Belt (Karnataka) ➔ Bengaluru Terminal",
    crop: "Hybrid Tomato",
    state: "Karnataka",
    defaultVol: 2600,
    presetAudio: {
      lang: "kn-IN",
      text: "ನಮಸ್ಕಾರ, ಕೋಲಾರದಿಂದ ರಮೇಶ್. 800 ಕೆಜಿ ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ ಸಿದ್ಧವಿದೆ, ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಲೆ ಕುಸಿದಿದೆ."
    }
  },
  {
    id: "nashik-mum",
    name: "Nashik / Lasalgaon (Maharashtra) ➔ Mumbai Vashi Hub",
    crop: "Bellary Red Onion",
    state: "Maharashtra",
    defaultVol: 3200,
    presetAudio: {
      lang: "hi-IN",
      text: "नमस्ते, नासिक लासलगाव से भाऊराव पाटिल। 1100 किलो प्याज मंडी में भाव गिर रहा है, तुरंत व्यवस्था करें।"
    }
  },
  {
    id: "agra-delhi",
    name: "Agra / Farrukhabad (UP) ➔ Delhi-NCR Azadpur APMC",
    crop: "Kufri Jyoti Potato",
    state: "Uttar Pradesh",
    defaultVol: 4200,
    presetAudio: {
      lang: "hi-IN",
      text: "राम राम साहब, आगरा से रामसेवक। 1400 किलो आलू की निकासी है, कोल्ड स्टोरेज रेट बहुत महंगा मांग रहे हैं।"
    }
  },
  {
    id: "guntur-hyd",
    name: "Guntur Belt (Andhra Pradesh) ➔ Hyderabad Wholesale",
    crop: "Teja Red Chili",
    state: "Andhra Pradesh",
    defaultVol: 1900,
    presetAudio: {
      lang: "en-IN",
      text: "Namaskaram, reporting from Guntur market yard. 700 kg export chili ready, arrivals exceeding limits."
    }
  }
];

export default function Home() {
  const [selectedCorridor, setSelectedCorridor] = useState(PAN_INDIA_CORRIDORS[0].id);
  const [crop, setCrop] = useState(PAN_INDIA_CORRIDORS[0].crop);
  const [volume, setVolume] = useState(String(PAN_INDIA_CORRIDORS[0].defaultVol));
  const [location, setLocation] = useState(PAN_INDIA_CORRIDORS[0].name);
  const [radiusKm, setRadiusKm] = useState(8);
  const [farmersCount, setFarmersCount] = useState(3);
  
  const [selectedLanguage, setSelectedLanguage] = useState<"kn-IN" | "hi-IN" | "en-IN" | "mr-IN" | "te-IN">("kn-IN");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [gpsStatus, setGpsStatus] = useState("");
  const recognitionRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArbitrageResult | null>(null);
  const [activeAuctionTurn, setActiveAuctionTurn] = useState<number>(0);
  const [upiPayoutModal, setUpiPayoutModal] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleCorridorChange = (corridorId: string) => {
    const found = PAN_INDIA_CORRIDORS.find((c) => c.id === corridorId);
    if (found) {
      setSelectedCorridor(found.id);
      setCrop(found.crop);
      setVolume(String(found.defaultVol));
      setLocation(found.name);
      setTranscriptText("");
      setResult(null);
      setActiveAuctionTurn(0);
      setPayoutSuccess(false);
    }
  };

  const detectLiveGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    setGpsStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsStatus(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        if (latitude < 18) {
          handleCorridorChange("kolar-blr");
        } else {
          handleCorridorChange("agra-delhi");
        }
      },
      () => {
        setGpsStatus("Locked: Kolar Hub Node");
        handleCorridorChange("kolar-blr");
      }
    );
  };

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

  const parseSpokenInput = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("tomato") || lower.includes("ಟೊಮೆಟೊ") || lower.includes("tamatar")) {
      setCrop("Hybrid Tomato");
    } else if (lower.includes("onion") || lower.includes("ಈರುಳ್ಳಿ") || lower.includes("pyaz") || lower.includes("कांदा")) {
      setCrop("Bellary Red Onion");
    } else if (lower.includes("potato") || lower.includes("aloo") || lower.includes("आलू") || lower.includes("ಆಲೂಗಡ್ಡೆ")) {
      setCrop("Kufri Jyoti Potato");
    } else if (lower.includes("chili") || lower.includes("mirchi") || lower.includes("ಮೆಣಸಿನಕಾಯಿ")) {
      setCrop("Teja Red Chili");
    }

    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      setVolume(numbers[0]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Live speech recognition works in Google Chrome and Microsoft Edge.");
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

  const playRegionalVoiceNote = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    const active = PAN_INDIA_CORRIDORS.find((c) => c.id === selectedCorridor) || PAN_INDIA_CORRIDORS[0];
    setTranscriptText(active.presetAudio.text);

    const utterance = new SpeechSynthesisUtterance(active.presetAudio.text);
    utterance.lang = active.presetAudio.lang;
    utterance.rate = 0.92;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const runArbitrageSentinel = async () => {
    setLoading(true);
    setResult(null);
    setActiveAuctionTurn(0);
    setPayoutSuccess(false);

    try {
      const active = PAN_INDIA_CORRIDORS.find((c) => c.id === selectedCorridor);
      const res = await fetch("/api/arbitrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          crop, 
          volumeKg: Number(volume), 
          location, 
          state: active?.state || "Karnataka",
          radiusKm,
          farmersCount
        })
      });
      const data = await res.json();
      setResult(data);

      setTimeout(() => setActiveAuctionTurn(1), 400);
      setTimeout(() => setActiveAuctionTurn(2), 1000);
      setTimeout(() => setActiveAuctionTurn(3), 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintVoucher = () => {
    if (typeof window !== "undefined") window.print();
  };

  const openWhatsAppDispatch = () => {
    if (!result) return;
    const msg = `*KISANMESH ESCROW CONSIGNMENT NOTIFICATION*%0A%0A*Token:* ${result.consignmentVoucher.voucherId}%0A*Crop:* ${crop}%0A*Batch:* ${volume} kg%0A*Rate:* Rs ${result.consignmentVoucher.negotiatedRatePerCrate}/crate%0A*Protected:* Rs ${result.optimalMandi.netGainRupees.toLocaleString()}%0A*Hub:* ${result.consignmentVoucher.coldStorageHub}%0A%0A_Status: ESCROW LOCKED & VERIFIED_`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const triggerDirectUpiSettlement = () => {
    setPayoutSuccess(true);
    setTimeout(() => {
      setUpiPayoutModal(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 print:bg-white print:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
            KM
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              KisanMesh <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Pan-India v4.0</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Agricultural Supply Arbitrage & Distress Mitigation Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={detectLiveGPS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <Navigation className="h-3 w-3 text-emerald-400" />
            <span>{gpsStatus || "Auto-Detect Mandi GPS"}</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Agmarknet & ONDC Active
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 print:m-0 print:p-0 print:block">
        {/* Left Column: Multimodal Control Panel */}
        <div className="lg:col-span-4 space-y-5 print:hidden">
          {/* Corridor Selection */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> High-Distress Mandi Corridor
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Pan-India APMC</span>
            </div>
            
            <select
              value={selectedCorridor}
              onChange={(e) => handleCorridorChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {PAN_INDIA_CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Multimodal Voice Ingest */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Multimodal Voice Ingest
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
                  <option value="mr-IN" className="bg-slate-900">मराठी (Marathi)</option>
                  <option value="te-IN" className="bg-slate-900">తెలుగు (Telugu)</option>
                  <option value="en-IN" className="bg-slate-900">English (India)</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Accepts live audio notes in regional tongues across Karnataka, Maharashtra, UP, and AP.
            </p>

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
                onClick={playRegionalVoiceNote}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudio ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
                Demo Regional Note
              </button>
            </div>

            {transcriptText && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono italic">
                &ldquo;{transcriptText}&rdquo;
                <div className="text-emerald-400 not-italic font-sans text-[10px] mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ingested & Parsed into Grid
                </div>
              </div>
            )}
          </div>

          {/* Cluster Geometry Parameters */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" /> Cluster Geometry & Commodity
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Perishable Crop Commodity</label>
              <input 
                type="text"
                value={crop} 
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Consolidated Volume (kg)</label>
              <input 
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Pooling Radius</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="3" 
                    max="20" 
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-emerald-400 w-8">{radiusKm}km</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Smallholder Lots</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="2" 
                    max="8" 
                    value={farmersCount}
                    onChange={(e) => setFarmersCount(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-emerald-400 w-8">{farmersCount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={runArbitrageSentinel}
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Agents Orchestrating Grid...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Execute Autonomous Arbitrage
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution View */}
        <div className="lg:col-span-8 space-y-6 print:w-full">
          {/* Real-time Multi-Agent Log */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" /> Autonomous Multi-Agent Reasoning & Tool Execution
              </h2>
              {loading && <span className="text-xs text-emerald-400 animate-pulse font-mono">GRID_AGENTS_ACTIVE</span>}
            </div>

            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs overflow-y-auto space-y-3">
              {!result && !loading && (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Ready. Select an Indian corridor, speak live, or click [Execute Autonomous Arbitrage].
                </div>
              )}

              {loading && (
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="animate-spin">⠋</span> [SENTINEL_AGENT]: Ingesting Agmarknet velocities & calling OpenMeteo weather tools...
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="animate-spin">⠙</span> [CLUSTER_ENGINE]: Spatial batch optimization across {radiusKm}km radius ({farmersCount} smallholders)...
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="animate-spin">⠹</span> [AUCTIONEER_AGENT]: Transmitting reservation payloads to cold-storage APIs...
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="animate-spin">⠸</span> [SETTLEMENT_AGENT]: Minting ONDC smart escrow tokens & verifying UPI VPAs...
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="text-rose-400 bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
                    <strong>[ALERT: {result.distressRisk} DISTRESS DETECTED]</strong> {result.distressReason}
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

          {/* Results: Weather Telemetry, Reverse Auction, Ledger, Voucher */}
          {result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* Weather Sentinel Widget */}
              {result.weatherTelemetry && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono print:hidden">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <CloudSun className="h-4 w-4" /> OpenMeteo Tool: {result.weatherTelemetry.condition}
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span>Temp: <strong className="text-white">{result.weatherTelemetry.temperature}</strong></span>
                    <span>Humidity: <strong className="text-white">{result.weatherTelemetry.humidity}</strong></span>
                    <span className="text-rose-400 font-semibold">Spoilage Delta: {result.weatherTelemetry.spoilageAcceleration}</span>
                  </div>
                </div>
              )}

              {/* B2B Reverse Auction */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 print:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Live Inter-Agent B2B Reverse Auction
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">3-Turn Programmatic Bargaining</span>
                </div>
                
                <div className="space-y-2 text-xs font-mono">
                  {result.negotiationTurns.slice(0, activeAuctionTurn).map((turn, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
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
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 space-y-4 print:border-black print:text-black print:bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                      <Calculator className="h-4 w-4" /> Pan-India Smallholder Payout Ledger
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Automated freight cost-splitting eliminating middlemen deductions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUpiPayoutModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition shadow-md print:hidden"
                    >
                      <Banknote className="h-3.5 w-3.5" /> Execute UPI Settlement
                    </button>
                    <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 print:border-black print:text-black">
                      <TrendingUp className="h-3.5 w-3.5" /> Protected: +₹{result.optimalMandi.netGainRupees.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono print:text-black">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 print:border-black print:text-black">
                        <th className="pb-2">Smallholder</th>
                        <th className="pb-2">Cluster Node</th>
                        <th className="pb-2">Yield</th>
                        <th className="pb-2">Solo Freight</th>
                        <th className="pb-2">Pooled Freight</th>
                        <th className="pb-2 text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 print:text-black print:divide-black">
                      {result.farmerCluster.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-800/20">
                          <td className="py-2.5 font-sans font-medium text-white print:text-black">
                            {f.name}
                            <div className="text-[10px] text-slate-500 font-mono">{f.upiId}</div>
                          </td>
                          <td className="py-2.5 text-slate-400 print:text-slate-600">{f.state}</td>
                          <td className="py-2.5">{f.volumeKg} kg</td>
                          <td className="py-2.5 text-rose-400 line-through print:text-rose-700">₹{f.individualFreightCost}</td>
                          <td className="py-2.5 text-emerald-400 font-semibold print:text-emerald-800">₹{f.pooledFreightCost}</td>
                          <td className="py-2.5 text-right font-bold text-emerald-300 print:text-black">₹{f.netPayout.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Escrow Smart Consignment Voucher */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-4 print:border-black print:bg-white print:text-black">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg print:border print:border-black">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2 print:text-black">
                        Smart Consignment Voucher #{result.consignmentVoucher.voucherId}
                        <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-semibold print:text-black">
                          <ShieldCheck className="h-3 w-3" /> Escrow Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 print:text-slate-700">{result.consignmentVoucher.coldStorageHub}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 print:border-black print:text-black">
                      ESCROW LOCKED
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 print:text-black">Settled @ ₹{result.consignmentVoucher.negotiatedRatePerCrate}/crate</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 print:text-black">
                    <QrCode className="h-5 w-5 text-emerald-400 print:text-black" />
                    <span>Cryptographic Escrow Token: 0x99b...72a3</span>
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={openWhatsAppDispatch}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 transition text-[11px] font-sans font-semibold"
                    >
                      <SendHorizontal className="h-3.5 w-3.5" /> WhatsApp Dispatch
                    </button>
                    <button
                      onClick={handlePrintVoucher}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition text-[11px] font-sans font-semibold"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print Voucher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ONDC UPI Settlement Modal */}
      {upiPayoutModal && result && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-400" /> ONDC Instant UPI Settlement
              </h3>
              <button 
                onClick={() => setUpiPayoutModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Dispatches automated smart-contract payouts directly to smallholders&apos; bank accounts via UPI AutoPay rails.
            </p>

            <div className="space-y-2 border-y border-slate-800 py-3">
              {result.farmerCluster.map((f, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-slate-200 font-sans">{f.name}</span>
                    <div className="text-[10px] text-slate-500">{f.upiId}</div>
                  </div>
                  <span className="font-bold text-emerald-400">₹{f.netPayout.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400">Total Escrow Pool:</span>
              <span className="text-sm font-bold font-mono text-white">
                ₹{result.farmerCluster.reduce((acc, f) => acc + f.netPayout, 0).toLocaleString()}
              </span>
            </div>

            <button
              onClick={triggerDirectUpiSettlement}
              disabled={payoutSuccess}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                payoutSuccess 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              }`}
            >
              {payoutSuccess ? (
                <>
                  <Check className="h-4 w-4" /> UPI Mandates Dispatched Successfully
                </>
              ) : (
                "Authorize Direct Multi-Party UPI Transfer"
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}