"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Globe,
  Sparkles,
  Search
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import BackgroundAccents from "@/components/BackgroundAccents";

export default function LibraryPage() {
  const { user, token, isLoading } = useAuth();
  const [citations, setCitations] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const fetchLibrary = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/library", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCitations(data);
      }
    } catch (err) {
      console.error("Library fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [token]);

  const deleteCitation = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/library/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCitations(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading || !user) return null;

  const filteredCitations = citations.filter(c => 
    filter === "all" || c.source_type === filter
  );

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'quran': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: BookOpen };
      case 'hadith': return { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: FileText };
      case 'web': return { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Globe };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', icon: Bookmark };
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      <BackgroundAccents />
      <Sidebar />

      <main className="pl-20 md:pl-64 min-h-screen relative z-10 bg-transparent">
        <header className="sticky top-0 z-40 bg-[#020617]/40 backdrop-blur-xl border-b border-slate-800/50 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Citations Library</h1>
            <p className="text-slate-500 text-sm font-medium">Your personal scholarly repository.</p>
          </div>

          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {['all', 'quran', 'hadith', 'web'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {filteredCitations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredCitations.map((citation, i) => {
                const style = getTypeStyle(citation.source_type);
                return (
                  <motion.div 
                    key={citation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="premium-glass rounded-3xl p-6 group hover:border-emerald-500/50 transition-all flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${style.bg} ${style.text} rounded-xl flex items-center justify-center border border-white/5`}>
                          <style.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{citation.source_type}</p>
                          <h3 className="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors">
                            {citation.source_id}
                          </h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteCitation(citation.id)}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 mb-4">
                      <p className="text-sm text-slate-300 line-clamp-4 italic leading-relaxed">
                        "{citation.content}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
                        Saved on {new Date(citation.timestamp).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-2 text-xs font-black text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">
                        View Source
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-24 text-center mt-20">
              <Bookmark className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-2 font-scholarly">Library Empty</h2>
              <p className="text-slate-600 max-w-sm mx-auto mb-8 font-medium">You haven't saved any citations yet. Start your research and bookmark scholars' highlights.</p>
              <button 
                onClick={() => router.push("/chat")}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-3 mx-auto uppercase tracking-tighter"
              >
                Go to Research Lab
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
