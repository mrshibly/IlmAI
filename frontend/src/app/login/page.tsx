"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";
import BackgroundAccents from "@/components/BackgroundAccents";
import { API_BASE_URL } from "@/apiConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.access_token);
      } else {
        setError(data.detail || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500/30">
      <BackgroundAccents />
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/20">
            <Sparkles className="text-slate-950 w-8 h-8 fill-slate-950" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">IlmAI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Continue your research journey</p>
        </div>

        <div className="premium-glass p-10 rounded-[40px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 font-bold transition-all underline decoration-emerald-500/20 hover:decoration-emerald-400">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
