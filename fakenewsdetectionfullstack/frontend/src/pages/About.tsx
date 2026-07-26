import React from "react";
import { 
  Database, 
  Cpu, 
  FileText, 
  Layers, 
  HelpCircle,
  Sparkles,
  Link2,
  MessageSquare,
  Network
} from "lucide-react";

export const About: React.FC = () => {
  const mlModels = [
    { name: "XGBoost", description: "eXtreme Gradient Boosting model optimizing tree ensembles with regularized gradient learning for structural tabular classification." },
    { name: "Random Forest", description: "Ensemble classification algorithm evaluating bagging decision trees for vocabulary tree splits." },
    { name: "Linear SVM", description: "Support Vector Machines optimizing margins to isolate linear hyperplane divisions between fake and authentic vocabularies." },
  ];

  const transformerModels = [
    { name: "BERT", description: "Bidirectional Encoder Representations from Transformers. Captures bidirectional contextual meanings of tokens in natural text sequences.", tag: "Primary Classifier" },
    { name: "DistilBERT", description: "A distilled, lightweight variant of BERT that is 40% smaller and 60% faster, while retaining 97% of BERT's original language capability.", tag: "Fast Inference" },
    { name: "RoBERTa", description: "A robustly optimized BERT approach. Trained longer with larger batch sizes and dynamic token masking configuration.", tag: "Highest Accuracy" },
  ];

  const futureScopes = [
    { title: "FastAPI Database Engine", description: "Integrate relational databases (SQLite/PostgreSQL) with SQLAlchemy ORM to save prediction histories permanently.", icon: Database },
    { title: "Explainable AI (SHAP/LIME)", description: "Implement local visual heatmaps marking specific tokens with high gradients contributing directly to the prediction output.", icon: Network },
    { title: "URL Verification Agent", description: "Add scrapers utilizing BeautifulSoup/Scrapy to extract news text directly from user-submitted website links.", icon: Link2 },
    { title: "PDF Document verification", description: "Allow users to upload PDFs, scan raw text blocks, and evaluate documents in batches.", icon: FileText },
    { title: "Retrieval-Augmented Generation (RAG)", description: "Validate articles against real-time fact databases like Wikipedia, Snopes, or Google Fact Check API using vector databases.", icon: Sparkles },
    { title: "AI Fact-Checking Chatbot", description: "Interactive chatbot interface enabling users to query specific claims and receive references for news statements.", icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 grid-bg animate-slideUp">
      
      {/* Project Banner Header */}
      <div className="glass-panel-dark text-beige-100 rounded-3xl p-10 lg:p-12 border border-navy-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 glow-gold shadow-2xl">
        <div className="absolute inset-0 grid-bg-dark opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="space-y-4 max-w-3xl relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gold-500/10 text-gold-400 border border-gold-500/30">
            Enterprise Verification System
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-beige-50 tracking-tight">TruthLens AI</h1>
          <p className="text-base sm:text-lg text-beige-300/90 leading-relaxed font-medium">
            An advanced software system implementing ensemble machine learning models and deep bidirectionally-trained language transformers (BERT) to classify news credibility. The frontend and backend architectures are decoupled to facilitate smooth deployment configurations.
          </p>
        </div>
        
        <div className="relative z-10 bg-gradient-to-tr from-gold-500 to-gold-300 text-navy-950 p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center w-40 h-40 border-4 border-navy-900 shrink-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <span className="text-4xl font-black">WEL</span>
          <span className="text-sm font-extrabold tracking-widest uppercase mt-1">Fake</span>
          <div className="mt-3 bg-navy-950/10 px-3 py-1 rounded-full">
            <span className="text-[10px] text-navy-900 font-bold font-mono">72,134 Articles</span>
          </div>
        </div>
      </div>

      {/* Dataset & Models Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-children">
        
        {/* Left Column: Dataset Details */}
        <div className="glass-panel rounded-3xl p-8 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors card-hover">
          <div className="flex items-center space-x-4 text-navy-950 dark:text-white">
            <div className="p-3 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200 shadow-sm">
              <Database size={24} />
            </div>
            <h2 className="text-2xl font-extrabold">Dataset Details (WELFake)</h2>
          </div>
          
          <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed font-medium transition-colors">
            TruthLens AI models are evaluated against the benchmark <strong className="text-navy-900 dark:text-white">WELFake Dataset</strong> compiled for academic studies. It contains <strong className="text-navy-900 dark:text-white">72,134 news entries</strong>:
          </p>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-2xl transition-colors text-center space-y-1">
              <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 block uppercase tracking-widest">Fake News Class</span>
              <span className="text-3xl font-black text-red-700 dark:text-red-500 block">37,102</span>
              <span className="text-[10px] font-medium text-red-500 dark:text-red-400 block">Labeled Misinformation</span>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl transition-colors text-center space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase tracking-widest">Real News Class</span>
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-500 block">35,032</span>
              <span className="text-[10px] font-medium text-emerald-500 dark:text-emerald-400 block">Labeled Authentic Reports</span>
            </div>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed font-medium transition-colors">
            By training models on balanced news corpuses containing both political opinion columns, standard media dispatches, and online blogs, the classifier reaches robust accuracy rates, avoiding overfitting.
          </p>
        </div>

        {/* Right Column: Traditional Machine Learning Models */}
        <div className="glass-panel rounded-3xl p-8 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors card-hover">
          <div className="flex items-center space-x-4 text-navy-950 dark:text-white">
            <div className="p-3 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200 shadow-sm">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl font-extrabold">Traditional ML Models</h2>
          </div>
          
          <div className="space-y-4 pt-2">
            {mlModels.map((model) => (
              <div key={model.name} className="p-4 bg-beige-50 dark:bg-navy-900/50 border border-beige-200 dark:border-navy-800 rounded-2xl transition-colors hover:bg-beige-100 dark:hover:bg-navy-800 group">
                <h3 className="text-sm font-extrabold text-gold-600 dark:text-gold-400 uppercase tracking-widest group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">{model.name}</h3>
                <p className="text-xs font-medium text-navy-600 dark:text-navy-300 mt-2 leading-relaxed transition-colors">{model.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transformer Models Section */}
      <div className="glass-panel rounded-3xl p-8 border border-beige-200 dark:border-navy-700 glow-navy space-y-8 transition-colors">
        <div className="flex items-center space-x-4 text-navy-950 dark:text-white mb-2">
          <div className="p-3 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200 shadow-sm">
            <Cpu size={24} />
          </div>
          <h2 className="text-2xl font-extrabold">Deep Transformer Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-navy-50/70 dark:bg-navy-900/60 border border-beige-200 dark:border-navy-800 rounded-2xl space-y-3 card-hover">
            <span className="inline-flex px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              Production Deployment
            </span>
            <h3 className="text-lg font-black text-navy-950 dark:text-white">RoBERTa Classifier</h3>
            <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed font-medium">
              For live production audits, the system bypasses secondary classifiers to optimize execution speed. It runs exclusively on the robustly optimized <strong className="text-navy-900 dark:text-white">RoBERTa</strong> language transformer, our best-performing model with <strong className="text-navy-900 dark:text-white">97.9% accuracy</strong>.
            </p>
          </div>
          <div className="p-6 bg-navy-50/70 dark:bg-navy-900/60 border border-beige-200 dark:border-navy-800 rounded-2xl space-y-3 card-hover">
            <span className="inline-flex px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 border border-gold-200 dark:border-gold-900">
              Research Mode
            </span>
            <h3 className="text-lg font-black text-navy-950 dark:text-white">Consensus & Majority Voting</h3>
            <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed font-medium">
              Designed for academic and comparison studies. Enables parallel evaluations across <strong className="text-navy-900 dark:text-white">BERT, DistilBERT, and RoBERTa</strong> transformers. Computes a consensus prediction dynamically using an ensemble <strong className="text-navy-900 dark:text-white">Majority Voting</strong> protocol.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children pt-2">
          {transformerModels.map((model) => (
            <div key={model.name} className="flex flex-col justify-between p-6 bg-white/60 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-800 rounded-2xl hover:border-gold-400 dark:hover:border-gold-500/50 transition-all shadow-sm relative group card-hover">
              <div className="space-y-3">
                <span className="inline-flex px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-900 absolute top-4 right-4 transition-colors group-hover:bg-gold-100 dark:group-hover:bg-gold-900/60">
                  {model.tag}
                </span>
                <h3 className="text-base font-black text-navy-950 dark:text-white font-mono pt-2 transition-colors">{model.name}</h3>
                <p className="text-xs font-medium text-navy-600 dark:text-navy-300 leading-relaxed transition-colors">{model.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope Section */}
      <div className="space-y-8 pb-4">
        <div className="flex items-center space-x-4 text-navy-950 dark:text-white">
          <div className="p-3 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200 shadow-sm">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl font-extrabold">Future Scope & Enhancements</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {futureScopes.map((scope) => {
            const Icon = scope.icon;
            return (
              <div key={scope.title} className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy flex flex-col space-y-4 transition-colors card-hover">
                <div className="p-3 bg-navy-50 dark:bg-navy-900 rounded-xl text-gold-600 dark:text-gold-400 self-start border border-beige-200 dark:border-navy-800">
                  <Icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-navy-950 dark:text-white transition-colors">{scope.title}</h3>
                  <p className="text-xs font-medium text-navy-500 dark:text-navy-300 leading-relaxed transition-colors">{scope.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-beige-300 dark:border-navy-800 transition-colors">
        <p className="text-sm text-navy-600 dark:text-navy-300 font-bold transition-colors">
          TruthLens AI — Professional Grade Misinformation Detection Platform.
        </p>
        <p className="text-xs text-navy-400 mt-2 font-medium">
          Enabling real-time journalistic credibility checks and data verification.
        </p>
      </div>

    </div>
  );
};
export default About;
