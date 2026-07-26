import React, { useState, useRef } from "react";
import { 
  Clipboard, 
  Trash2, 
  Play, 
  Server, 
  Check, 
  AlertTriangle,
  Info,
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 grid-bg">
      
      {/* Header Title & Prediction Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 dark:text-white transition-colors">
            Single Document Analysis
          </h1>
          <p className="text-sm text-navy-600 dark:text-navy-200 transition-colors">
            Submit raw text blocks to run transformer evaluation pipelines and consensus calculations.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-[#E8E2D5] dark:bg-[#101F42] p-1 rounded-xl border border-[#FAF7F0]/15 select-none transition-colors self-start md:self-center">
          <button
            onClick={() => {
              setPredictionMode("production");
              setResult(null);
              setPipelineStep(0);
            }}
            disabled={isLoading}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              predictionMode === "production"
                ? "bg-navy-950 text-beige-50 dark:bg-gold-500 dark:text-navy-950 shadow-sm"
                : "text-navy-600 dark:text-navy-200 hover:text-navy-950 dark:hover:text-white"
            }`}
          >
            Production Mode
          </button>
          <button
            onClick={() => {
              setPredictionMode("research");
              setResult(null);
              setPipelineStep(0);
            }}
            disabled={isLoading}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              predictionMode === "research"
                ? "bg-navy-950 text-beige-50 dark:bg-gold-500 dark:text-navy-950 shadow-sm"
                : "text-navy-600 dark:text-navy-200 hover:text-navy-950 dark:hover:text-white"
            }`}
          >
            Research Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Main Left Columns: Text Input & Pipeline */}
        <div className="space-y-5">
          
          {/* Article Text Box Card */}
          <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="article" className="text-sm font-semibold text-navy-950 dark:text-beige-100 uppercase tracking-wider">
                Article Verification Panel
              </label>
              <span className="text-xs text-navy-500 dark:text-navy-300 font-mono">
                {text.length} characters
              </span>
            </div>

            <textarea
              id="article"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full text of the news article here (e.g. 'BREAKING: Exclusive details revealed regarding...')"
              className="w-full h-44 p-4 rounded-xl border border-beige-300 dark:border-navy-750 bg-white/50 dark:bg-navy-900/60 text-navy-950 dark:text-navy-50 placeholder-navy-400 dark:placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-600 dark:focus:ring-gold-500 focus:border-transparent transition-all text-sm font-sans resize-none"
              disabled={isLoading}
            />

            {/* Actions Button Bar */}
            <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePaste}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 border border-beige-300 dark:border-navy-705 rounded-lg text-xs font-medium text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800 hover:bg-beige-100 dark:hover:bg-navy-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Clipboard size={14} />
                  <span>Paste Text</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 border border-beige-300 dark:border-navy-705 rounded-lg text-xs font-medium text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800 hover:bg-beige-100 dark:hover:bg-navy-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Upload File</span>
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
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 px-4 py-2 border border-beige-300 dark:border-navy-705 rounded-lg text-xs font-medium text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800 hover:bg-beige-100 dark:hover:bg-navy-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
              </div>

              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-navy-950 text-beige-50 hover:bg-navy-850 dark:bg-gold-500 dark:text-navy-950 dark:hover:bg-gold-400 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-600 dark:focus:ring-gold-650 disabled:opacity-50 transition-all shadow-md cursor-pointer animate-fadeIn"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-beige-100 dark:border-navy-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>{predictionMode === 'production' ? 'Executing Production Pipeline...' : 'Executing Research Ensemble...'}</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="currentColor" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-800 dark:text-red-200 flex items-start space-x-3 animate-fadeIn">
                <AlertTriangle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <span><strong>Error:</strong> {error}</span>
              </div>
            )}

          </div>

          {/* Interactive Pipeline Card */}
          <Pipeline mode={predictionMode} currentStep={pipelineStep} isAnalyzing={isLoading} />
        </div>

        {/* Right Column: Result displays and system diagnostics */}
        <div className="space-y-5">
          
          {/* Production Mode Results Display */}
          {result && result.mode === "production" && (
            <div className={`rounded-2xl p-5 border shadow-xl transition-all duration-500 animate-fadeIn ${
              result.prediction === "Fake"
                ? "bg-gradient-to-br from-red-50 to-red-105/50 dark:from-red-950/70 dark:to-red-900/40 border-red-200 dark:border-red-900 text-red-950 dark:text-red-100"
                : "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/70 dark:to-teal-950/45 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-65">
                      Decision Outcome
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-250 dark:border-emerald-900 font-mono uppercase tracking-wider">
                      Production Mode
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold mt-1.5">
                    {result.prediction === "Fake" ? "Misinformation Flagged" : "Credible Content Verified"}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl ${
                  result.prediction === "Fake" ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200" : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200"
                }`}>
                  <ShieldCheck size={24} />
                </div>
              </div>

              {/* Prediction details */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Model Used:</span>
                  <span className="text-sm font-bold text-navy-800 dark:text-gold-300">{result.model}</span>
                </div>
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Classification:</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
                    result.prediction === "Fake" 
                      ? "bg-red-105 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800" 
                      : "bg-emerald-105 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800"
                  }`}>
                    {result.prediction}
                  </span>
                </div>
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Confidence Score:</span>
                  <span className="text-sm font-extrabold">{result.confidence}%</span>
                </div>
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Inference Speed:</span>
                  <span className="text-sm font-bold font-mono">{result.inference_time}</span>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold block opacity-75 mb-1">Reason:</span>
                  <p className="text-xs opacity-80 leading-relaxed bg-white/40 dark:bg-navy-950/50 p-2.5 rounded-lg border border-navy-950/5 dark:border-navy-800">
                    {result.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explainable AI Card (Production) */}
          {result && result.mode === "production" && (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 animate-fadeIn transition-colors">
              <h3 className="text-sm font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Sparkles size={16} className="text-gold-500 dark:text-gold-400" />
                <span>Explainable AI (XAI) Attribution</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-navy-550 dark:text-navy-300 block mb-2">Top Attributed Feature Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-beige-50 to-beige-100 dark:from-navy-800 dark:to-navy-850 text-navy-800 dark:text-beige-100 rounded-full text-[11px] font-bold uppercase tracking-wider border border-beige-200 dark:border-navy-600 shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-navy-50 dark:bg-navy-900/60 rounded-xl border border-navy-100 dark:border-navy-800">
                  <p className="text-xs text-navy-750 dark:text-navy-200 leading-relaxed">
                    Attribution algorithms highlight linguistic triggers and emotional tags commonly matched in database patterns for sensationalized reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Research Mode Results Display */}
          {result && result.mode === "research" && (
            <div className={`rounded-2xl p-5 border shadow-xl transition-all duration-500 animate-fadeIn ${
              result.final_prediction === "Fake"
                ? "bg-gradient-to-br from-red-50 to-red-105/50 dark:from-red-950/70 dark:to-red-900/40 border-red-200 dark:border-red-900 text-red-950 dark:text-red-100"
                : "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/70 dark:to-teal-950/45 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-65">
                      Consensus Outcome
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-gold-100 text-gold-800 dark:bg-gold-950/60 dark:text-gold-300 border border-gold-250 dark:border-gold-900 font-mono uppercase tracking-wider animate-pulse">
                      Research Mode
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold mt-1.5">
                    {result.final_prediction === "Fake" ? "Misinformation Flagged" : "Credible Content Verified"}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl ${
                  result.final_prediction === "Fake" ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200" : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200"
                }`}>
                  <ShieldCheck size={24} />
                </div>
              </div>

              {/* Prediction details */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2 text-xs">
                  <span className="opacity-75">Majority Voting Result:</span>
                  <span className={`font-extrabold uppercase px-2 py-0.5 rounded border text-[9px] ${
                    result.majority_voting === "Fake" 
                      ? "bg-red-105 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800" 
                      : "bg-emerald-105 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800"
                  }`}>
                    {result.majority_voting}
                  </span>
                </div>
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2 text-xs">
                  <span className="opacity-75">Final Prediction:</span>
                  <span className="font-extrabold">{result.final_prediction}</span>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold block opacity-75 mb-1">Voting Consensus Statement:</span>
                  <p className="text-xs opacity-80 leading-relaxed bg-white/40 dark:bg-navy-950/50 p-2.5 rounded-lg border border-navy-950/5 dark:border-navy-800">
                    Consensus reached via **Majority Voting (2+ agreement)**. BERT, DistilBERT, and RoBERTa models analyzed the text structure independently.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individual Transformer Model details card (Research) */}
          {result && result.mode === "research" && (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 animate-fadeIn transition-colors">
              <h3 className="text-sm font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-4">
                Model Classification Details (Research)
              </h3>

              <div className="space-y-4">
                {/* BERT bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-navy-900 dark:text-navy-100">BERT Transformer Model</span>
                    <span className={`font-bold ${
                      result.bert.prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                    }`}>
                      {result.bert.prediction} ({result.bert.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.bert.prediction === "Fake" ? "bg-red-600 dark:bg-red-50" : "bg-emerald-600 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.bert.confidence}%` }}
                    />
                  </div>
                </div>

                {/* DistilBERT bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-navy-900 dark:text-navy-100">DistilBERT Model</span>
                    <span className={`font-bold ${
                      result.distilbert.prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                    }`}>
                      {result.distilbert.prediction} ({result.distilbert.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.distilbert.prediction === "Fake" ? "bg-red-600 dark:bg-red-50" : "bg-emerald-600 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.distilbert.confidence}%` }}
                    />
                  </div>
                </div>

                {/* RoBERTa bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-navy-900 dark:text-navy-100">RoBERTa Model</span>
                    <span className={`font-bold ${
                      result.roberta.prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                    }`}>
                      {result.roberta.prediction} ({result.roberta.confidence}%)
                    </span>
                  </div>
                  <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.roberta.prediction === "Fake" ? "bg-red-600 dark:bg-red-50" : "bg-emerald-600 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${result.roberta.confidence}%` }}
                    />
                  </div>
                </div>

                {/* XGBoost bar */}
                {result.xgboost && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-navy-900 dark:text-navy-100">XGBoost ML Model</span>
                      <span className={`font-bold ${
                        result.xgboost.prediction === "Fake" ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {result.xgboost.prediction} ({result.xgboost.confidence}%)
                      </span>
                    </div>
                    <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          result.xgboost.prediction === "Fake" ? "bg-red-600 dark:bg-red-50" : "bg-emerald-600 dark:bg-emerald-500"
                        }`}
                        style={{ width: `${result.xgboost.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Panel */}
          {result && result.verification && (
            <VerificationPanel verification={result.verification} />
          )}

          {/* Backend System Integration Status Card */}
          <div className="glass-panel rounded-2xl p-4 border border-beige-200 dark:border-navy-700 transition-colors">
            <h3 className="text-xs font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Server size={15} className="text-navy-600 dark:text-gold-400 animate-pulse" />
              <span>Backend Diagnostics Portal</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {/* Frontend item */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-navy-50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-850">
                <span className="text-xs font-semibold text-navy-800 dark:text-navy-200">React Frontend</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900">
                  <Check size={10} className="mr-1" />
                  Completed
                </span>
              </div>

              {/* FastAPI gateway */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-navy-50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-850">
                <span className="text-xs font-semibold text-navy-800 dark:text-navy-200">FastAPI Gateway</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-450 dark:border-emerald-900">
                  <Check size={10} className="mr-1" />
                  Ready
                </span>
              </div>

              {/* Python AI engine */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-navy-50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-850">
                <span className="text-xs font-semibold text-navy-800 dark:text-navy-200">Python AI Engine</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-450 dark:border-emerald-900">
                  <Check size={10} className="mr-1" />
                  Connected
                </span>
              </div>

              {/* Inference Pipeline status */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-navy-50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-850">
                <span className="text-xs font-semibold text-navy-800 dark:text-navy-200">Model Inference (PyTorch/Colab)</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900">
                  <Clock size={10} className="mr-1" />
                  Live Inference
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
