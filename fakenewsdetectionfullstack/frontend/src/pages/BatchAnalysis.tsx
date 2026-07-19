import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Layers, Play, RefreshCw, BarChart2, Download } from "lucide-react";
import { truthLensApi } from "../services/api";
import type { PredictResponse } from "../services/api";

interface BatchItemResult {
  id: number;
  excerpt: string;
  prediction: "Fake" | "Real";
  confidence: number;
  status: string;
}

export const BatchAnalysis: React.FC = () => {
  const [predictionMode, setPredictionMode] = useState<"production" | "research">("production");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedArticles, setParsedArticles] = useState<string[]>([]);
  const [results, setResults] = useState<BatchItemResult[]>([]);
  
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple CSV Line Parser
  const parseCSV = (csvText: string): string[] => {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let startIndex = 0;
    
    // Skip headers if present
    if (lines.length > 0) {
      const lowerHeader = lines[0].toLowerCase();
      if (lowerHeader.includes("text") || lowerHeader.includes("title") || lowerHeader.includes("article") || lowerHeader.includes("content")) {
        startIndex = 1;
      }
    }

    return lines.slice(startIndex, 15).map(line => {
      // Basic quote stripping
      let clean = line;
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.slice(1, -1);
      }
      return clean.replace(/""/g, '"');
    });
  };

  // Simple JSON Parser
  const parseJSON = (jsonText: string): string[] => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 15).map(item => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return item.text || item.title || item.content || Object.values(item)[0] as string || "";
          }
          return "";
        }).filter(t => t.length > 0);
      } else if (parsed && typeof parsed === "object") {
        return [parsed.text || parsed.title || parsed.content || ""];
      }
      return [];
    } catch {
      throw new Error("Invalid JSON structure. Verify format is an array of strings or objects.");
    }
  };

  // Simple TXT Paragraph Parser
  const parseTXT = (txtText: string): string[] => {
    return txtText
      .split(/\r?\n\r?\n/)
      .map(p => p.trim())
      .filter(p => p.length > 10) // Filter out short strings
      .slice(0, 15);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFileContent = (file: File) => {
    setError("");
    setCompleted(false);
    setResults([]);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let articles: string[] = [];

        if (file.name.endsWith(".csv")) {
          articles = parseCSV(content);
        } else if (file.name.endsWith(".json")) {
          articles = parseJSON(content);
        } else if (file.name.endsWith(".txt")) {
          articles = parseTXT(content);
        } else {
          articles = parseTXT(content);
        }

        if (articles.length === 0) {
          throw new Error("No readable news article rows or sentences found in file.");
        }

        setParsedArticles(articles);
        setSelectedFile(file);
      } catch (err: any) {
        setError(err.message || "Failed to parse file. Verify file structures.");
        setSelectedFile(null);
        setParsedArticles([]);
      }
    };
    reader.onerror = () => {
      setError("File reading failed due to local system permission locks.");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileContent(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileContent(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (parsedArticles.length === 0) return;
    setProcessing(true);
    setCurrentIndex(0);
    setCompleted(false);
    setResults([]);

    try {
      // Simulate real-time stepping updates for visualization
      const response = await truthLensApi.batchPredict(parsedArticles, predictionMode);
      
      const computed: BatchItemResult[] = response.map((res: PredictResponse, idx) => {
        const isResearchResponse = res.mode === "research";
        const predLabel = isResearchResponse ? res.final_prediction : res.prediction;
        const confidenceScore = isResearchResponse
          ? res.comparison.majority_confidence
          : res.confidence;
        return {
          id: idx + 1,
          excerpt: parsedArticles[idx],
          prediction: predLabel,
          confidence: confidenceScore,
          status: res.status,
        };
      });

      // Slowly render to show the processing state dynamically
      for (let i = 0; i < computed.length; i++) {
        setCurrentIndex(i);
        await new Promise(resolve => setTimeout(resolve, 150));
        setResults(prev => [...prev, computed[i]]);
      }
      setCompleted(true);
    } catch (err) {
      setError("Batch prediction failed. No results were generated; verify that the API is available and try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedArticles([]);
    setResults([]);
    setCompleted(false);
    setProcessing(false);
    setError("");
  };

  // Exporter to CSV file download
  const exportToCSV = () => {
    if (results.length === 0) return;
    const headers = ["Article", "Prediction", "Confidence", "Status"];
    const rows = results.map(r => [
      `"${r.excerpt.replace(/"/g, '""')}"`,
      r.prediction,
      `${r.confidence}%`,
      r.status
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `truthlens_batch_results_${predictionMode}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recalculate metrics on-the-fly
  const total = results.length;
  const fakeCount = results.filter(r => r.prediction === "Fake").length;
  const realCount = results.filter(r => r.prediction === "Real").length;
  const fakeRate = total > 0 ? ((fakeCount / total) * 100).toFixed(1) : "0";
  const realRate = total > 0 ? ((realCount / total) * 100).toFixed(1) : "0";
  const averageConfidence = total > 0 ? (results.reduce((acc, r) => acc + r.confidence, 0) / total).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white transition-colors flex items-center space-x-2">
            <Layers size={22} className="text-navy-700 dark:text-navy-300" />
            <span>Batch News Verification</span>
          </h1>
          <p className="text-sm text-navy-600 dark:text-navy-200 transition-colors">
            Upload news article corpuses in CSV, JSON, or TXT format to execute bulk classification models.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex bg-[#E8E2D5] dark:bg-[#101F42] p-1 rounded-xl border border-[#FAF7F0]/15 select-none transition-colors">
            <button
              onClick={() => setPredictionMode("production")}
              disabled={processing}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                predictionMode === "production"
                  ? "bg-navy-950 text-beige-50 dark:bg-gold-500 dark:text-navy-950 shadow-sm"
                  : "text-navy-600 dark:text-navy-200 hover:text-navy-950 dark:hover:text-white"
              }`}
            >
              Production Mode
            </button>
            <button
              onClick={() => setPredictionMode("research")}
              disabled={processing}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                predictionMode === "research"
                  ? "bg-navy-950 text-beige-50 dark:bg-gold-500 dark:text-navy-950 shadow-sm"
                  : "text-navy-600 dark:text-navy-200 hover:text-navy-950 dark:hover:text-white"
              }`}
            >
              Research Mode
            </button>
          </div>
          
          {selectedFile && (
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-beige-300 dark:border-navy-700 rounded-lg bg-white dark:bg-navy-800 text-xs font-semibold text-navy-800 dark:text-navy-100 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Reset Batch</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main drag & drop area */}
        <div className="lg:col-span-2 space-y-6">
          
          {!selectedFile ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass-panel rounded-2xl p-12 border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-gold-400 dark:hover:border-gold-500 transition-all ${
                dragActive 
                  ? "border-gold-500 bg-gold-500/5" 
                  : "border-beige-300 dark:border-navy-700 bg-white/50 dark:bg-navy-900/60"
              }`}
            >
              <div className="p-4 bg-navy-50 dark:bg-navy-950 rounded-full border border-beige-200 dark:border-navy-800 text-navy-600 dark:text-gold-400">
                <Upload size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-950 dark:text-white">
                  Drag and drop news corpus file here or click to browse
                </p>
                <p className="text-xs text-navy-500 dark:text-navy-450 mt-1 font-light">
                  Supports .csv (with headers), .json arrays, or .txt paragraph articles
                </p>
              </div>
              
              <button className="inline-flex px-4 py-2 border border-beige-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold rounded-lg text-navy-800 dark:text-navy-200 hover:bg-beige-100 dark:hover:bg-navy-700 cursor-pointer shadow-sm">
                Select File
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv,.json,.txt" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 space-y-4 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-navy-300 rounded-xl">
                  <FileText size={20} />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-navy-950 dark:text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-450">
                    Parsed: <strong className="text-navy-700 dark:text-gold-400">{parsedArticles.length}</strong> news entries found ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>

              {/* Progress Bar inside analysis */}
              {processing && (
                <div className="space-y-2 pt-2 animate-fadeIn">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-navy-550 dark:text-navy-300">Processing article {currentIndex + 1} of {parsedArticles.length} (Running {predictionMode === "production" ? "RoBERTa only" : "All Transformer models"})...</span>
                    <span className="font-extrabold text-gold-600 dark:text-gold-400">
                      {Math.floor(((currentIndex + 1) / parsedArticles.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2.5">
                    <div 
                      className="bg-gold-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / parsedArticles.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {!completed && !processing && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleProcess}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-navy-950 text-beige-50 hover:bg-navy-850 dark:bg-gold-500 dark:text-navy-950 dark:hover:bg-gold-400 hover:scale-[1.01] transition-all cursor-pointer animate-fadeIn"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Run {predictionMode === "production" ? "RoBERTa" : "Consensus"} Batch</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-200 flex items-center space-x-2">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Dynamic Table Results */}
          {results.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors animate-fadeIn space-y-4">
              <div className="flex items-center justify-between border-b border-beige-200 dark:border-navy-800 pb-3 gap-2">
                <h3 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                  Batch Log Registry ({results.length} processed)
                </h3>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-beige-300 dark:border-navy-705 rounded-lg bg-white dark:bg-navy-800 text-xs font-semibold text-navy-800 dark:text-navy-200 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer"
                >
                  <Download size={12} />
                  <span>Export CSV</span>
                </button>
              </div>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-beige-300 dark:divide-navy-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Article Segment</th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Result</th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Confidence</th>
                      <th className="px-4 py-2 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige-200 dark:divide-navy-900">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-beige-50/50 dark:hover:bg-navy-800/40 transition-colors">
                        <td className="px-4 py-3 text-xs text-navy-500 font-mono">{r.id}</td>
                        <td className="px-4 py-3 text-xs text-navy-900 dark:text-navy-100 max-w-xs truncate font-light">{r.excerpt}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            r.prediction === "Fake"
                              ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
                          }`}>
                            {r.prediction}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-navy-800 dark:text-navy-200">{r.confidence}%</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right side analytics results / instructions */}
        <div className="space-y-6">
          {completed ? (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors animate-fadeIn space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 dark:text-gold-400">Batch Report</span>
                  <h3 className="text-lg font-extrabold text-navy-950 dark:text-white">Classification Completed</h3>
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-450 rounded-xl border border-emerald-100 dark:border-emerald-900">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between border-b border-beige-200 dark:border-navy-800 pb-2 text-xs">
                  <span className="text-navy-550 dark:text-navy-300">Audited Mode:</span>
                  <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider">{predictionMode}</span>
                </div>
                <div className="flex justify-between border-b border-beige-200 dark:border-navy-800 pb-2 text-xs">
                  <span className="text-navy-550 dark:text-navy-300">Total Audited:</span>
                  <span className="font-extrabold text-navy-900 dark:text-white">{total} articles</span>
                </div>
                <div className="flex justify-between border-b border-beige-200 dark:border-navy-800 pb-2 text-xs">
                  <span className="text-navy-550 dark:text-navy-300">Misinformation:</span>
                  <span className="font-extrabold text-red-600 dark:text-red-400">{fakeCount} ({fakeRate}%)</span>
                </div>
                <div className="flex justify-between border-b border-beige-200 dark:border-navy-800 pb-2 text-xs">
                  <span className="text-navy-550 dark:text-navy-300">Credible Reports:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{realCount} ({realRate}%)</span>
                </div>
                <div className="flex justify-between border-b border-beige-200 dark:border-navy-800 pb-2 text-xs">
                  <span className="text-navy-550 dark:text-navy-300">Mean Confidence:</span>
                  <span className="font-extrabold text-gold-600 dark:text-gold-400">{averageConfidence}%</span>
                </div>
                <p className="text-[11px] leading-relaxed text-navy-500 dark:text-navy-400 pt-2">
                  💡 Batch analysis matches independent sequence token classifications for RoBERTa and BERT pipelines. Records are cached client-side.
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors space-y-4">
              <h3 className="text-sm font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <BarChart2 size={16} className="text-gold-500" />
                <span>Upload Guidelines</span>
              </h3>
              <ul className="text-xs text-navy-600 dark:text-navy-300 space-y-3 list-disc pl-4 font-light leading-relaxed">
                <li>
                  <strong>Production Mode:</strong> Runs only the high-performing RoBERTa classifier to optimize latency and speed.
                </li>
                <li>
                  <strong>Research Mode:</strong> Runs BERT, DistilBERT, and RoBERTa models in parallel and calculates majority ensemble voting.
                </li>
                <li>
                  <strong>CSV format:</strong> Must separate columns by commas. We automatically skip header lines containing keywords: <em>text</em> or <em>content</em>.
                </li>
                <li>
                  <strong>JSON format:</strong> Must be structured as a JSON list arrays of strings or objects.
                </li>
                <li>
                  <strong>TXT format:</strong> Paragraph block split. Break paragraphs with double newlines (blank lines) to separate articles.
                </li>
              </ul>
            </div>
          )}
        </div>
        
      </div>

    </div>
  );
};
export default BatchAnalysis;
