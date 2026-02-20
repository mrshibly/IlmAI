"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [madhhab, setMadhhab] = useState("Hanafi");
  const [language, setLanguage] = useState("English");
  const [appearance, setAppearance] = useState("Light");

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
          </Link>
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-lg">mosque</span>
          </div>
          <h1 className="font-bold text-lg text-primary">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Profile Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">person</span>
               </div>
               <div>
                  <h2 className="text-xl font-bold">Research Preferences</h2>
                  <p className="text-sm text-slate-500">Customize how IlmAI retrieves and presents information.</p>
               </div>
            </div>

            <div className="grid gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">Default School (Madhhab)</h3>
                  <p className="text-xs text-slate-500 max-w-sm">Sets the primary lens for Fiqh-related inquiries and source retrieval.</p>
                </div>
                <select 
                  value={madhhab}
                  onChange={(e) => setMadhhab(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-semibold px-4 py-2 text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Hanafi</option>
                  <option>Maliki</option>
                  <option>Shafi'i</option>
                  <option>Hanbali</option>
                  <option>Jafari</option>
                </select>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">Output Language</h3>
                  <p className="text-xs text-slate-500 max-w-sm">The language used for assistant responses and translations.</p>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-semibold px-4 py-2 text-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>English</option>
                  <option>العربية (Arabic)</option>
                  <option>Bangla</option>
                </select>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">palette</span>
              Interface Appearance
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {['Light', 'Dark', 'System'].map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setAppearance(mode)}
                  className={`p-4 rounded-2xl border transition-all text-center group ${
                    appearance === mode 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    appearance === mode ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    <span className="material-symbols-outlined">
                      {mode === 'Light' ? 'light_mode' : mode === 'Dark' ? 'dark_mode' : 'settings_brightness'}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${appearance === mode ? 'text-primary' : 'text-slate-500'}`}>{mode}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Account/System Section */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
              <span className="material-symbols-outlined">security</span>
              Data & Privacy
            </h2>
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
              <h3 className="font-bold mb-2">Clear Research History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">This will permanently delete all your conversation history from our servers.</p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-red-600/20">
                Delete History
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
