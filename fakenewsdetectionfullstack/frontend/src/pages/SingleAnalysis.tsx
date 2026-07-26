import React, { useState, useRef } from "react";
import { 
  Clipboard, 
  Trash2, 
  Play, 
  Server, 
  Check, 
  AlertTriangle,
  Clock,
  Upload,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { truthLensApi } from "../services/api";
import type { PredictResponse } from "../services/api";
import Pipeline from "../components/Pipeline";
import VerificationPanel from "../components/VerificationPanel";

export const SingleAnalysis: React.FC = () => {
  const [predictionMode, setPredictionMode] = useState<"production" | "research">("production");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); 
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileText = event.target?.result as string;
      setText(fileText);
    };
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      setError("Failed to paste from clipboard. Please paste manually using Ctrl+V.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setPipelineStep(0);
  };

  const handlePredict = async () => {
    if (!text.trim()) {
      setError("Please paste or type a news article first.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      if (predictionMode === "production") {
        setPipelineStep(1); // Preprocessing
        await new Promise((r) => setTimeout(r, 450));

        setPipelineStep(2); // RoBERTa
        await new Promise((r) => setTimeout(r, 550));

        setPipelineStep(3); // XAI
        await new Promise((r) => setTimeout(r, 450));

        const response = await truthLensApi.predict(text, "production");
        setResult(response);
        setPipelineStep(5); // Complete
      } else {
        setPipelineStep(1); // Preprocessing
        await new Promise((r) => setTimeout(r, 400));

        setPipelineStep(2); // BERT
        await new Promise((r) => setTimeout(r, 450));

        setPipelineStep(3); // DistilBERT
        await new Promise((r) => setTimeout(r, 400));

        setPipelineStep(4); // RoBERTa
        await new Promise((r) => setTimeout(r, 400));

        setPipelineStep(5); // Majority Voting
        await new Promise((r) => setTimeout(r, 450));

        setPipelineStep(6); // XAI
        await new Promise((r) => setTimeout(r, 400));

        const response = await truthLensApi.predict(text, "research");
        setResult(response);
        setPipelineStep(8); // Complete
      }
    } catch (err) {
      setError("API Prediction failed. Verify request structures and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-slideUp grid-bg">
      
      {/* Header Title */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-navy-950 dark:text-white transition-colors">
          AI Investigation Desk
        </h1>
        <p className="text-base md:text-lg text-navy-600 dark:text-navy-300 transition-colors max-w-3xl leading-relaxed">
          Submit raw text blocks to run transformer evaluation pipelines. The system calculates veracity probabilities and generates explainable evidence networks in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* LEFT COLUMN: Input & Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Article Text Box Card */}
          <div className="glass-panel rounded-3xl p-1 bg-white/40 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-beige-300 dark:hover:border-navy-600">
            <div className="bg-white/70 dark:bg-navy-950/70 backdrop-blur-xl rounded-[22px] p-6">
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
                <label htmlFor="article" className="text-sm font-bold text-navy-900 dark:text-beige-50 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-navy-600 dark:bg-gold-500 animate-pulse shadow-[0_0_8px_rgba(197,168,128,0.8)]"></span>
                  Source Material
                </label>
                
                {/* Premium Segmented Control for Mode Toggle */}
                <div className="flex bg-[#E8E2D5]/60 dark:bg-[#0A1128]/80 p-1 rounded-full border border-beige-200 dark:border-navy-800 shadow-inner select-none transition-colors w-full xl:w-auto relative">
                  <button
                    onClick={() => {
                      setPredictionMode("production");
                      setResult(null);
                      setPipelineStep(0);
                    }}
                    disabled={isLoading}
                    className={`flex-1 xl:flex-none px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer relative z-10 ${
                      predictionMode === "production"
                        ? "bg-white text-navy-950 shadow-md dark:bg-navy-800 dark:text-white"
                        : "text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white"
                    }`}
                  >
                    Production
                  </button>
                  <button
                    onClick={() => {
                      setPredictionMode("research");
                      setResult(null);
                      setPipelineStep(0);
                    }}
                    disabled={isLoading}
                    className={`flex-1 xl:flex-none px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer relative z-10 ${
                      predictionMode === "research"
                        ? "bg-white text-navy-950 shadow-md dark:bg-navy-800 dark:text-white"
                        : "text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white"
                    }`}
                  >
                    Research
                  </button>
                </div>
              </div>

              <div className="relative group">
                <textarea
                  id="article"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste raw article text, social media post, or transcript here to begin verification..."
                  className="w-full h-64 p-5 rounded-2xl border-2 border-transparent bg-[#FAF7F0]/80 dark:bg-[#0A1128]/60 text-navy-950 dark:text-navy-50 placeholder-navy-400 dark:placeholder-navy-500 focus:outline-none focus:bg-white dark:focus:bg-[#101F42] focus:border-navy-200 dark:focus:border-gold-500/30 transition-all duration-300 text-sm font-sans resize-none shadow-inner group-hover:border-beige-300 dark:group-hover:border-navy-700 leading-relaxed"
                  disabled={isLoading}
                />
                <span className="absolute bottom-4 right-4 text-[10px] font-mono font-semibold text-navy-400 dark:text-navy-400 bg-white/90 dark:bg-navy-950/90 px-2 py-1 rounded-md backdrop-blur-md border border-beige-200 dark:border-navy-800 shadow-sm">
                  {text.length} chars
                </span>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePaste}
                    disabled={isLoading}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-beige-100 text-navy-700 hover:bg-beige-200 hover:text-navy-950 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700 dark:hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Paste from clipboard"
                  >
                    <Clipboard size={18} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-beige-100 text-navy-700 hover:bg-beige-200 hover:text-navy-950 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700 dark:hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload file"
                  >
                    <Upload size={18} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.json,.csv"
                    className="hidden"
                  />
                  <button
                    onClick={handleClear}
                    disabled={isLoading || !text}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300 transition-all duration-300 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Clear text"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="group relative overflow-hidden flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-black text-white dark:text-navy-950 bg-navy-950 dark:bg-gold-500 shadow-[0_8px_20px_rgba(10,17,40,0.15)] dark:shadow-[0_8px_20px_rgba(197,168,128,0.2)] hover:shadow-[0_8px_25px_rgba(10,17,40,0.3)] dark:hover:shadow-[0_8px_25px_rgba(197,168,128,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-800 to-navy-950 dark:from-gold-400 dark:to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 dark:border-navy-950/30 border-t-white dark:border-t-navy-950 rounded-full animate-spin"></span>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} fill="currentColor" />
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-sm text-red-800 dark:text-red-200 flex items-start space-x-3 animate-fadeIn shadow-sm">
                  <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Error:</strong> {error}</span>
                </div>
              )}

            </div>
          </div>

          {/* Interactive Pipeline Card */}
          <div className="transition-all duration-500 hover:-translate-y-1 hover:shadow-xl rounded-2xl">
            <Pipeline mode={predictionMode} currentStep={pipelineStep} isAnalyzing={isLoading} />
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Verification Panel - VISUAL CENTERPIECE */}
          {result && result.verification && (
            <div className="glass-panel-accent rounded-3xl p-1 shadow-2xl relative overflow-hidden animate-fadeIn transition-all duration-500 hover:-translate-y-1 z-10" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-navy-500/5 pointer-events-none"></div>
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold-400/20 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="bg-white/80 dark:bg-navy-950/80 backdrop-blur-2xl rounded-[28px] border border-white/40 dark:border-navy-700/60 p-6 sm:p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gold-50 dark:bg-gold-500/10 rounded-xl text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-500/20">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy-950 dark:text-beige-50 tracking-tight">
                      Agentic Verification
                    </h3>
                    <p className="text-xs text-navy-600 dark:text-navy-300 font-medium mt-0.5">Automated factual cross-referencing</p>
                  </div>
                </div>
                <VerificationPanel verification={result.verification} />
              </div>
            </div>
          )}

          {/* Production Mode Results Display */}
          {result && result.mode === "production" && (
            <div className={`rounded-3xl p-8 border shadow-xl transition-all duration-500 animate-slideUp hover:-translate-y-1 relative overflow-hidden group ${
              result.prediction === "Fake"
                ? "bg-gradient-to-br from-red-50 via-white to-red-100/50 dark:from-red-950/80 dark:via-navy-950 dark:to-red-900/40 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100"
                : "bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-emerald-950/80 dark:via-navy-950 dark:to-teal-900/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100"
            }`} style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 blur-[60px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs uppercase font-black tracking-widest opacity-70">
                      Primary Inference
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-navy-950 text-white dark:bg-white dark:text-navy-950 uppercase tracking-widest shadow-sm">
                      Production Mode
                    </span>
                  </div>
                  <h3 className={`text-3xl sm:text-4xl font-black tracking-tight ${result.prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {result.prediction === "Fake" ? "Misinformation Flagged" : "Credible Content"}
                  </h3>
                </div>
                <div className={`p-4 rounded-2xl shadow-inner ${
                  result.prediction === "Fake" ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300"
                }`}>
                  <ShieldCheck size={32} />
                </div>
              </div>

              {/* Prediction details */}
              <div className="mt-8 space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3">
                  <span className="text-sm font-semibold opacity-70">Model Used</span>
                  <span className="text-sm font-black bg-white/60 dark:bg-navy-900/60 px-3 py-1 rounded-lg border border-navy-900/5 dark:border-white/5">{result.model}</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3">
                  <span className="text-sm font-semibold opacity-70">Classification</span>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg border shadow-sm ${
                    result.prediction === "Fake" 
                      ? "bg-red-500 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-500" 
                      : "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:text-white dark:border-emerald-500"
                  }`}>
                    {result.prediction}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3">
                  <span className="text-sm font-semibold opacity-70">Confidence Score</span>
                  <span className="text-lg font-black">{result.confidence}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3">
                  <span className="text-sm font-semibold opacity-70">Inference Speed</span>
                  <span className="text-sm font-bold font-mono bg-white/60 dark:bg-navy-900/60 px-3 py-1 rounded-lg border border-navy-900/5 dark:border-white/5">{result.inference_time}</span>
                </div>
                <div className="pt-3">
                  <span className="text-sm font-black block opacity-80 mb-2">Diagnostic Reason:</span>
                  <p className="text-sm opacity-90 leading-relaxed bg-white/60 dark:bg-navy-950/60 p-4 rounded-xl border border-navy-950/5 dark:border-white/5 shadow-inner">
                    {result.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explainable AI Card (Production) */}
          {result && result.mode === "production" && (
            <div className="glass-panel rounded-3xl p-8 border border-beige-200 dark:border-navy-700 animate-slideUp transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: '300ms' }}>
              <h3 className="text-sm font-black text-navy-950 dark:text-beige-100 uppercase tracking-widest mb-6 flex items-center space-x-2">
                <Sparkles size={18} className="text-gold-500 dark:text-gold-400" />
                <span>Explainable AI (XAI) Attribution</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-navy-600 dark:text-navy-300 block mb-3 uppercase tracking-wider">Top Attributed Linguistic Features:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-white to-beige-50 dark:from-navy-800 dark:to-navy-850 text-navy-900 dark:text-beige-50 rounded-full text-xs font-black uppercase tracking-wider border border-beige-200 dark:border-navy-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-navy-50/80 dark:bg-navy-900/60 rounded-2xl border border-navy-100 dark:border-navy-800 shadow-inner">
                  <p className="text-sm text-navy-800 dark:text-navy-200 leading-relaxed font-medium">
                    Attribution algorithms highlight linguistic triggers and emotional tags commonly matched in database patterns for sensationalized reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Research Mode Results Display */}
          {result && result.mode === "research" && (
            <div className={`rounded-3xl p-8 border shadow-xl transition-all duration-500 animate-slideUp hover:-translate-y-1 relative overflow-hidden group ${
              result.final_prediction === "Fake"
                ? "bg-gradient-to-br from-red-50 via-white to-red-100/50 dark:from-red-950/80 dark:via-navy-950 dark:to-red-900/40 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100"
                : "bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-emerald-950/80 dark:via-navy-950 dark:to-teal-900/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100"
            }`} style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 blur-[60px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs uppercase font-black tracking-widest opacity-70">
                      Consensus Outcome
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-gold-100 text-gold-800 dark:bg-gold-500/20 dark:text-gold-300 border border-gold-200 dark:border-gold-500/30 uppercase tracking-widest shadow-sm animate-pulse">
                      Research Mode
                    </span>
                  </div>
                  <h3 className={`text-3xl sm:text-4xl font-black tracking-tight ${result.final_prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {result.final_prediction === "Fake" ? "Misinformation Flagged" : "Credible Content"}
                  </h3>
                </div>
                <div className={`p-4 rounded-2xl shadow-inner ${
                  result.final_prediction === "Fake" ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300"
                }`}>
                  <ShieldCheck size={32} />
                </div>
              </div>

              {/* Prediction details */}
              <div className="mt-8 space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3 text-sm">
                  <span className="font-semibold opacity-70">Majority Voting Result</span>
                  <span className={`font-black uppercase px-3 py-1 rounded-lg border shadow-sm text-xs ${
                    result.majority_voting === "Fake" 
                      ? "bg-red-500 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-500" 
                      : "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:text-white dark:border-emerald-500"
                  }`}>
                    {result.majority_voting}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-navy-900/10 dark:border-white/10 pb-3 text-sm">
                  <span className="font-semibold opacity-70">Final Prediction</span>
                  <span className="font-black text-lg">{result.final_prediction}</span>
                </div>
                <div className="pt-3">
                  <span className="text-sm font-black block opacity-80 mb-2">Voting Consensus Statement:</span>
                  <p className="text-sm opacity-90 leading-relaxed bg-white/60 dark:bg-navy-950/60 p-4 rounded-xl border border-navy-950/5 dark:border-white/5 shadow-inner">
                    Consensus reached via <strong className="font-black">Majority Voting (2+ agreement)</strong>. BERT, DistilBERT, and RoBERTa models analyzed the text structure independently.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individual Transformer Model details card (Research) */}
          {result && result.mode === "research" && (
            <div className="glass-panel rounded-3xl p-8 border border-beige-200 dark:border-navy-700 animate-slideUp transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: '300ms' }}>
              <h3 className="text-sm font-black text-navy-950 dark:text-beige-100 uppercase tracking-widest mb-6">
                Model Classification Details
              </h3>

              <div className="space-y-6">
                {/* BERT bar */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-navy-900 dark:text-navy-100">BERT Transformer</span>
                    <span className={`font-black ${
                      result.bert.prediction === "Fake" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {result.bert.prediction} ({result.bert.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200/50 dark:bg-navy-950/50 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${
                        result.bert.prediction === "Fake" ? "bg-red-500 dark:bg-red-500" : "bg-emerald-500 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.bert.confidence}%` }}
                    />
                  </div>
                </div>

                {/* DistilBERT bar */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-navy-900 dark:text-navy-100">DistilBERT Model</span>
                    <span className={`font-black ${
                      result.distilbert.prediction === "Fake" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {result.distilbert.prediction} ({result.distilbert.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200/50 dark:bg-navy-950/50 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 delay-100 ${
                        result.distilbert.prediction === "Fake" ? "bg-red-500 dark:bg-red-500" : "bg-emerald-500 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.distilbert.confidence}%` }}
                    />
                  </div>
                </div>

                {/* RoBERTa bar */}
                <div className="space-y-2 group">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-navy-900 dark:text-navy-100">RoBERTa Model</span>
                    <span className={`font-black ${
                      result.roberta.prediction === "Fake" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {result.roberta.prediction} ({result.roberta.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200/50 dark:bg-navy-950/50 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 delay-200 ${
                        result.roberta.prediction === "Fake" ? "bg-red-500 dark:bg-red-500" : "bg-emerald-500 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.roberta.confidence}%` }}
                    />
                  </div>
                </div>

                {/* XGBoost bar */}
                {result.xgboost && (
                  <div className="space-y-2 group">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-navy-900 dark:text-navy-100">XGBoost ML</span>
                      <span className={`font-black ${
                        result.xgboost.prediction === "Fake" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {result.xgboost.prediction} ({result.xgboost.confidence}%)
                      </span>
                    </div>
                    <div className="w-full bg-beige-200/50 dark:bg-navy-950/50 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 delay-300 ${
                          result.xgboost.prediction === "Fake" ? "bg-red-500 dark:bg-red-500" : "bg-emerald-500 dark:bg-emerald-500"
                        }`}
                        style={{ width: `${result.xgboost.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Backend System Integration Status Card */}
          <div className="glass-panel rounded-3xl p-6 border border-beige-200 dark:border-navy-700 transition-all duration-300 hover:shadow-lg animate-slideUp" style={{ animationDelay: '400ms' }}>
            <h3 className="text-xs font-black text-navy-900 dark:text-beige-100 uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Server size={16} className="text-navy-600 dark:text-gold-400 animate-pulse" />
              <span>Backend Diagnostics Portal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Frontend item */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-navy-900/60 border border-beige-200/50 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">React Frontend</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider">
                  <Check size={12} className="mr-1" />
                  Completed
                </span>
              </div>

              {/* FastAPI gateway */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-navy-900/60 border border-beige-200/50 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">FastAPI Gateway</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider">
                  <Check size={12} className="mr-1" />
                  Ready
                </span>
              </div>

              {/* Python AI engine */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-navy-900/60 border border-beige-200/50 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">Python AI Engine</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider">
                  <Check size={12} className="mr-1" />
                  Connected
                </span>
              </div>

              {/* Inference Pipeline status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-navy-900/60 border border-beige-200/50 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">Model Inference</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 uppercase tracking-wider">
                  <Clock size={12} className="mr-1" />
                  Live
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default SingleAnalysis;
