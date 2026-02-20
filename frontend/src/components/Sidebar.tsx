"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Library as LibraryIcon, 
  History, 
  Settings, 
  TrendingUp, 
  Sparkles,
  LogOut,
  Search,
  Zap,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SubscriptionModal from "./SubscriptionModal";

export default function Sidebar() {
  const { logout, token } = useAuth();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [usage, setUsage] = React.useState<{ tier: string; usage_count: number; usage_limit: number; is_unlimited: boolean } | null>(null);
  const errorCount = useRef(0);

  const fetchUsage = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/usage", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      // Only log once to avoid console spam during interval
      if (usage !== null || errorCount.current === 0) {
        console.error("Sidebar: Failed to fetch usage from http://127.0.0.1:8000/usage. Error:", err);
        errorCount.current++;
      }
    }
  }, [token]);

  React.useEffect(() => {
    fetchUsage();
    // Refresh usage every minute OR on path change
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, [fetchUsage, pathname]);

  const menuItems = [
    { icon: TrendingUp, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Research Lab", href: "/chat" },
    { icon: LibraryIcon, label: "Library", href: "/library" },
    { icon: Settings, label: "Settings", href: "/settings" }
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-xl">
          <Sparkles className="text-white w-5 h-5 fill-white" />
        </div>
        <span className="hidden md:block text-xl font-black tracking-tighter text-white uppercase italic">IlmAI</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
              <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800 space-y-4">
        {/* Usage Indicator */}
        {usage && (
          <div className="hidden md:block px-4 py-3 bg-slate-800/30 rounded-2xl border border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {usage.tier === 'pro' ? 'Unlimited' : `${usage.usage_count}/${usage.usage_limit}`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${usage.is_unlimited ? 100 : Math.min((usage.usage_count / usage.usage_limit) * 100, 100)}%` }}
              />
            </div>
            {usage.tier === 'free' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-3 flex items-center justify-between group/link"
              >
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest group-hover/link:text-emerald-300 transition-colors">Upgrade to Pro</span>
                <ChevronRight className="w-3 h-3 text-emerald-500 group-hover/link:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="md:hidden w-full flex items-center justify-center p-3 rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
        </button>

      <button 
        onClick={logout}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden md:block">Logout</span>
      </button>
    </div>
  </aside>

  <SubscriptionModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    onUpgradeSuccess={fetchUsage}
  />
</>
);
}
