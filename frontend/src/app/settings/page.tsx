"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import BackgroundAccents from "@/components/BackgroundAccents";

export default function SettingsPage() {
  const { user, updateUserSettings } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [madhhab, setMadhhab] = useState(user?.preferred_madhhab || "General");
  const [language, setLanguage] = useState(user?.ui_language || "en");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const success = await updateUserSettings({
      full_name: fullName,
      preferred_madhhab: madhhab,
      ui_language: language,
    });

    if (success) {
      setStatus({ type: "success", msg: "Settings saved successfully!" });
    } else {
      setStatus({ type: "error", msg: "Failed to save settings. Please try again." });
    }
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex selection:bg-emerald-500/30">
      <BackgroundAccents />
      <Sidebar />
      <div className="flex-1 pl-20 md:pl-64 relative z-10 bg-transparent min-h-screen">
        <div className="max-w-3xl mx-auto py-16 px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-all shadow-xl active:scale-90">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Account Settings</h1>
              <p className="text-slate-500 text-sm font-medium">Personalize your scholarly experience</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">person_edit</span>
          </div>
        </div>

        <div className="premium-glass rounded-[40px] overflow-hidden">
          <form onSubmit={handleSave} className="p-8 space-y-8">
            {status && (
              <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${
                status.type === "success" 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                <span className="material-symbols-outlined text-lg">{status.type === "success" ? "check_circle" : "error"}</span>
                {status.msg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 dark:text-slate-200"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-2 px-1 font-bold italic">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Preferred Madhhab</label>
                <div className="relative">
                  <select
                    value={madhhab}
                    onChange={(e) => setMadhhab(e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.25rem'
                    }}
                    className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 dark:text-slate-200 appearance-none font-bold"
                  >
                    <option value="General">General (Balanced Views)</option>
                    <option value="Hanafi">Hanafi</option>
                    <option value="Shafi'i">Shafi'i</option>
                    <option value="Maliki">Maliki</option>
                    <option value="Hanbali">Hanbali</option>
                    <option value="Jafari">Ja'fari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Interface Language</label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.25rem'
                    }}
                    className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 dark:text-slate-200 appearance-none font-bold"
                  >
                    <option value="en">English (default)</option>
                    <option value="bn">Bangla (Bengali)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center gap-3 ml-auto"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Save Preferences</span>
                    <span className="material-symbols-outlined">save_as</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-500/5 rounded-3xl border border-amber-100 dark:border-amber-500/10">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-amber-600">info</span>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1 leading-tight">Personalization Impact</p>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/60 font-medium">
                Setting a preferred Madhhab directs the AI to prioritize that school's rulings in its research.
                You can always ask specific questions about other schools manually.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
