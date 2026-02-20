"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Queries", value: "1,284", icon: "forum", color: "bg-blue-500" },
    { label: "Source Matches", value: "98.2%", icon: "fact_check", color: "bg-primary" },
    { label: "Avg Latency", value: "1.4s", icon: "speed", color: "bg-accent-gold" },
    { label: "Flagged Content", value: "3", icon: "warning", color: "bg-red-500" },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
          </div>
          <h1 className="font-bold text-lg text-primary">System Monitoring</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">System Live</span>
           </div>
           <div className="flex flex-col items-end mr-2">
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Access</span>
             <span className="text-[10px] text-slate-400">v1.0.0-prod</span>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Audit Log / Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold">System Health & Logs</h2>
            <button className="text-sm font-bold text-primary flex items-center gap-1 group">
               View Full Logs
               <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">latency</th>
                  <th className="px-6 py-4">Source ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-bold">SUCCESS</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-500">POST /query</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold">1.2s</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">QURAN_24:35</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-medium">2 mins ago</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
