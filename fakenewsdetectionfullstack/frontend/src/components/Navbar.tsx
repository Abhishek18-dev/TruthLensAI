import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Info, 
  Menu, 
  X, 
  Cpu, 
  Sun, 
  Moon,
  LayoutDashboard,
  Search,
  Layers
} from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Verify News", href: "/single-analysis", icon: Search },
    { name: "Batch Upload", href: "/batch-analysis", icon: Layers },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "About", href: "/about", icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-panel-dark text-beige-100 sticky top-0 z-50 border-b border-navy-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Forced shrink-0 to prevent squishing */}
          <div className="flex items-center shrink-0 mr-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-tr from-gold-500 to-gold-300 p-2 rounded-xl text-navy-950 shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Cpu size={20} className="animate-pulse" />
              </div>
              <div className="shrink-0">
                <span className="text-xl font-bold tracking-wider text-beige-50 block font-sans">
                  TruthLens <span className="text-gold-400">AI</span>
                </span>
                <span className="text-[9px] text-beige-400 tracking-widest uppercase block -mt-1 font-semibold">
                  Fake News Detector
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Clean items spacing */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    active
                      ? "bg-gold-500/15 text-gold-400 border border-gold-500/20 font-semibold"
                      : "text-beige-300 hover:text-beige-100 hover:bg-navy-800/50"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-beige-300 hover:text-beige-100 hover:bg-navy-800/50 transition-colors cursor-pointer ml-1 border border-transparent hover:border-navy-700 shrink-0"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} className="text-gold-400" /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-beige-300 hover:text-beige-100 hover:bg-navy-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} className="text-gold-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-beige-300 hover:text-beige-100 hover:bg-navy-800 focus:outline-none transition-colors"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950 border-t border-navy-850 px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-navy-800 text-gold-400 border-l-4 border-gold-500"
                    : "text-beige-300 hover:text-beige-100 hover:bg-navy-900"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
