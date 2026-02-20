"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Globe, FileText, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/apiConfig";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const { token } = useAuth();
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    if (!token) return;
    setIsUpgrading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/upgrade`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onUpgradeSuccess();
        setTimeout(onClose, 1500);
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-900/40 border border-slate-800 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left side: Pro highlights */}
            <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-emerald-500/10 to-transparent border-r border-slate-800/50">
              <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                <Sparkles className="w-8 h-8 text-slate-950 fill-slate-950" />
              </div>
              
              <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
                Unlock IlmAI <span className="text-emerald-400">Pro</span>
              </h2>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                Elevate your research with unlimited inquiries and high-fidelity insights from our most advanced models.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, text: "Unlimited daily research inquiries", color: "text-amber-400" },
                  { icon: Shield, text: "Advanced Llama 3.1 70B Model access", color: "text-blue-400" },
                  { icon: Globe, text: "Multi-madhhab comparative analysis", color: "text-emerald-400" },
                  { icon: FileText, text: "Export research to PDF & Markdown", color: "text-purple-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-slate-800/50 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-200 font-bold text-sm tracking-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Plans */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    Most Popular
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">$19</span>
                    <span className="text-slate-500 font-black uppercase tracking-widest text-xs">/ month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-300 text-sm font-medium">Cancel anytime, no questions asked.</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-300 text-sm font-medium">Secure SSL encrypted payment.</span>
                   </div>
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-lg uppercase tracking-tight transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center overflow-hidden relative group"
                >
                  {isUpgrading ? (
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-5 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                       <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Get Full Access Now</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">
                  Join 1,200+ Truth-seekers worldwide
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
