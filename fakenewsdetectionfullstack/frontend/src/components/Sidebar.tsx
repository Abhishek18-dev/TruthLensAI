import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Search, 
  Layers, 
  History, 
  BarChart3, 
  Info, 
  Database, 
  MessageSquare, 
  Network,
  ShieldCheck,
  User,
  Zap
} from "lucide-react";

interface SidebarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const coreLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Verify News", href: "/single-analysis", icon: Search },
    { name: "Batch Upload", href: "/batch-analysis", icon: Layers },
    { name: "History Logs", href: "/history-logs", icon: History },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "About Project", href: "/about", icon: Info }
  ];

  const soonLinks = [
    { name: "RAG Search", icon: Database },
    { name: "AI Expert Chat", icon: MessageSquare },
    { name: "Evidence Board", icon: Network }
  ];

  return (
    <aside className="w-64 bg-[#0A1128] border-r border-[#1B2A4A] text-[#F4EFE6] flex flex-col justify-between min-h-screen shrink-0 font-sans z-40 transition-colors">
      <div className="flex flex-col">
        {/* Sidebar Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1B2A4A] space-x-3">
          <div className="bg-[#101F42] border border-[#1B2A4A] p-2.5 rounded-xl text-[#C5A880]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-[#F4EFE6] block font-sans">
              TruthLens <span className="text-[#C5A880]">AI</span>
            </span>
            <span className="text-[8px] text-[#FAF7F0]/40 tracking-widest uppercase font-bold block -mt-0.5">
              VERIFIED TRUTH
            </span>
          </div>
        </div>

        {/* Sidebar Section: CORE SCANNER */}
        <div className="px-4 py-6 space-y-7">
          <div>
            <span className="text-[10px] font-bold text-[#FAF7F0]/30 uppercase tracking-widest px-3 block mb-3 font-mono">
              Core Scanner
            </span>
            <nav className="space-y-1">
              {coreLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      active
                        ? "bg-[#101F42] text-[#C5A880] border border-[#1B2A4A]"
                        : "text-[#FAF7F0]/65 hover:text-[#C5A880] hover:bg-[#101F42]/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={15} className={active ? "text-[#C5A880]" : "text-[#FAF7F0]/50"} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Section: NEXT-GEN AI */}
          <div>
            <span className="text-[10px] font-bold text-[#FAF7F0]/30 uppercase tracking-widest px-3 block mb-3 font-mono">
              Next-Gen AI (Soon)
            </span>
            <nav className="space-y-1">
              {soonLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-[#FAF7F0]/30 cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={15} className="text-[#FAF7F0]/25" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#101F42] text-[#C5A880] font-bold border border-[#1B2A4A] shrink-0">
                      COMING SOON
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer User Card */}
      <div className="p-4 border-t border-[#1B2A4A]">
        <div className="flex items-center justify-between bg-[#101F42]/50 p-3 rounded-xl border border-[#1B2A4A]">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#101F42] text-[#C5A880] p-2 rounded-lg border border-[#1B2A4A]">
              <User size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F4EFE6] block">yuh</span>
              <span className="text-[9px] text-[#C5A880] font-medium flex items-center space-x-1">
                <Zap size={8} fill="currentColor" />
                <span>Enterprise Pro</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
