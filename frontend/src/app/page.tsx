"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [madhhab, setMadhhab] = useState("Hanafi");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}&m=${encodeURIComponent(madhhab)}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">mosque</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-primary uppercase">IlmAI</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("#how-it-works")}>How It Works</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("#sources")}>Sources</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("#about")}>About</a>
          </nav>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-sm font-medium">
                <span className="material-symbols-outlined text-lg">language</span>
                <span>English</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-primary/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <a className="block px-4 py-2 hover:bg-primary/5 text-sm" href="#">English</a>
                <a className="block px-4 py-2 hover:bg-primary/5 text-sm font-arabic" href="#">العربية</a>
                <a className="block px-4 py-2 hover:bg-primary/5 text-sm" href="#">Bangla</a>
              </div>
            </div>
            <Link href="/chat" className="bg-primary hover:bg-emerald-dark text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">
              Start Research
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[80px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-accent-gold bg-accent-gold/10 rounded-full border border-accent-gold/20">
            Scholarly Verified AI
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8">
            Faithful Knowledge, <span className="text-primary italic">Verified</span> by AI
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Access authentic answers from the Quran, Hadith, and classical Fiqh with direct citations. Select your school of thought to begin your research.
          </p>
          {/* Search & Selector Component */}
          <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl shadow-primary/10 border border-primary/5 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-transparent focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" 
                  placeholder="Ask a question (e.g., How to perform Sujud al-Sahw?)" 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="md:w-48 relative border-l border-slate-100 dark:border-slate-800">
                <select 
                  className="w-full h-full bg-transparent border-none py-4 px-4 text-sm font-semibold text-primary focus:ring-0 appearance-none cursor-pointer"
                  value={madhhab}
                  onChange={(e) => setMadhhab(e.target.value)}
                >
                  <option>Hanafi</option>
                  <option>Maliki</option>
                  <option>Shafi'i</option>
                  <option>Hanbali</option>
                  <option>Jafari</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
              </div>
              <button type="submit" className="bg-primary hover:bg-emerald-dark text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <span>Search</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <span>Trending:</span>
            <button className="hover:text-primary underline decoration-primary/20" onClick={() => setQuery("Inheritance rules")}>Inheritance rules</button>
            <button className="hover:text-primary underline decoration-primary/20" onClick={() => setQuery("Zakat calculation")}>Zakat calculation</button>
            <button className="hover:text-primary underline decoration-primary/20" onClick={() => setQuery("Tahajjud excellence")}>Tahajjud excellence</button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-background-dark/50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Foundation of Authenticity</h2>
            <p className="text-slate-600 dark:text-slate-400">Our AI is built on three pillars of religious safety and scholarly precision.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar Cards */}
            <div className="group p-8 rounded-2xl bg-background-light dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-accent-gold/30 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">database</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Source-Based Retrieval</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike general AI, IlmAI only accesses a closed, curated library of verified Islamic texts including the Quran and Kutub al-Sittah.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-background-light dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-accent-gold/30 transition-all">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Verified Citations</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every sentence generated is backed by a primary source. Direct links to specific Verses (Ayat) or Hadith numbers are provided instantly.
              </p>
            </div>
            <div className="group p-8 rounded-2xl bg-background-light dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-accent-gold/30 transition-all">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">No Independent Fatwas</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The system is hard-coded to report existing scholarly consensus (Ijma) rather than deducing new religious legal rulings (Ijtihad).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sources Section */}
      <section className="py-24 bg-background-light dark:bg-background-dark/30" id="sources">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Authoritative Islamic Libraries</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                IlmAI is connected to verified digital repositories of the Quran and Hadith. Our system uses advanced vector embeddings to retrieve contextually relevant passages without distorting the original meanings.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Al Quran Cloud", info: "Complete 114 Surahs, 6236 Verses" },
                  { name: "Sahih Bukhari", info: "Authenticated Hadith Library" },
                  { name: "Classical Fiqh Compendiums", info: "Madhhab-specific legal texts" }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">library_books</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-primary/5 rounded-3xl border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-9xl text-primary/20">verified_user</span>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white animate-pulse">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                    <p className="text-sm font-black text-primary">Scholarly Guardrails Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary pt-20 pb-12 text-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 p-8 rounded-2xl border-2 border-accent-gold/30 bg-emerald-dark/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="p-3 bg-accent-gold rounded-full text-emerald-dark">
                <span className="material-symbols-outlined font-bold">warning</span>
              </div>
              <div id="about">
                <h3 className="text-xl font-bold mb-2 text-accent-gold">Important Religious Disclaimer</h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  IlmAI is an advanced research and retrieval system designed to assist students and seekers of knowledge. It is NOT a substitute for a living scholar (Mufti). While the AI retrieves information from verified sources, complex personal issues and specific legal rulings should always be confirmed with a qualified scholar from your respective school of thought. Do not issue final fatwas based solely on AI output.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
            <p>© 2024 IlmAI Foundation. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="hover:text-accent-gold transition-colors" href="https://x.com" target="_blank">Twitter / X</a>
              <a className="hover:text-accent-gold transition-colors" href="https://linkedin.com" target="_blank">LinkedIn</a>
              <a className="hover:text-accent-gold transition-colors" href="https://facebook.com" target="_blank">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
