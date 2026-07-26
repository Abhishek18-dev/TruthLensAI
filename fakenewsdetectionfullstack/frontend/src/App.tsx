import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { SingleAnalysis } from "./pages/SingleAnalysis";
import { BatchAnalysis } from "./pages/BatchAnalysis";
import { HistoryLogs } from "./pages/HistoryLogs";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import { Search, Bell, Sun, Moon } from "lucide-react";

// Nested main layout wrapper to safely access react-router useLocation hook
const MainLayout: React.FC<{ darkMode: boolean; toggleTheme: () => void }> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard Overview";
      case "/single-analysis":
        return "Single News Verification";
      case "/batch-analysis":
        return "Batch News Verification";
      case "/history-logs":
        return "Prediction Database";
      case "/analytics":
        return "Metrics & Trends";
      case "/about":
        return "About System";
      default:
        return "TruthLens AI";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F0] dark:bg-[#0A1128] text-[#1A2536] dark:text-[#F4EFE6] font-sans transition-colors duration-300">
      {/* Left Sidebar */}
      <Sidebar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Right Content Area */}
      <div className="flex-grow flex flex-col min-w-0 relative">
        
        {/* Top Bar Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50 bg-white/70 dark:bg-[#0A1128]/70 backdrop-blur-md border-b border-[#E8E2D5]/80 dark:border-[#1B2A4A]/80 transition-colors shrink-0 shadow-sm">
          {/* Left: Dynamic Page Title */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E3A8A] to-[#101F42] dark:from-white dark:to-white/70 tracking-tight transition-colors">
              {getPageTitle(location.pathname)}
            </h1>
            <div className="flex items-center text-[10px] font-medium text-[#1A2536]/50 dark:text-[#F4EFE6]/40 uppercase tracking-widest mt-0.5 space-x-1.5">
              <span>TruthLens</span>
              <span>/</span>
              <span className="text-[#1E3A8A] dark:text-[#C5A880]">{location.pathname.replace("/", "") || "dashboard"}</span>
            </div>
          </div>

          {/* Right: Search, Theme Toggle, Notifications, Profile Card */}
          <div className="flex items-center space-x-3 lg:space-x-5">
            
            {/* Search Input bar */}
            <div className="relative hidden md:block group">
              <Search size={14} className="absolute left-3.5 top-2.5 text-[#1A2536]/40 dark:text-[#F4EFE6]/40 group-focus-within:text-[#C5A880] transition-colors" />
              <input 
                type="text" 
                placeholder="Search truth records..." 
                className="pl-9 pr-4 py-2 rounded-full text-xs border border-[#E8E2D5] dark:border-[#1B2A4A]/80 bg-black/[0.02] dark:bg-white/[0.02] text-[#1A2536] dark:text-[#F4EFE6] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]/50 w-56 lg:w-72 placeholder-[#1A2536]/40 dark:placeholder-[#F4EFE6]/40 transition-all duration-300 shadow-inner"
                readOnly
              />
              <div className="absolute right-2.5 top-2 hidden lg:flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold bg-black/5 dark:bg-white/10 rounded text-[#1A2536]/50 dark:text-[#F4EFE6]/50 border border-black/10 dark:border-white/10">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold bg-black/5 dark:bg-white/10 rounded text-[#1A2536]/50 dark:text-[#F4EFE6]/50 border border-black/10 dark:border-white/10">K</kbd>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-l border-[#E8E2D5] dark:border-[#1B2A4A]/80 pl-3 lg:pl-5">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1A2536] dark:text-[#F4EFE6] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#E8E2D5] dark:hover:border-[#1B2A4A]"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={16} className="text-[#C5A880] hover:rotate-45 transition-transform duration-500" /> : <Moon size={16} className="hover:-rotate-12 transition-transform duration-500" />}
              </button>

              {/* Notification button */}
              <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1A2536]/70 dark:text-[#F4EFE6]/70 transition-all duration-300 relative border border-transparent hover:border-[#E8E2D5] dark:hover:border-[#1B2A4A] cursor-pointer group">
                <Bell size={16} className="group-hover:animate-wiggle" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0A1128]"></span>
              </button>

              {/* User Profile Avatar */}
              <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#9A7B56] flex items-center justify-center text-[#0A1128] font-black text-xs shadow-md border-2 border-white dark:border-[#0A1128] hover:ring-2 hover:ring-[#C5A880]/50 hover:ring-offset-2 hover:ring-offset-[#FAF7F0] dark:hover:ring-offset-[#0A1128] transition-all duration-300 cursor-pointer">
                Y
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport Content - Loaded inside dynamic dot grid backdrop */}
        <main className="flex-grow p-6 lg:p-10 xl:p-12 overflow-y-auto grid-bg relative">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/single-analysis" element={<SingleAnalysis />} />
              <Route path="/batch-analysis" element={<BatchAnalysis />} />
              <Route path="/history-logs" element={<HistoryLogs />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Sync document element class lists for dark selector strategy
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <Router>
      <MainLayout darkMode={darkMode} toggleTheme={toggleTheme} />
    </Router>
  );
}

export default App;
