"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

      const response = await fetch("http://localhost:8000/login", {
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
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl mb-4 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl">mosque</span>
          </div>
          <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">IlmAI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Continue your research journey</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
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
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 dark:text-slate-200"
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
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 dark:text-slate-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-emerald-dark text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
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
              <Link href="/signup" className="text-primary hover:text-emerald-dark font-bold underline decoration-2 underline-offset-4 decoration-primary/20 hover:decoration-primary transition-all">
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
