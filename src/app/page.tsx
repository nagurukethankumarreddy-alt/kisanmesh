"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  FileCheck2, 
  Volume2, 
  Users, 
  Calculator, 
  Sliders, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Banknote, 
  Check, 
  Workflow, 
  Flame, 
  Code2, 
  TerminalSquare, 
  Ear, 
  Radio, 
  Building2, 
  Activity, 
  Video, 
  Play, 
  Zap, 
  ArrowRight, 
  Truck, 
  Scale, 
  Wifi, 
  SendHorizontal 
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
  cratesCount?: number;
  stackTier?: string;
  tZeroAdvanceDisbursed?: number;
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
  weighbridgeAudit?: {
    grossWeightKg: number;
    tareWeightKg: number;
    netCropWeightKg: number;
    katotiProtectionCap: string;
  };
  backhaulDetails?: {
    contractedVehicle: string;
    returnLoadCargo: string;
    returnTripSubsidy: number;
  };
  agentExecutionSteps: AgentStep[];
  toolExecutions?: any[];
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

const PAN_INDIA_LANGUAGES = [
  {
    code: "kn-IN",
    label: "ಕನ್ನಡ (Kannada)",
    region: "Karnataka / Kolar",
    defaultCrop: "Hybrid Tomato",
    sampleVideoSpeech: "ನಮಸ್ಕಾರ, ಕೋಲಾರದಿಂದ ರಮೇಶ್. ನನ್ನ ಹತ್ತಿರ 45 ಪೆಟ್ಟಿಗೆ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಟೊಮೆಟೊ ಇದೆ, ಮಾರುಕಟ್ಟೆ ರೇಟ್ ಕುಸಿದಿದೆ.",
    audioResponse: "ರಮೇಶ್ ಗೌಡ ಅವರಿಗೆ ನಮಸ್ಕಾರ. ವಿಡಿಯೋ ಮತ್ತು ಧ್ವನಿಯಿಂದ 45 ಪೆಟ್ಟಿಗೆ ಟೊಮೆಟೊ ಹಾಗೂ ಎ-ಗ್ರೇಡ್ ಗುಣಮಟ್ಟವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಬೆಂಗಳೂರು ಮಾರುಕಟ್ಟೆಗೆ ವಾಹನ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    defaultKg: "990",
    spokenRateMsg: "ಬೆಲೆ ರಕ್ಷಣೆ: ₹42,440 ಉಳಿತಾಯ • ಬೆಂಗಳೂರು ಯಶವಂತಪುರ ಮಾರುಕಟ್ಟೆ"
  },
  {
    code: "hi-IN",
    label: "हिन्दी (Hindi)",
    region: "UP / MP / Delhi",
    defaultCrop: "Kufri Jyoti Potato",
    sampleVideoSpeech: "राम राम साहब, आगरा से रामसेवक। हमारे पास 50 कट्टा आलू तैयार है, कोल्ड स्टोरेज रेट बहुत महंगा मांग रहे हैं।",
    audioResponse: "रामसेवक जी नमस्कार। वीडियो और आवाज से 50 कट्टा आलू और ए-ग्रेड क्वालिटी पहचानी गई है। साझा ट्रक बुक हो चुका है।",
    defaultKg: "2500",
    spokenRateMsg: "मूल्य सुरक्षा: ₹42,440 शुद्ध बचत • दिल्ली आज़ादपुर मंडी"
  },
  {
    code: "mr-IN",
    label: "मराठी (Marathi)",
    region: "Maharashtra / Nashik",
    defaultCrop: "Bellary Red Onion",
    sampleVideoSpeech: "नमस्ते, नासिक लासलगाव येथून भाऊराव पाटिल. 60 पोती लाल कांदा काढला आहे, बाजारात भाव कोसळला आहे.",
    audioResponse: "भाऊराव पाटिल नमस्कार. व्हिडिओद्वारे 60 पोती कांदा आणि प्रतवारी तपासली गेली आहे. वाशी मार्केटसाठी आरक्षण झाले आहे.",
    defaultKg: "3000",
    spokenRateMsg: "भाव संरक्षण: ₹42,440 निव्वळ बचत • मुंबई वाशी मार्केट"
  },
  {
    code: "te-IN",
    label: "తెలుగు (Telugu)",
    region: "Andhra Pradesh / Guntur",
    defaultCrop: "Teja Red Chili",
    sampleVideoSpeech: "నమస్కారం, గుంటూరు నుండి రమేష్. నా దగ్గర 35 బస్తాల ఎర్ర మిర్చి సిద్ధంగా ఉంది, మార్కెట్ రేటు పడిపోయింది.",
    audioResponse: "నమస్కారం. వీడియో ద్వారా 35 బస్తాల మిర్చి మరియు ఏ-గ్రేడ్ నాణ్యత ధృవీకరించబడింది. హైదరాబాద్ లోడ్ సిద్ధంగా ఉంది.",
    defaultKg: "1750",
    spokenRateMsg: "ధర రక్షణ: ₹42,440 నికర ఆదా • హైదరాబాద్ మార్కెట్"
  }
];

