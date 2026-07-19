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
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Bar Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#E8E2D5] dark:border-[#1B2A4A] bg-[#FAF7F0] dark:bg-[#0A1128] transition-colors shrink-0">
          {/* Left: Dynamic Page Title */}
          <h1 className="text-lg font-bold text-[#1E3A8A] dark:text-[#C5A880] transition-colors">
            {getPageTitle(location.pathname)}
          </h1>

          {/* Right: Search, Theme Toggle, Notifications, Profile Card */}
          <div className="flex items-center space-x-4">
            
            {/* Search Input bar */}
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-2.5 text-[#1A2536]/40 dark:text-[#F4EFE6]/40" />
              <input 
                type="text" 
                placeholder="Search truth records..." 
                className="pl-9 pr-4 py-1.5 rounded-xl text-xs border border-[#E8E2D5] dark:border-[#1B2A4A] bg-white dark:bg-[#101F42] text-[#1A2536] dark:text-[#F4EFE6] focus:outline-none focus:ring-1 focus:ring-[#C5A880] w-60 placeholder-[#1A2536]/30 dark:placeholder-[#F4EFE6]/30 transition-colors"
                readOnly
              />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#1A2536] dark:text-[#F4EFE6] transition-colors cursor-pointer border border-[#E8E2D5] dark:border-[#1B2A4A] bg-white dark:bg-[#101F42]"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} className="text-[#C5A880]" /> : <Moon size={16} />}
            </button>

            {/* Notification button */}
            <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#1A2536]/65 dark:text-[#F4EFE6]/60 transition-colors relative border border-[#E8E2D5] dark:border-[#1B2A4A] bg-white dark:bg-[#101F42] cursor-pointer">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Avatar */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C5A880] to-[#9A7B56] flex items-center justify-center text-[#0A1128] font-black text-xs shadow-sm border border-[#1B2A4A]/10">
              Y
            </div>
          </div>
        </header>

        {/* Main Viewport Content - Loaded inside dynamic dot grid backdrop */}
        <main className="flex-grow p-6 overflow-y-auto grid-bg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/single-analysis" element={<SingleAnalysis />} />
            <Route path="/batch-analysis" element={<BatchAnalysis />} />
            <Route path="/history-logs" element={<HistoryLogs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
          </Routes>
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
