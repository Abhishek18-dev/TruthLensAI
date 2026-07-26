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
    <aside className="hidden lg:flex w-64 bg-gradient-to-b from-[#0A1128] to-[#0A1128]/95 border-r border-[#1B2A4A]/50 text-[#F4EFE6] flex-col justify-between min-h-screen shrink-0 font-sans z-40 transition-colors shadow-2xl shadow-black/20">
      <div className="flex flex-col">
        {/* Sidebar Logo Header */}
        <div className="h-20 flex items-center px-6 space-x-3 mb-4 mt-2">
          <div className="bg-gradient-to-tr from-[#101F42] to-[#1B2A4A] shadow-inner shadow-white/5 p-2 rounded-xl text-[#C5A880] ring-1 ring-white/10">
            <ShieldCheck size={22} className="drop-shadow-md" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-lg font-extrabold tracking-wide text-[#F4EFE6] block font-sans bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              TruthLens <span className="text-[#C5A880]">AI</span>
            </span>
            <span className="text-[9px] text-[#FAF7F0]/40 tracking-[0.2em] uppercase font-bold block mt-0.5">
              Verified Truth
            </span>
          </div>
        </div>

        {/* Sidebar Section: CORE SCANNER */}
        <div className="px-4 py-2 space-y-8">
          <div>
            <span className="text-[10px] font-semibold text-[#FAF7F0]/40 uppercase tracking-widest px-4 block mb-4 font-mono">
              Core Scanner
            </span>
            <nav className="space-y-1.5">
              {coreLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      active
                        ? "text-[#C5A880] bg-gradient-to-r from-[#C5A880]/10 to-transparent shadow-sm"
                        : "text-[#FAF7F0]/60 hover:text-[#F4EFE6] hover:bg-white/5"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-[#C5A880] to-[#9A7B56] shadow-[0_0_8px_rgba(197,168,128,0.5)]" />
                    )}
                    <div className="flex items-center space-x-3">
                      <Icon size={16} className={`transition-all duration-300 ${active ? "text-[#C5A880] drop-shadow-sm" : "text-[#FAF7F0]/40 group-hover:text-[#F4EFE6]"}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Section: NEXT-GEN AI */}
          <div>
            <span className="text-[10px] font-semibold text-[#FAF7F0]/40 uppercase tracking-widest px-4 block mb-4 font-mono">
              Next-Gen AI <span className="lowercase text-[#FAF7F0]/20">(soon)</span>
            </span>
            <nav className="space-y-1.5">
              {soonLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="group relative flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium tracking-wide text-[#FAF7F0]/30 cursor-not-allowed transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={16} className="text-[#FAF7F0]/20 group-hover:text-[#FAF7F0]/30 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-[#101F42]/50 text-[#C5A880]/70 font-bold border border-[#1B2A4A]/50 shrink-0">
                      SOON
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer User Card */}
      <div className="p-4 mb-2">
        <div className="group flex items-center justify-between bg-gradient-to-b from-[#101F42]/40 to-[#101F42]/20 hover:from-[#101F42]/60 hover:to-[#101F42]/40 p-3 rounded-2xl border border-[#1B2A4A]/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:border-[#1B2A4A]">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#101F42] to-[#0A1128] text-[#C5A880] p-2 rounded-xl border border-[#1B2A4A]/80 shadow-inner group-hover:border-[#C5A880]/30 transition-colors">
              <User size={16} className="opacity-80 group-hover:opacity-100" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#F4EFE6] block tracking-wide group-hover:text-white transition-colors">Yuh</span>
              <span className="text-[10px] text-[#C5A880]/80 font-medium flex items-center space-x-1 mt-0.5">
                <Zap size={10} fill="currentColor" className="text-[#C5A880]" />
                <span className="tracking-wide uppercase">Enterprise Pro</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
