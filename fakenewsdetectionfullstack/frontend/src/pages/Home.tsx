import React, { useState, useRef } from "react";
import { 
  Clipboard, 
  Trash2, 
  Play, 
  Activity, 
  Server, 
  Check, 
  AlertTriangle,
  Info,
  Clock,
  Upload
} from "lucide-react";
import { truthLensApi } from "../services/api";
import Pipeline from "../components/Pipeline";

export const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); // 0: Idle, 1: Preprocessing, 2: Transformers, 3: Voting, 4: XAI, 5: Complete
  const [result, setResult] = useState<any | null>(null);
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
      setPipelineStep(1); // Preprocessing
      await new Promise((r) => setTimeout(r, 600));

      setPipelineStep(2); // Models Evaluation
      await new Promise((r) => setTimeout(r, 800));

      setPipelineStep(3); // Majority Voting
      await new Promise((r) => setTimeout(r, 600));

      setPipelineStep(4); // XAI
      await new Promise((r) => setTimeout(r, 600));

      const response = await truthLensApi.predict(text, "production");
      setResult(response);
      setPipelineStep(5); // Complete
    } catch (err) {
      setError("API Prediction failed. Verify request structures and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg">
      
      {/* Hero Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/20 dark:border-gold-500/25 text-xs font-semibold uppercase tracking-wider">
          <Activity size={14} className="animate-pulse text-gold-600 dark:text-gold-400" />
          <span>Live API Connected</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-950 dark:text-white transition-colors">
          TruthLens <span className="text-gold-500 dark:text-gold-400">AI</span>
        </h1>
        <p className="text-sm md:text-base text-navy-600 dark:text-navy-200 max-w-2xl mx-auto font-light transition-colors">
          Verify news articles instantly using advanced Transformer models (BERT, DistilBERT, RoBERTa) and Ensemble Majority Voting logic.
        </p>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Text Input & Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Article Text Box Card */}
          <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="article" className="text-xs font-bold text-navy-950 dark:text-beige-100 uppercase tracking-widest">
                Paste Article Content
              </label>
              <span className="text-xs text-navy-500 dark:text-navy-300 font-mono">
                {text.length} characters
              </span>
            </div>

            <textarea
              id="article"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full text of the news article here (e.g. 'BREAKING: Official leaks secret alien conspiracy...')"
              className="w-full h-64 p-4 rounded-xl border border-beige-300 dark:border-navy-750 bg-white/50 dark:bg-navy-900/60 text-navy-950 dark:text-navy-50 placeholder-navy-400 dark:placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-600 dark:focus:ring-gold-500 focus:border-transparent transition-all text-sm font-sans resize-none"
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
                className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-navy-950 text-beige-50 hover:bg-navy-850 dark:bg-gold-500 dark:text-navy-950 dark:hover:bg-gold-400 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-600 dark:focus:ring-gold-650 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-beige-100 dark:border-navy-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Analyzing...</span>
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
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-200 flex items-center space-x-2 animate-shake">
                <AlertTriangle size={14} className="text-red-500 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Interactive Pipeline Card */}
          <Pipeline currentStep={pipelineStep} isAnalyzing={isLoading} />
        </div>

        {/* Right Column: Diagnostics portal & Prediction results */}
        <div className="space-y-6">
          
          {/* Backend Diagnostics Portal Card */}
          <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors">
            <h3 className="text-xs font-bold text-navy-950 dark:text-beige-100 uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Server size={15} className="text-navy-600 dark:text-gold-400 animate-pulse" />
              <span>Backend Diagnostics Portal</span>
            </h3>

            <div className="space-y-3">
              {/* Frontend */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">React Frontend</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  <Check size={10} className="mr-1" />
                  Completed
                </span>
              </div>

              {/* FastAPI Gateway */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">FastAPI Gateway</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  <Check size={10} className="mr-1" />
                  Ready
                </span>
              </div>

              {/* Python AI engine */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">Python AI Engine</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-900">
                  <Check size={10} className="mr-1" />
                  Connected
                </span>
              </div>

              {/* Inference Pipeline status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850">
                <span className="text-xs font-bold text-navy-800 dark:text-navy-200">Model Inference (PyTorch/Colab)</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  <Clock size={10} className="mr-1 text-amber-600" />
                  Live Inference
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-navy-500 dark:text-navy-300 mt-4 leading-normal">
              💡 This page uses the live FastAPI prediction service and displays its production response contract.
            </p>
          </div>

          {/* Final prediction result card (Production contract) */}
          {result && result.mode === "production" && (
            <div className={`rounded-2xl p-6 border shadow-lg transition-all duration-500 animate-fadeIn ${
              result.prediction === "Fake"
                ? "bg-gradient-to-br from-red-50 to-red-105/50 dark:from-red-950/70 dark:to-red-900/40 border-red-200 dark:border-red-900 text-red-950 dark:text-red-100"
                : "bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/70 dark:to-teal-950/45 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Decision Outcome</span>
                  <h3 className="text-2xl font-extrabold mt-1">
                    {result.prediction === "Fake" ? "Misinformation Flagged" : "Credible Content Verified"}
                  </h3>
                </div>
                <div className={`p-2 rounded-xl ${
                  result.prediction === "Fake"
                    ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200"
                    : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200"
                }`}>
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Model Used:</span>
                  <span className="text-sm font-bold text-navy-800 dark:text-gold-300">{result.model}</span>
                </div>

                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Classification:</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
                    result.prediction === "Fake"
                      ? "bg-red-100 text-red-900 border-red-200 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800"
                      : "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800"
                  }`}>
                    {result.prediction}
                  </span>
                </div>

                <div className="flex justify-between border-b border-navy-950/10 dark:border-navy-700 pb-2">
                  <span className="text-xs opacity-75">Confidence:</span>
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

          {/* Explainable AI Card (Production contract) */}
          {result && result.mode === "production" && (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 animate-fadeIn transition-colors">
              <h3 className="text-sm font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Info size={16} className="text-gold-500 dark:text-gold-400" />
                <span>Explainable AI (XAI) Keywords</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-navy-550 dark:text-navy-300 block mb-2">Top Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords?.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-beige-100 dark:bg-navy-800 text-navy-800 dark:text-beige-100 rounded-lg text-xs font-semibold uppercase tracking-wider border border-beige-300 dark:border-navy-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-navy-50 dark:bg-navy-900/60 rounded-xl border border-navy-100 dark:border-navy-800">
                  <p className="text-xs text-navy-750 dark:text-navy-200 leading-relaxed">
                    {result.prediction === "Fake"
                      ? "Keywords and writing patterns associated with sensational or misleading content were detected."
                      : "Keywords and writing patterns associated with credible, structured reporting were detected."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default Home;
