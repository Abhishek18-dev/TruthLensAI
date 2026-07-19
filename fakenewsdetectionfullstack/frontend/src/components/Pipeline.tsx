import React from "react";
import { 
  FileText, 
  Settings2, 
  Binary, 
  GitMerge, 
  Eye, 
  CheckCircle,
  ArrowRight,
  ArrowDown
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
      subtitle: "Tokenization & Clean",
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
      title: "Prediction",
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
      subtitle: "Tokenization & Clean",
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
      title: "Majority Voting",
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
      title: "Prediction",
      subtitle: "Classification",
      icon: CheckCircle,
      phase: 7,
    },
  ];

  const steps = mode === "production" ? productionSteps : researchSteps;
  const completedTarget = mode === "production" ? 4 : 7;

  return (
    <div className="glass-panel rounded-2xl p-6 glow-navy border border-beige-200 dark:border-navy-700 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-navy-950 dark:text-white">AI Processing Pipeline</h3>
          <p className="text-sm text-navy-600 dark:text-navy-200">
            Real-time representation of model execution sequence.
          </p>
        </div>
        {isAnalyzing && (
          <span className="mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold-950/60 text-gold-400 animate-pulse border border-gold-900">
            Running Models ({mode === "production" ? "RoBERTa only" : "All Transformers"})...
          </span>
        )}
      </div>

      {/* Pipeline Grid/Flow */}
      <div className={`grid grid-cols-1 ${mode === "production" ? "md:grid-cols-5" : "md:grid-cols-8"} gap-2 relative`}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          
          // Determine status of the step
          let isCompleted = currentStep > step.phase;
          let isActive = isAnalyzing && currentStep === step.phase;

          if (!isAnalyzing && currentStep === completedTarget + 1) {
            isCompleted = true;
          }

          return (
            <React.Fragment key={step.id}>
              {/* Step Card */}
              <div 
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-500 border ${
                  isActive
                    ? "bg-gold-50 dark:bg-navy-950 border-gold-500 dark:border-gold-400 text-gold-950 dark:text-beige-50 shadow-md scale-105"
                    : isCompleted
                    ? "bg-beige-100 dark:bg-navy-900 border-beige-200 dark:border-navy-800 text-navy-900 dark:text-navy-100"
                    : "bg-beige-50/50 dark:bg-navy-950/40 border-beige-200 dark:border-navy-850 text-navy-600 dark:text-navy-300 opacity-60"
                }`}
              >
                <div 
                  className={`p-2.5 rounded-xl mb-2 transition-colors ${
                    isActive
                      ? "bg-gold-500 text-white dark:text-navy-950 animate-bounce"
                      : isCompleted
                      ? "bg-gold-500/10 text-gold-700 dark:bg-navy-750 dark:text-beige-100"
                      : "bg-beige-200 text-navy-500 dark:bg-navy-800 dark:text-navy-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                
                <h4 className="text-xs font-bold text-center">{step.title}</h4>
                <p className="text-[9px] text-center mt-0.5 opacity-85">{step.subtitle}</p>
                
                {/* Step number label */}
                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold opacity-30">
                  0{step.id}
                </span>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-navy-450 dark:text-navy-650">
                  <ArrowRight 
                    size={12} 
                    className={`${
                      isCompleted && isAnalyzing 
                        ? "text-gold-500 animate-pulse" 
                        : "opacity-40"
                    }`} 
                  />
                </div>
              )}

              {/* Arrow Connector for Mobile */}
              {idx < steps.length - 1 && (
                <div className="flex md:hidden items-center justify-center py-1 text-navy-450 dark:text-navy-650">
                  <ArrowDown 
                    size={12} 
                    className={`${
                      isCompleted && isAnalyzing 
                        ? "text-gold-500 animate-pulse" 
                        : "opacity-40"
                    }`} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Under-pipeline detail logs (simulating state progress text) */}
      <div className="mt-6 bg-navy-950 rounded-xl p-4 text-xs font-mono text-beige-300 border border-navy-800 h-24 overflow-y-auto">
        <p className="text-gold-400 font-bold mb-1">▶ SYSTEM LOGS:</p>
        {!isAnalyzing && currentStep === 0 && (
          <p className="text-beige-400">System idle. Ready to analyze news article text...</p>
        )}
        {isAnalyzing && currentStep === 1 && (
          <p className="text-beige-300 animate-pulse">
            [PREPROCESSING] Cleaning text corpus, removing stop words, loading tokenizer...
          </p>
        )}
        {mode === "production" ? (
          <>
            {isAnalyzing && currentStep === 2 && (
              <p className="text-beige-300 animate-pulse">[MODEL] Forwarding RoBERTa embedding matrix layer weights...</p>
            )}
            {isAnalyzing && currentStep === 3 && (
              <p className="text-beige-300 animate-pulse">[XAI EXPLANATION] Running attribution algorithm to extract keyword triggers...</p>
            )}
          </>
        ) : (
          <>
            {isAnalyzing && currentStep === 2 && (
              <p className="text-beige-300 animate-pulse">[MODEL 1] Evaluating BERT transformer model on sequence...</p>
            )}
            {isAnalyzing && currentStep === 3 && (
              <p className="text-beige-300 animate-pulse">[MODEL 2] Running DistilBERT token evaluations...</p>
            )}
            {isAnalyzing && currentStep === 4 && (
              <p className="text-beige-300 animate-pulse">[MODEL 3] Forwarding RoBERTa embedding matrix layer weights...</p>
            )}
            {isAnalyzing && currentStep === 5 && (
              <p className="text-beige-300 font-bold text-gold-400 animate-pulse">
                [VOTING] Aggregating results. Evaluating consensus with Majority Voting...
              </p>
            )}
            {isAnalyzing && currentStep === 6 && (
              <p className="text-beige-300 animate-pulse">
                [XAI EXPLANATION] Running SHAP/LIME feature attributions to fetch keywords...
              </p>
            )}
          </>
        )}
        {!isAnalyzing && currentStep === completedTarget + 1 && (
          <p className="text-emerald-450 font-semibold">
            [SUCCESS] Analysis completed. Final result loaded and verified.
          </p>
        )}
      </div>
    </div>
  );
};
export default Pipeline;
