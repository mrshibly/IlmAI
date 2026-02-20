"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Database, 
  ChevronRight, 
  CheckCircle2, 
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  Library,
  Scale
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/chat");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-emerald-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-6xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/50 px-6 py-3 rounded-2xl flex items-center justify-between shadow-2xl shadow-black/20"
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">IlmAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {["How It Works", "Library", "Pricing", "About"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/chat" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                <LayoutDashboard className="w-4 h-4" />
                Explore Library
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-white hover:bg-slate-200 text-slate-950 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
                  Get Access
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </nav>

      <main className="relative z-10 pt-32 lg:pt-48 px-6 overflow-hidden">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-400">Scholarly Verified AI Engine v2.0</span>
          </motion.div>

          <motion.h1 
            {...fadeInUp}
            className="text-6xl md:text-8xl font-black text-center text-white tracking-tighter leading-[0.9] max-w-5xl mb-8"
          >
            Faithful Knowledge. <br />
            <span className="text-emerald-500 italic block mt-2">Verified Instantly.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-lg md:text-xl text-center max-w-2xl mb-12 leading-relaxed"
          >
            The world's first AI-driven research platform connected directly to the primary sources of Islamic Jurisprudence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleSearch} className="relative bg-[#0F172A] p-2 rounded-[2.2rem] border border-slate-800 flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex-1 relative flex items-center px-4">
                <Search className="w-5 h-5 text-emerald-500" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question (e.g., Concept of Zakat in Hanafi Fiqh)"
                  className="w-full bg-transparent border-none outline-none text-white px-4 py-4 placeholder:text-slate-500 font-medium"
                />
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-[1.8rem] flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
                Start Research
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          {/* Feature Grid Reveal */}
          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 mb-32 w-full max-w-5xl"
          >
            {[
              { icon: BookOpen, label: "Al-Quran Cloud", sub: "114 Surahs Integrated" },
              { icon: Library, label: "Kutub al-Sittah", sub: "Verified Hadith Corpus" },
              { icon: Scale, label: "Fiqh Comparison", sub: "Four Schools Perspective" },
              { icon: ShieldCheck, label: "Zero Hallucination", sub: "Source-First Retrieval" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl hover:border-emerald-500/50 transition-all hover:bg-emerald-500/[0.02]"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                  <feature.icon className="text-emerald-500 w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{feature.label}</h4>
                <p className="text-[11px] text-slate-500 font-bold">{feature.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Value Prop Section */}
        <section className="py-24 border-t border-slate-800/50 bg-slate-900/[0.02]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-[3rem] p-8 aspect-square flex flex-col justify-between shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>

                <div className="space-y-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl animate-pulse">
                    <div className="h-4 w-[80%] bg-emerald-500/20 rounded mb-4" />
                    <div className="h-4 w-[40%] bg-emerald-500/20 rounded" />
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-[80%] shadow-xl">
                      <div className="flex gap-2 mb-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Source</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"Based on Sahih Bukhari (Chapter 2, Hadith 8), the pillars of Islam include..."</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden`}>
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-500 opacity-50" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">+12k Active Researchers</p>
                </div>
              </div>
            </motion.div>

            <div>
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20"
              >
                <Database className="text-emerald-500 w-6 h-6" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">Built on Foundation, Powered by Intelligence</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                IlmAI doesn't just guess. It strictly adheres to RAG (Retrieval Augmented Generation) protocols to ensure every output is explicitly present in our scholarly dataset.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Zero Hallucination Guarantee", desc: "If the source isn't in our library, IlmAI won't invent it." },
                  { title: "Academic Multi-Sourcing", desc: "Cross-references multiple texts to provide a holistic view." },
                  { title: "Direct Scholarly Links", desc: "Click any citation to view the original text instantly." }
                ].map((point, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4 items-start group"
                  >
                    <div className="mt-1 p-0.5 rounded-full bg-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{point.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed italic font-medium">{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/chat")}
                className="mt-10 px-8 py-4 bg-transparent border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-3"
              >
                Explore Methodology
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 flex justify-center">
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
             className="w-full max-w-6xl relative rounded-[4rem] overflow-hidden p-16 md:p-24 text-center border border-emerald-500/20 bg-emerald-500/[0.03]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
            <h2 className="relative z-10 text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 italic">Ready to redefine your <br className="hidden md:block" /> research journey?</h2>
            <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push("/signup")}
                className="px-12 py-5 bg-white text-slate-950 font-black rounded-3xl text-lg shadow-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Get Full Access
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </button>
              <button 
                onClick={() => router.push("/login")}
                className="px-12 py-5 bg-slate-900 text-white font-black rounded-3xl border border-slate-700 hover:border-emerald-500 transition-all active:scale-95"
              >
                Researcher Login
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500 w-5 h-5 fill-emerald-500" />
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">IlmAI</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">Ethical AI Guidelines</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">Scholarly Audit</a>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">© 2024 Foundations of Truth. Built for the inquisitive.</p>
        </div>
      </footer>
    </div>
  );
}
