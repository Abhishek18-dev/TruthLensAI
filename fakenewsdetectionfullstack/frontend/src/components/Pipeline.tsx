import React from "react";
import { 
  FileText, 
  Settings2, 
  Binary, 
  GitMerge, 
  Eye, 
  CheckCircle,
  ArrowRight,
  Search,
  Database,
  ShieldCheck
} from "lucide-react";

interface PipelineProps {
  currentStep: number;
  isAnalyzing: boolean;
  mode?: "production" | "research";
}

export const Pipeline: React.FC<PipelineProps> = ({ currentStep, isAnalyzing, mode = "production" }) => {
  const productionSteps = [
    {
      id: 1,
      title: "Input",
      subtitle: "Raw Article",
      icon: FileText,
      phase: 0,
    },
    {
      id: 2,
      title: "Preprocessing",
      subtitle: "Tokenization",
      icon: Settings2,
      phase: 1,
    },
    {
      id: 3,
      title: "RoBERTa",
      subtitle: "Primary Model",
      icon: Binary,
      phase: 2,
    },
    {
      id: 4,
      title: "Explainable AI",
      subtitle: "XAI Keywords",
      icon: Eye,
      phase: 3,
    },
    {
      id: 5,
      title: "Tavily Search",
      subtitle: "Query Gen",
      icon: Search,
      phase: 3,
    },
    {
      id: 6,
      title: "Evidence",
      subtitle: "Retrieval",
      icon: Database,
      phase: 3,
    },
    {
      id: 7,
      title: "Verification",
      subtitle: "Gemini AI",
      icon: ShieldCheck,
      phase: 3,
    },
    {
      id: 8,
      title: "Final Verdict",
      subtitle: "Classification",
      icon: CheckCircle,
      phase: 4,
    },
  ];

  const researchSteps = [
    {
      id: 1,
      title: "Input",
      subtitle: "Raw Article",
      icon: FileText,
      phase: 0,
    },
    {
      id: 2,
      title: "Preprocessing",
      subtitle: "Tokenization",
      icon: Settings2,
      phase: 1,
    },
    {
      id: 3,
      title: "BERT",
      subtitle: "Transformer 1",
      icon: Binary,
      phase: 2,
    },
    {
      id: 4,
      title: "DistilBERT",
      subtitle: "Transformer 2",
      icon: Binary,
      phase: 3,
    },
    {
      id: 5,
      title: "RoBERTa",
      subtitle: "Transformer 3",
      icon: Binary,
      phase: 4,
    },
    {
      id: 6,
      title: "Voting",
      subtitle: "Ensemble Logic",
      icon: GitMerge,
      phase: 5,
    },
    {
      id: 7,
      title: "Explainable AI",
      subtitle: "XAI Keywords",
      icon: Eye,
      phase: 6,
    },
    {
      id: 8,
      title: "Tavily Search",
      subtitle: "Query Gen",
      icon: Search,
      phase: 6,
    },
    {
      id: 9,
      title: "Evidence",
      subtitle: "Retrieval",
      icon: Database,
      phase: 6,
    },
    {
      id: 10,
      title: "Verification",
      subtitle: "Gemini AI",
      icon: ShieldCheck,
      phase: 6,
    },
    {
      id: 11,
      title: "Verdict",
      subtitle: "Classification",
      icon: CheckCircle,
      phase: 7,
    },
  ];

  const steps = mode === "production" ? productionSteps : researchSteps;
  const completedTarget = mode === "production" ? 4 : 7;

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 bg-[#FAF7F0]/80 dark:bg-[#0A1128]/80 backdrop-blur-xl border border-[#E8E2D5] dark:border-[#1B2A4A] shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">AI Processing Pipeline</h3>
          <p className="text-sm text-[#1A2536]/70 dark:text-[#F4EFE6]/60 mt-1">
            Real-time execution sequence and agentic reasoning
          </p>
        </div>
        {isAnalyzing && (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-[#C5A880]/10 text-[#9A7B56] dark:text-[#C5A880] animate-pulse border border-[#C5A880]/20 shadow-[0_0_15px_rgba(197,168,128,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] mr-2 animate-ping"></span>
            Running Models ({mode === "production" ? "RoBERTa only" : "All Transformers"})...
          </span>
        )}
      </div>

      {/* Pipeline Grid/Flow */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${mode === "production" ? "lg:grid-cols-8" : "lg:grid-cols-11"} gap-3 relative`}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          
          let isCompleted = currentStep > step.phase;
          let isActive = isAnalyzing && currentStep === step.phase;

          if (!isAnalyzing && currentStep === completedTarget + 1) {
            isCompleted = true;
          }

          return (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <div 
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-500 border ${
                  isActive
                    ? "bg-white dark:bg-[#101F42] border-[#C5A880] text-[#1A2536] dark:text-[#F4EFE6] shadow-[0_0_20px_rgba(197,168,128,0.2)] scale-105 z-10"
                    : isCompleted
                    ? "bg-[#FAF7F0] dark:bg-[#101F42]/40 border-[#E8E2D5] dark:border-[#1B2A4A] text-[#1A2536] dark:text-[#F4EFE6]"
                    : "bg-transparent border-dashed border-[#E8E2D5] dark:border-[#1B2A4A] text-[#1A2536]/40 dark:text-[#F4EFE6]/40"
                }`}
              >
                <div 
                  className={`p-3 rounded-xl mb-3 transition-colors duration-500 relative ${
                    isActive
                      ? "bg-[#C5A880] text-white shadow-lg animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                      : isCompleted
                      ? "bg-[#C5A880]/10 text-[#C5A880]"
                      : "bg-[#E8E2D5]/50 dark:bg-[#1B2A4A]/50 text-current"
                  }`}
                >
                  <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                  {isCompleted && !isActive && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-[#0A1128]">
                      <CheckCircle size={10} className="stroke-[3]" />
                    </div>
                  )}
                </div>
                
                <h4 className="text-sm font-bold text-center tracking-tight leading-tight">{step.title}</h4>
                <p className="text-[10px] text-center mt-1 opacity-70 font-medium">{step.subtitle}</p>
                
                <span className={`absolute top-2 right-2 text-[10px] font-bold ${isActive ? 'opacity-100 text-[#C5A880]' : 'opacity-20'}`}>
                  0{step.id}
                </span>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center -mx-1 z-0">
                  <ArrowRight 
                    size={14} 
                    className={`transition-all duration-500 ${
                      isCompleted && isAnalyzing 
                        ? "text-[#C5A880] animate-pulse" 
                        : isCompleted && !isAnalyzing
                        ? "text-[#C5A880]/50"
                        : "text-[#E8E2D5] dark:text-[#1B2A4A]"
                    }`} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Under-pipeline detail logs */}
      <div className="mt-8 rounded-2xl overflow-hidden border border-[#1B2A4A]/50 dark:border-[#1B2A4A] shadow-inner bg-[#0A1128] relative group">
        <div className="flex items-center px-4 py-2 border-b border-[#1B2A4A] bg-[#0A1128]/80 backdrop-blur">
          <div className="flex space-x-2 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <p className="text-[10px] font-mono text-[#F4EFE6]/40 tracking-wider">SYSTEM_TERMINAL</p>
        </div>
        <div className="p-5 text-xs font-mono text-[#F4EFE6]/80 h-32 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-[#1B2A4A]">
          <p className="text-[#C5A880] font-bold mb-3 flex items-center">
            <span className="mr-2">❯</span> STARTING ANALYSIS PIPELINE
          </p>
          {!isAnalyzing && currentStep === 0 && (
            <p className="text-[#F4EFE6]/50">System idle. Ready to analyze news article text...</p>
          )}
          {isAnalyzing && currentStep === 1 && (
            <p className="text-green-400/90 flex items-center">
              <span className="animate-spin mr-2">◒</span> [PREPROCESSING] Cleaning text corpus, loading tokenizer...
            </p>
          )}
          {mode === "production" ? (
            <>
              {isAnalyzing && currentStep === 2 && (
                <p className="text-green-400/90 flex items-center">
                  <span className="animate-spin mr-2">◒</span> [MODEL] Forwarding RoBERTa embedding matrix weights...
                </p>
              )}
              {isAnalyzing && currentStep === 3 && (
                <>
                  <p className="text-green-400/90">[XAI] Running attribution algorithm...</p>
                  <p className="text-[#C5A880]">[TAVILY] Generating search queries for verification...</p>
                  <p className="text-[#C5A880]">[EVIDENCE] Retrieving trusted sources...</p>
                  <p className="text-blue-400/90 flex items-center">
                    <span className="animate-pulse mr-2">●</span> [GEMINI] Analyzing evidence for final verdict...
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              {isAnalyzing && currentStep === 2 && (
                <p className="text-green-400/90 flex items-center"><span className="animate-spin mr-2">◒</span> [MODEL 1] Evaluating BERT transformer model on sequence...</p>
              )}
              {isAnalyzing && currentStep === 3 && (
                <p className="text-green-400/90 flex items-center"><span className="animate-spin mr-2">◒</span> [MODEL 2] Running DistilBERT token evaluations...</p>
              )}
              {isAnalyzing && currentStep === 4 && (
                <p className="text-green-400/90 flex items-center"><span className="animate-spin mr-2">◒</span> [MODEL 3] Forwarding RoBERTa embedding matrix weights...</p>
              )}
              {isAnalyzing && currentStep === 5 && (
                <p className="text-[#C5A880] font-bold flex items-center">
                  <span className="animate-pulse mr-2">●</span> [VOTING] Aggregating results. Evaluating consensus...
                </p>
              )}
              {isAnalyzing && currentStep === 6 && (
                <>
                  <p className="text-green-400/90">[XAI] Running SHAP/LIME feature attributions...</p>
                  <p className="text-[#C5A880]">[TAVILY] Generating search queries...</p>
                  <p className="text-[#C5A880]">[EVIDENCE] Retrieving trusted sources...</p>
                  <p className="text-blue-400/90 flex items-center">
                    <span className="animate-pulse mr-2">●</span> [GEMINI] Analyzing evidence for final verdict...
                  </p>
                </>
              )}
            </>
          )}
          {!isAnalyzing && currentStep === completedTarget + 1 && (
            <p className="text-green-400 font-bold mt-2 flex items-center">
              <CheckCircle size={14} className="mr-2" /> [SUCCESS] Analysis completed. Final result loaded and verified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Pipeline;