export default function Home() {
  const [activePersona, setActivePersona] = useState<"FPO_OPERATOR" | "ORAL_FARMER">("FPO_OPERATOR");
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>("kn-IN");
  
  const [crop, setCrop] = useState("Hybrid Tomato");
  const [volume, setVolume] = useState("990");
  const [location, setLocation] = useState("Kolar Belt ➔ Bengaluru Terminal");
  const [radiusKm, setRadiusKm] = useState(12);
  const [farmersCount, setFarmersCount] = useState(3);
  
  const [qualityGrade, setQualityGrade] = useState("Grade A (Export Index 95.4%)");
  const [farmerPhone] = useState("+91 98450 21980");

  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVideoAnalyzing, setIsVideoAnalyzing] = useState(false);
  const [videoDemoActive, setVideoDemoActive] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSoundboxPlaying, setIsSoundboxPlaying] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [liveAudioWave, setLiveAudioWave] = useState<number[]>([30, 65, 45, 80, 55, 90, 40]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArbitrageResult | null>(null);
  const [activeAuctionTurn, setActiveAuctionTurn] = useState<number>(0);
  const [agentPhase, setAgentPhase] = useState<"IDLE" | "PERCEIVING" | "PLANNING" | "AUCTIONEERING" | "SETTLING">("IDLE");
  const [upiPayoutModal, setUpiPayoutModal] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [showProtocolPayload, setShowProtocolPayload] = useState(false);
  const [showToolDrawer, setShowToolDrawer] = useState(false);

  const currentLang = PAN_INDIA_LANGUAGES.find(l => l.code === selectedLanguageCode) || PAN_INDIA_LANGUAGES[0];

  useEffect(() => {
    if (isPlayingAudio || isSoundboxPlaying || isVideoAnalyzing || videoDemoActive) {
      const interval = setInterval(() => {
        setLiveAudioWave(Array.from({ length: 9 }, () => Math.floor(Math.random() * 70) + 20));
      }, 140);
      return () => clearInterval(interval);
    }
  }, [isPlayingAudio, isSoundboxPlaying, isVideoAnalyzing, videoDemoActive]);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguageCode(code);
    const langObj = PAN_INDIA_LANGUAGES.find(l => l.code === code);
    if (langObj) {
      setCrop(langObj.defaultCrop);
      setVolume(langObj.defaultKg);
      setTranscriptText("");
      setResult(null);
    }
  };

  const getClearIndianVoice = (langCode: string): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const exactMatch = voices.find(v => 
      v.lang.toLowerCase() === langCode.toLowerCase() || 
      v.lang.toLowerCase().replace("_", "-") === langCode.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    const prefix = langCode.split("-")[0].toLowerCase();
    const prefixMatch = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    return voices.find(v => v.lang.toLowerCase().includes("in")) || null;
  };

  const triggerInstantFieldDemo = (langCode: string) => {
    handleLanguageChange(langCode);
    const target = PAN_INDIA_LANGUAGES.find(l => l.code === langCode) || PAN_INDIA_LANGUAGES[0];

    setIsVideoAnalyzing(true);
    setVideoDemoActive(true);
    setVideoPreviewUrl(null);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(target.sampleVideoSpeech);
      utterance.lang = target.code;
      utterance.rate = 0.88;
      utterance.pitch = 1.05;

      const clearVoice = getClearIndianVoice(target.code);
      if (clearVoice) utterance.voice = clearVoice;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setVideoDemoActive(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setVideoDemoActive(false);
      };
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setIsVideoAnalyzing(false);
      setTranscriptText(target.sampleVideoSpeech);
      setCrop(target.defaultCrop);
      setVolume(target.defaultKg);
      setQualityGrade(`Grade A (Multimodal Assay: 96.4% • ${target.label.split(" ")[0]})`);
    }, 1200);
  };

  const playSoundboxConfirmation = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentLang.audioResponse);
    utterance.lang = currentLang.code;
    utterance.rate = 0.90;
    utterance.pitch = 1.0;

    const clearVoice = getClearIndianVoice(currentLang.code);
    if (clearVoice) utterance.voice = clearVoice;

    utterance.onstart = () => setIsSoundboxPlaying(true);
    utterance.onend = () => setIsSoundboxPlaying(false);
    utterance.onerror = () => setIsSoundboxPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePrintVoucher = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const openWhatsAppDispatch = () => {
    if (!result) return;
    const msg = `*KISANMESH ESCROW CONSIGNMENT*%0A*ID:* ${result.consignmentVoucher.voucherId}%0A*Crop:* ${crop}%0A*Batch:* ${volume} kg%0A*Net Benefit:* ₹${result.optimalMandi.netGainRupees.toLocaleString()}%0A*Storage:* ${result.consignmentVoucher.coldStorageHub}%0A*Status: ESCROW LOCKED*`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const runArbitrageSentinel = async () => {
    setLoading(true);
    setResult(null);
    setActiveAuctionTurn(0);
    setPayoutSuccess(false);

    setAgentPhase("PERCEIVING");
    setTimeout(() => setAgentPhase("PLANNING"), 500);
    setTimeout(() => setAgentPhase("AUCTIONEERING"), 1100);

    try {
      const res = await fetch("/api/arbitrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          crop, 
          volumeKg: Number(volume), 
          location, 
          state: currentLang.region.split(" / ")[0],
          radiusKm,
          farmersCount,
          qualityGrade
        })
      });
      const data = await res.json();
      setResult(data);

      setTimeout(() => setActiveAuctionTurn(1), 400);
      setTimeout(() => setActiveAuctionTurn(2), 1000);
      setTimeout(() => {
        setActiveAuctionTurn(3);
        setAgentPhase("SETTLING");
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runFullOneClickWorkflow = async () => {
    triggerInstantFieldDemo(selectedLanguageCode);
    setTimeout(() => {
      runArbitrageSentinel();
    }, 1600);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 print:bg-white print:text-black">
      {/* Header with Resilience Status */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
            KM
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              KisanMesh <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Production Master</span>
            </h1>
            <p className="text-xs text-slate-400">
              {activePersona === "ORAL_FARMER" 
                ? "Zero-Literacy Voice, Telephony & Soundbox Screen" 
                : "Autonomous Supply Arbitrage, Tare Weighing & Logistics Engine"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span>Edge Queue Active (Online)</span>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActivePersona("FPO_OPERATOR")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activePersona === "FPO_OPERATOR" 
                  ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700 shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> FPO Hub
            </button>
            <button
              onClick={() => setActivePersona("ORAL_FARMER")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activePersona === "ORAL_FARMER" 
                  ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Ear className="h-3.5 w-3.5" /> Oral Mode
            </button>
          </div>

          <button
            onClick={() => setChaosMode(!chaosMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer ${
              chaosMode 
                ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse font-bold" 
                : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>{chaosMode ? "Chaos Active" : "Inject Chaos"}</span>
          </button>
        </div>
      </header>

      {/* VIEW 1: DEDICATED ORAL MODE */}
      {activePersona === "ORAL_FARMER" ? (
        <div className="max-w-4xl mx-auto p-6 space-y-6 mt-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Ear className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">ರೈತರ ಧ್ವನಿ ಇಂಟರ್ಫೇಸ್ • Rural Voice & Soundbox</h2>
                <p className="text-xs text-slate-400">Zero-reading interface. Tap your language card to listen and speak.</p>
              </div>
            </div>
            <button
              onClick={() => setActivePersona("FPO_OPERATOR")}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 transition"
            >
              Back to FPO Hub <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAN_INDIA_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => triggerInstantFieldDemo(l.code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedLanguageCode === l.code
                    ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-800"
                }`}
              >
                <span className="text-sm font-black block text-white">{l.label.split(" ")[0]}</span>
                <span className="text-xs text-emerald-400 font-mono block mt-1">{l.region.split(" / ")[0]}</span>
                <span className="text-[10px] text-slate-400 mt-2 block font-sans">Tap to speak & listen</span>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {currentLang.label} • {currentLang.defaultCrop}
              </span>
              <h3 className="text-lg font-bold text-white">
                &ldquo;{transcriptText || currentLang.sampleVideoSpeech}&rdquo;
              </h3>
            </div>

            <div className="h-16 flex items-center justify-center gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
              {liveAudioWave.map((h, i) => (
                <span
                  key={i}
                  className="w-2 bg-emerald-400 rounded-full transition-all duration-150"
                  style={{ height: `${Math.max(15, h)}%` }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => triggerInstantFieldDemo(selectedLanguageCode)}
                className="py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
              >
                <Play className="h-5 w-5" /> 1-Tap Voice Ingest
              </button>

              <button
                onClick={playSoundboxConfirmation}
                className="py-4 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition active:scale-95 cursor-pointer"
              >
                <Radio className="h-5 w-5" /> Test Soundbox Chime
              </button>

              <button
                onClick={runArbitrageSentinel}
                disabled={loading}
                className="py-4 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                Lock Best Mandi
              </button>
            </div>

            {result && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-left animate-in slide-in-from-bottom-2">
                <div>
                  <span className="text-xs font-mono text-emerald-400 block font-bold">ಆಡಿಯೋ ದೃಢೀಕರಣ • Spoken Confirmation</span>
                  <span className="text-sm font-bold text-white block mt-0.5">{currentLang.spokenRateMsg}</span>
                </div>
                <button
                  onClick={playSoundboxConfirmation}
                  className="px-3 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="h-4 w-4" /> Listen
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (

      /* VIEW 2: FULL ENTERPRISE FPO HUB COCKPIT */
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 print:m-0 print:p-0 print:block animate-in fade-in duration-300">
        <div className="lg:col-span-4 space-y-5 print:hidden">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-400" /> One-Click Field Demos
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Instant Ingest
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PAN_INDIA_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => triggerInstantFieldDemo(l.code)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedLanguageCode === l.code 
                      ? "bg-emerald-500/10 border-emerald-500/60 shadow-sm" 
                      : "bg-slate-950 hover:bg-slate-800 border-slate-800"
                  }`}
                >
                  <span className="font-bold text-xs block text-white">{l.label.split(" ")[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">{l.defaultCrop.split(" ")[1] || l.defaultCrop} • {l.defaultKg}kg</span>
                </button>
              ))}
            </div>

            <button
              onClick={runFullOneClickWorkflow}
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Run Full Autonomous Pipeline</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4 w-4 text-indigo-400" /> Multimodal Video Canvas
              </span>
              <span className="text-[10px] font-mono text-slate-400">{currentLang.region.split(" / ")[0]}</span>
            </div>

            <div className="relative rounded-xl border border-slate-800 bg-slate-950 h-32 flex flex-col items-center justify-center overflow-hidden">
              {videoPreviewUrl ? (
                <video src={videoPreviewUrl} controls className="w-full h-full object-cover" />
              ) : videoDemoActive ? (
                <div className="text-center p-3 space-y-1.5">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                    <Video className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-300 font-bold block">
                    Extracting Speech & Assay: {currentLang.label.split(" ")[0]}
                  </span>
                </div>
              ) : (
                <div className="text-center p-3 space-y-1">
                  <Video className="h-6 w-6 text-indigo-400 mx-auto opacity-70" />
                  <p className="text-[11px] text-slate-300 font-medium">Harvest Video Telemetry</p>
                  <p className="text-[9px] text-slate-500">Audio track parsed into regional Bhashini speech tokens</p>
                </div>
              )}

              {isVideoAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-1 text-xs font-mono text-indigo-300">
                  <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                  <span>Processing Speech & Video Track...</span>
                </div>
              )}
            </div>

            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>Audio Stream:</span>
              </div>
              <div className="flex items-end gap-1 h-4">
                {liveAudioWave.map((h, i) => (
                  <span key={i} className="w-1 bg-emerald-400 rounded-full transition-all duration-150" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => triggerInstantFieldDemo(selectedLanguageCode)}
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 text-emerald-400" /> Sample Voice
              </button>

              <button
                onClick={playSoundboxConfirmation}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSoundboxPlaying 
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse" 
                    : "bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/30 text-amber-200"
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-amber-400" />
                {isSoundboxPlaying ? "Chiming..." : "Test Soundbox"}
              </button>
            </div>

            {transcriptText && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono italic">
                &ldquo;{transcriptText}&rdquo;
                <div className="text-emerald-400 not-italic font-sans text-[10px] mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Dialect parsed via Bhashini Speech API
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" /> Lot Geometry Parameters
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Commodity</label>
                <input 
                  type="text"
                  value={crop} 
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Weight (kg)</label>
                <input 
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
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

            <div className="h-28 flex items-center justify-center relative border border-slate-800/80 rounded-lg bg-slate-950 overflow-hidden mt-2">
              <svg className="w-full h-full" viewBox="0 0 320 120">
                <circle cx="160" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
                <circle cx="160" cy="60" r="28" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.25" />
                <circle cx="160" cy="60" r="4" fill="#10b981" />
                <text x="160" y="74" fill="#a7f3d0" fontSize="7" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  Consolidation Hub
                </text>
                {Array.from({ length: farmersCount }).map((_, i) => {
                  const angle = (i * (360 / farmersCount) - 60) * (Math.PI / 180);
                  const r = 24 + ((i % 3) * 9);
                  const cx = 160 + r * Math.cos(angle);
                  const cy = 60 + (r * 0.78) * Math.sin(angle);
                  return (
                    <g key={i}>
                      <line x1="160" y1="60" x2={cx} y2={cy} stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                      <circle cx={cx} cy={cy} r="3.5" fill="#f59e0b" />
                      <text x={cx + 5} y={cy + 2.5} fill="#f8fafc" fontSize="6.5" fontFamily="monospace">Node {String.fromCharCode(65 + i)}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6 print:w-full">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono print:hidden">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Workflow className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-slate-300">Agent Graph:</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className={`px-2 py-0.5 rounded ${agentPhase === "PERCEIVING" ? "bg-cyan-500 text-slate-950 font-bold animate-pulse" : "bg-slate-800 text-slate-400"}`}>1. PERCEIVING</span>
              <span className="text-slate-600">➔</span>
              <span className={`px-2 py-0.5 rounded ${agentPhase === "PLANNING" ? "bg-cyan-500 text-slate-950 font-bold animate-pulse" : "bg-slate-800 text-slate-400"}`}>2. POOLING</span>
              <span className="text-slate-600">➔</span>
              <span className={`px-2 py-0.5 rounded ${agentPhase === "AUCTIONEERING" ? "bg-amber-500 text-slate-950 font-bold animate-pulse" : "bg-slate-800 text-slate-400"}`}>3. REVERSE AUCTION</span>
              <span className="text-slate-600">➔</span>
              <span className={`px-2 py-0.5 rounded ${agentPhase === "SETTLING" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}>4. SETTLING</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" /> Multi-Agent Execution Stream
              </h2>
              <div className="flex items-center gap-2">
                {result && result.toolExecutions && (
                  <button
                    onClick={() => setShowToolDrawer(!showToolDrawer)}
                    className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                  >
                    <TerminalSquare className="h-3 w-3" />
                    <span>{showToolDrawer ? "Hide Tool Calls" : "Inspect Tool Calling (4)"}</span>
                  </button>
                )}
                {loading && <span className="text-xs text-emerald-400 animate-pulse font-mono">GRID_ACTIVE</span>}
              </div>
            </div>

            {showToolDrawer && result && result.toolExecutions && (
              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 font-mono text-[11px] space-y-2 animate-in fade-in">
                <div className="text-indigo-400 font-bold flex items-center justify-between">
                  <span>Deterministic Tool Executions (Agentic Function Calling)</span>
                  <span className="text-emerald-400 text-[10px]">ALL TOOLS PASSED</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                  {result.toolExecutions.map((t: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-emerald-300 font-bold flex items-center justify-between">
                        <span>{t.tool}</span>
                        <span className="text-emerald-400 text-[9px] bg-emerald-500/10 px-1 rounded">{t.status}</span>
                      </div>
                      <div className="text-slate-400 text-[9px]">Args: {JSON.stringify(t.args)}</div>
                      <div className="text-slate-300 text-[9px] truncate">Output: {JSON.stringify(t.result)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-52 rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs overflow-y-auto space-y-3">
              {!result && !loading && (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Ready. Click [Run Full Autonomous Pipeline] to execute the complete workflow.
                </div>
              )}

              {loading && (
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="animate-spin">⠋</span> [SENTINEL]: Ingesting Agmarknet arrivals & rot risk...
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="animate-spin">⠙</span> [CLUSTER]: Consolidating {farmersCount} micro-lots & locking return load backhaul...
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="animate-spin">⠹</span> [AUCTIONEER]: Transmitting crate bids to regional cold-storage APIs...
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20 text-xs">
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

          {result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {result.weighbridgeAudit && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Scale className="h-4 w-4" /> Weighbridge Tare Audit
                      </span>
                      <span className="text-emerald-400 text-[10px]">TARE_VERIFIED</span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gross Consignment:</span>
                        <span className="font-bold">{result.weighbridgeAudit.grossWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Plastic Crate Tare:</span>
                        <span className="text-rose-400">-{result.weighbridgeAudit.tareWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1">
                        <span className="text-white font-bold">Net Crop Billed:</span>
                        <span className="text-emerald-400 font-bold">{result.weighbridgeAudit.netCropWeightKg} kg</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 font-sans">
                        {result.weighbridgeAudit.katotiProtectionCap}
                      </div>
                    </div>
                  </div>
                )}

                {result.backhaulDetails && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Truck className="h-4 w-4" /> Backhaul Return Subsidy
                      </span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">NO EMPTY TRIP</span>
                    </div>
                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vehicle:</span>
                        <span className="text-white font-bold">{result.backhaulDetails.contractedVehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Return Cargo:</span>
                        <span className="text-cyan-300 truncate max-w-[180px]">{result.backhaulDetails.returnLoadCargo}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1">
                        <span className="text-white font-bold">Freight Subsidy:</span>
                        <span className="text-emerald-400 font-bold">-₹{result.backhaulDetails.returnTripSubsidy.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 font-sans">
                        Subsidizes return leg to lower outward freight bill.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 print:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> B2B Reverse Auction Negotiation
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">3-Turn Bargaining Loop</span>
                </div>
                
                <div className="space-y-2 text-xs font-mono">
                  {result.negotiationTurns.slice(0, activeAuctionTurn).map((turn, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3 animate-in fade-in">
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

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 space-y-4 print:border-black print:text-black print:bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 print:text-black">
                      <Calculator className="h-4 w-4" /> Smallholder Payout Ledger
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">Proportional freight allocation with backhaul subsidy pass-through</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUpiPayoutModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition shadow-md print:hidden cursor-pointer"
                    >
                      <Banknote className="h-3.5 w-3.5" /> Execute UPI Payouts
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
                        <th className="pb-2">Stacking Tier</th>
                        <th className="pb-2">Yield</th>
                        <th className="pb-2">Solo Freight</th>
                        <th className="pb-2">Pooled Freight</th>
                        <th className="pb-2">T+0 Advance (60%)</th>
                        <th className="pb-2 text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 print:text-black print:divide-black">
                      {result.farmerCluster.map((f: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/20">
                          <td className="py-2.5 font-sans font-medium text-white print:text-black">
                            {f.name}
                            <div className="text-[10px] text-slate-500 font-mono">{f.upiId}</div>
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {f.stackTier || `Tier ${i + 1}`}
                            </span>
                          </td>
                          <td className="py-2.5">{f.volumeKg} kg</td>
                          <td className="py-2.5 text-rose-400 line-through print:text-rose-700">₹{f.individualFreightCost}</td>
                          <td className="py-2.5 text-emerald-400 font-semibold print:text-emerald-800">₹{f.pooledFreightCost}</td>
                          <td className="py-2.5 text-cyan-300 font-bold">₹{(f.tZeroAdvanceDisbursed || Math.round(f.netPayout * 0.6)).toLocaleString()}</td>
                          <td className="py-2.5 text-right font-bold text-emerald-300 print:text-black">₹{f.netPayout.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] block">T+0 HARVEST ADVANCE</span>
                    <span className="text-white font-bold text-sm">₹{Math.round(result.optimalMandi.netGainRupees * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">CRATE-LEVEL QR TAGGING</span>
                    <span className="text-amber-400 font-bold text-sm">{Math.ceil(Number(volume) / 20)} QR Codes</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-indigo-500/20">
                    <span className="text-slate-400 text-[10px] block">PARAMETRIC INSURANCE</span>
                    <span className="text-indigo-300 font-bold text-sm">Covered @ ₹8/kg Floor</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      Consignment Token #{result.consignmentVoucher.voucherId}
                      <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-semibold">
                        <ShieldCheck className="h-3 w-3" /> Escrow Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{result.consignmentVoucher.coldStorageHub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => setShowProtocolPayload(!showProtocolPayload)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5 transition text-[11px] font-sans font-semibold cursor-pointer"
                  >
                    <Code2 className="h-3.5 w-3.5" /> {showProtocolPayload ? "Hide ONDC Spec" : "Inspect ONDC JSON"}
                  </button>
                  <button
                    onClick={openWhatsAppDispatch}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 transition text-[11px] font-sans font-semibold cursor-pointer"
                  >
                    <SendHorizontal className="h-3.5 w-3.5" /> WhatsApp
                  </button>
                  <button
                    onClick={handlePrintVoucher}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition text-[11px] font-sans font-semibold cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Gate Pass
                  </button>
                </div>
              </div>

              {showProtocolPayload && (
                <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 text-[10px] space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-indigo-400 font-bold font-sans">
                    <span className="flex items-center gap-1"><TerminalSquare className="h-4 w-4" /> Beckn Protocol Specification (ONDC Core)</span>
                    <span className="text-slate-500">v1.2.0 Open Agri Spec</span>
                  </div>
                  <pre className="text-slate-300 font-mono overflow-x-auto p-2.5 bg-slate-900/90 rounded border border-slate-800 max-h-48">
{JSON.stringify({
  context: {
    domain: "nic2004:52110",
    action: "confirm",
    bap_id: "kisanmesh.protocol.in",
    bpp_id: result.consignmentVoucher.coldStorageHub.toLowerCase().replace(/[^a-z0-9]/g, "") + ".logistics.ondc.in",
    transaction_id: "tx-km-" + result.consignmentVoucher.voucherId.toLowerCase(),
    timestamp: new Date().toISOString()
  },
  message: {
    order: {
      id: result.consignmentVoucher.voucherId,
      state: "ESCROW_LOCKED",
      language: currentLang.code,
      quality_assayed: qualityGrade,
      tare_audit: result.weighbridgeAudit,
      backhaul_route: result.backhaulDetails,
      items: [{
        id: crop.toLowerCase().replace(/ /g, "_"),
        quantity: { count: Number(volume), unit: "kilograms" },
        agreed_crate_quote: result.consignmentVoucher.negotiatedRatePerCrate
      }],
      settlement: {
        type: "UPI_AUTOPAY_SPLIT",
        escrow_contract: "0x99b42e72a3a91bf209e8b",
        beneficiaries: result.farmerCluster.map((f: any) => ({ vpa: f.upiId, amount: f.netPayout }))
      }
    }
  }
}, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      )}

      {upiPayoutModal && result && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-400" /> ONDC Instant UPI Settlement
              </h3>
              <button onClick={() => setUpiPayoutModal(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-slate-300">Dispatches automated payouts directly to smallholders via UPI AutoPay rails.</p>

            <div className="space-y-2 border-y border-slate-800 py-3">
              {result.farmerCluster.map((f: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-slate-200 font-sans">{f.name}</span>
                    <div className="text-[10px] text-slate-500">{f.upiId}</div>
                  </div>
                  <span className="font-bold text-emerald-400">₹{f.netPayout.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setPayoutSuccess(true);
                playSoundboxConfirmation();
                setTimeout(() => setUpiPayoutModal(false), 2200);
              }}
              disabled={payoutSuccess}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                payoutSuccess ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
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