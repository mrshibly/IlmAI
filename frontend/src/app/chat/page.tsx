"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources_found?: boolean;
  citations?: string[];
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "As-salamu alaykum! I am IlmAI. How can I assist you with your research in Quran, Hadith, or Fiqh today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialQueryRun = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const { user, token, logout } = useAuth();

  const suggestedQuestions = language === "en" ? [
    { text: "What are the five pillars of Islam?", icon: "mosque" },
    { text: "How to perform Wudu correctly?", icon: "water_drop" },
    { text: "Importance of Zakat in the Quran", icon: "payments" },
    { text: "Hadith on the best of people", icon: "groups" },
  ] : [
    { text: "ইসলামের পাঁচটি স্তম্ভ কী কী?", icon: "mosque" },
    { text: "সঠিকভাবে অজু করার নিয়ম কী?", icon: "water_drop" },
    { text: "কুরআনে যাকাতের গুরুত্ব", icon: "payments" },
    { text: "সেরা মানুষ সম্পর্কে হাদিস", icon: "groups" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple alert for now, could be a toast
    alert("Copied to clipboard!");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && !hasInitialQueryRun.current) {
      hasInitialQueryRun.current = true;
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsSidebarOpen(false); // Close sidebar on mobile after search

    try {
      const langPrefix = language === "bn" ? "Please respond in Bangla (Bengali). The question is: " : "";
      const finalQuery = langPrefix + queryText;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`http://127.0.0.1:8000/query?query=${encodeURIComponent(finalQuery)}`, {
        method: "POST",
        headers,
      });

      if (!response.ok) throw new Error("Backend unavailable");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        sources_found: data.sources_found,
        citations: data.citations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error connecting to the knowledge base. Please ensure the backend server is running.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeSearch(input);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">mosque</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-primary">IlmAI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">Verified Knowledge</p>
            </div>
          </Link>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4">
          <button 
            onClick={() => {
              setMessages([{
                role: "assistant",
                content: "As-salamu alaykum! I am IlmAI. How can I assist you with your research today?",
              }]);
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Chat
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase mt-4 mb-2 tracking-wider">Navigation</p>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 text-slate-600 dark:text-slate-400 font-medium transition-colors">
            <span className="material-symbols-outlined text-lg">home</span>
            <span className="text-sm">Landing Page</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 text-primary font-medium cursor-pointer">
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            <span className="truncate text-sm">Active Research</span>
          </div>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 text-slate-600 dark:text-slate-400 font-medium transition-colors">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {(user.full_name || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user.full_name || user.email}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="text-sm">Sign Out</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-primary font-bold transition-colors">
              <span className="material-symbols-outlined text-lg">login</span>
              <span className="text-sm">Sign In</span>
            </Link>
          )}
          <Link href="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-primary" onClick={() => setIsSidebarOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Research Mode</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Scholarly Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={() => setLanguage(l => l === "en" ? "bn" : "en")}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-primary/20 hover:border-primary/60 text-primary text-xs font-black transition-all"
               title="Switch language"
             >
               <span className="material-symbols-outlined text-sm">translate</span>
               {language === "en" ? "EN" : "বাং"}
             </button>
             <div className="hidden sm:flex bg-primary/10 px-3 py-1.5 rounded-lg text-primary text-xs font-bold items-center gap-2">
                <span className="material-symbols-outlined text-base">bolt</span>
                Groq (Llama 3)
             </div>
             <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined text-sm">verified</span>
             </div>
          </div>
        </header>

        {/* Chat Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 1 && (
              <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Begin Your Research</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto">
                  Ask me anything about Quranic verses, Hadith narrations, or classical Fiqh viewpoints.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {suggestedQuestions.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => executeSearch(q.text)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">{q.icon}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{q.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                    <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                  </div>
                )}
                <div className={`group p-4 rounded-2xl shadow-sm max-w-[85%] relative ${
                  msg.role === "user" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none"
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  
                  {msg.role === "assistant" && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary transition-colors" title="Like">
                        <span className="material-symbols-outlined text-xs">thumb_up</span>
                      </button>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 transition-colors" title="Dislike">
                        <span className="material-symbols-outlined text-xs">thumb_down</span>
                      </button>
                      <button 
                        onClick={() => copyToClipboard(msg.content)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary transition-colors" 
                        title="Copy"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                      </button>
                    </div>
                  )}

                  {msg.role === "assistant" && msg.sources_found && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest flex items-center gap-1 mb-2">
                         <span className="material-symbols-outlined text-xs">verified</span>
                         Verified Sources
                       </span>
                       <div className="flex flex-wrap gap-2">
                         {msg.citations?.map((cite, cIdx) => {
                           const isLink = cite.startsWith("http");
                           if (isLink) {
                             return (
                               <a 
                                 key={cIdx} 
                                 href={cite} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-all underline decoration-primary/30 flex items-center gap-1"
                               >
                                 <span className="material-symbols-outlined text-[10px]">link</span>
                                 {cite.length > 20 ? cite.substring(0, 17) + "..." : cite}
                               </a>
                             );
                           }
                           return (
                             <span key={cIdx} className="px-2 py-1 rounded bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                               {cite}
                             </span>
                           );
                         })}
                       </div>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary italic">Searching verified sources...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6 shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
              <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 custom-scrollbar placeholder:text-slate-400" 
                placeholder="Ask IlmAI about Fiqh, Hadith or Quranic sciences..." 
                rows={1}
              ></textarea>
              <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              IlmAI aims for accuracy by citing classical texts. Always consult with a local qualified scholar for specific fatwas.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading IlmAI...</div>}>
      <ChatContent />
    </Suspense>
  );
}
