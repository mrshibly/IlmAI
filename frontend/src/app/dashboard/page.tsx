"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Library as LibraryIcon, 
  History, 
  Settings, 
  Bookmark, 
  TrendingUp, 
  Clock, 
  FileText, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import BackgroundAccents from "@/components/BackgroundAccents";
import { API_BASE_URL } from "@/apiConfig";

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [libraryCount, setLibraryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistoryItems(data.slice(0, 5)); // Just top 5 for dashboard
        }
      } catch (err) {
        console.error("Dashboard history fetch failed:", err);
      }
    };
    const fetchLibrary = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/library`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLibraryCount(data.length);
        }
      } catch (err) {
        console.error("Dashboard library fetch failed:", err);
      }
    };
    fetchHistory();
    fetchLibrary();
  }, [token]);

  if (isLoading || !user) return null;

  const stats = [
    { label: "Research Sessions", value: historyItems.length, icon: History, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Citations Found", value: "128", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Hours Studied", value: "14.2", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Saved Results", value: libraryCount, icon: Bookmark, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      <BackgroundAccents />
      <Sidebar />

      {/* Main Content */}
      <main className="pl-20 md:pl-64 min-h-screen bg-transparent relative z-10">
        <header className="sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-xl border-b border-slate-800/50 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Assalamu Alaikum, {user.full_name?.split(' ')[0] || "Researcher"}</h1>
            <p className="text-slate-500 text-sm font-medium">Welcome back to your scholarly lab.</p>
          </div>

          <Link href="/chat" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
            New Research
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </Link>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-10">
          {/* Stats Grid */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="premium-glass p-6 rounded-3xl hover:border-emerald-500/50 transition-all group relative overflow-hidden"
              >
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 border border-white/5`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
              </motion.div>
            ))}
          </section>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Recent History Feed */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Recent Sessions</h3>
                <Link href="/chat" className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
                  View All Hub
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-4">
                {historyItems.length > 0 ? (
                  historyItems.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-800/80 transition-all cursor-pointer"
                      onClick={() => router.push(`/chat?q=${encodeURIComponent(item.query)}`)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                          <History className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 italic">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'} • {item.language === 'bn' ? 'বাংলা' : 'English'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-all translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
                    <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No research history yet</p>
                    <Link href="/chat" className="mt-4 inline-block text-emerald-500 font-bold text-sm">Start your first inquiry</Link>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Insights / Tip of the day */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight px-2">Scholarly Insights</h3>
              <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-emerald-500/10 group-hover:scale-110 transition-transform" />
                <h4 className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Did you know?</h4>
                <p className="text-white font-bold leading-relaxed mb-6">
                  IlmAI v2 uses Retrieval Augmented Generation to prevent AI hallucinations. It strictly retrieves context from verified Islamic datasets before generating any response.
                </p>
                <div className="pt-6 border-t border-slate-800/50">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Research Tip</p>
                   <p className="text-xs text-slate-400 mt-1">Specify your desired Madhhab in queries for more targeted legal perspectives.</p>
                </div>
              </div>

              {/* Saved Citations Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Bookmark className="w-5 h-5 text-purple-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Library Bookmarks</h4>
                </div>
                <div className="space-y-4">
                  {[1,2].map(i => (
                    <div key={i} className="flex gap-3 items-center opacity-40">
                      <div className="w-1.5 h-10 bg-slate-800 rounded-full" />
                      <div className="flex-1 space-y-2">
                         <div className="h-2 w-[80%] bg-slate-800 rounded" />
                         <div className="h-2 w-[40%] bg-slate-800 rounded" />
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-500 text-center font-bold italic pt-4">You have {libraryCount} citations in your library.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
