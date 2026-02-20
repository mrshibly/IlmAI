"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Library as LibraryIcon, 
  MessageSquare, 
  History as HistoryIcon, 
  Send, 
  Menu, 
  X, 
  Copy, 
  Check, 
  User as UserIcon,
  Bot,
  Bookmark,
  ExternalLink,
  ChevronRight,
  BookmarkPlus,
  Trash2,
  Globe,
  Search,
  BookOpen,
  FileText
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import BackgroundAccents from "@/components/BackgroundAccents";
import { API_BASE_URL } from "@/apiConfig";

interface Source {
  type: string;
  id: string;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources_found?: boolean;
  citations?: string[];
  sources?: Source[];
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const router = useRouter();

  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "As-salamu alaykum! I am IlmAI. How can I assist you with your research in Quran, Hadith, or Fiqh today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<{ id: number; title: string; created_at: string }[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialQueryRun = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [researchMode, setResearchMode] = useState<"standard" | "comparative">("standard");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Sync with user preference
  useEffect(() => {
    if (user?.ui_language) {
      setLanguage(user.ui_language as "en" | "bn");
    }
  }, [user?.ui_language]);

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const t = {
    en: {
      welcome: "As-salamu alaykum! I am IlmAI. How can I assist you with your research in Quran, Hadith, or Fiqh today?",
      newChat: "New Chat",
      history: "Research History",
      noHistory: "No history yet",
      signOut: "Sign Out",
      researchMode: "Research Mode",
      scholarlyAssistant: "Scholarly Assistant",
      promptPlaceholder: "Ask about Quran, Hadith, or Fiqh…",
      beginResearch: "Begin Your Research",
      askAnything: "Ask me anything about Quranic verses, Hadith narrations, or classical Fiqh viewpoints.",
      suggested: "Suggested",
      disclaimer: "IlmAI may make mistakes. Always verify with a qualified scholar.",
      searching: "Searching verified sources...",
      copy: "Copy",
      copied: "Copied!",
      loadingResearch: "As-salamu alaykum! Loading your previous research...",
      delete: "Delete",
      clearAll: "Clear All",
      confirmClear: "Are you sure you want to clear all history?"
    },
    bn: {
      welcome: "আস-সালামু আলাইকুম! আমি IlmAI। কুরআন, হাদিস বা ফিকহ নিয়ে আজ আপনাকে কীভাবে সহায়তা করতে পারি?",
      newChat: "নতুন চ্যাট",
      history: "গবেষণার ইতিহাস",
      noHistory: "এখনো কোনো ইতিহাস নেই",
      signOut: "সাইন আউট",
      researchMode: "গবেষণা মোড",
      scholarlyAssistant: "পাণ্ডিত্যপূর্ণ সহকারী",
      promptPlaceholder: "কুরআন, হাদিস বা ফিকহ সম্পর্কে জিজ্ঞাসা করুন…",
      beginResearch: "আপনার গবেষণা শুরু করুন",
      askAnything: "কুরআনের আয়াত, হাদিস বর্ণনা বা ধ্রুপদী ফিকহ দৃষ্টিভঙ্গি সম্পর্কে আমাকে যা খুশি জিজ্ঞাসা করুন।",
      suggested: "পরামর্শ",
      disclaimer: "IlmAI ভুল করতে পারে। সর্বদা একজন যোগ্য আলেমের সাথে যাচাই করুন।",
      searching: "যাচাইকৃত উৎস অনুসন্ধান করা হচ্ছে...",
      copy: "কপি",
      copied: "কপি করা হয়েছে!",
      loadingResearch: "আস-সালামু আলাইকুম! আপনার আগের গবেষণা লোড করা হচ্ছে...",
      delete: "মুছে ফেলুন",
      clearAll: "সব মুছে ফেলুন",
      confirmClear: "আপনি কি নিশ্চিত যে আপনি সব ইতিহাস মুছে ফেলতে চান?"
    }
  }[language];

  // Fetch sessions on load
  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };
    fetchSessions();
  }, [token]);

  const loadSessionMessages = async (sessionId: number) => {
    if (!token) return;
    setIsLoading(true);
    setCurrentSessionId(sessionId);
    try {
      const res = await fetch(`${API_BASE_URL}/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const formattedMessages = data.flatMap((m: any) => [
          { role: "user", content: m.query },
          { role: "assistant", content: m.response }
        ]);
        setMessages(formattedMessages.length > 0 ? formattedMessages : [{ role: "assistant", content: t.welcome }]);
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setIsLoading(false);
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setMessages([{ role: "assistant", content: t.welcome }]);
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (initialQuery && !hasInitialQueryRun.current && user) {
      hasInitialQueryRun.current = true;
      executeSearch(initialQuery);
    }
  }, [initialQuery, user]);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeSearch(input);
      setInput("");
    }
  };

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim() || isLoading || !user) return;

    const userMessage: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsSidebarOpen(false);

    try {
      // Use user's preferred language if available
      const currentLanguage = user.ui_language || language;
      const langPrefix = currentLanguage === "bn" ? "Please respond in Bangla (Bengali). The question is: " : "";
      const finalQuery = langPrefix + queryText;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = new URL(`${API_BASE_URL}/query`);
      url.searchParams.append("query", finalQuery);
      url.searchParams.append("mode", researchMode);
      if (currentSessionId) url.searchParams.append("session_id", currentSessionId.toString());

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
      });

      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();

      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: data.response,
        sources_found: data.sources_found,
        citations: data.citations,
        sources: data.sources
      }]);

      // If a new session was created, update state
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        const newSession = { id: data.session_id, title: data.session_title, created_at: new Date().toISOString() };
        setSessions(prev => [newSession, ...prev]);
      }

    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I apologize, but I encountered an error connecting to the knowledge base. Please ensure the backend server is running.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const saveToLibrary = async (source: Source) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/library/save?source_type=${source.type}&source_id=${encodeURIComponent(source.id)}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(source.content)
      });
      if (res.ok) {
        alert("Citation saved to library!");
      }
    } catch (err) {
      console.error("Failed to save citation:", err);
    }
  };

  const handleClearAll = async () => {
    if (!token || !window.confirm(t.confirmClear)) return;
    try {
      // Clear all sessions
      for (const session of sessions) {
        await fetch(`http://127.0.0.1:8000/sessions/${session.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSessions([]);
      handleNewChat();
    } catch (err) {
      console.error("Failed to clear sessions:", err);
    }
  };

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-black uppercase tracking-widest">Loading Lab...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex selection:bg-emerald-500/30">
      <BackgroundAccents />
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-20 md:pl-64 h-screen">
        
        {/* Toggleable Sessions Sidebar (Secondary) */}
        <aside className={`fixed md:relative z-40 transition-all duration-300 ${isSidebarOpen ? "w-[300px] translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-[320px]"} h-full bg-slate-900/30 border-r border-slate-800 flex flex-col overflow-hidden`}>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">{t.history}</h2>
            <button className="md:hidden text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 shrink-0">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              {t.newChat}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-10">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => loadSessionMessages(session.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group/btn text-left ${
                      currentSessionId === session.id 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === session.id ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className="truncate text-xs font-bold leading-tight">{session.title}</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-500/10"
                    title={t.delete}
                  >
                    <HistoryIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center opacity-30">
                <HistoryIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">{t.noHistory}</p>
              </div>
            )}
          </nav>
          
          <div className="p-4 border-t border-slate-800 bg-slate-950/20">
             <button 
                onClick={handleClearAll}
                className="w-full text-[10px] font-black text-slate-600 hover:text-red-500 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.clearAll}
              </button>
          </div>
        </aside>

        {/* Chat Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
          
          {/* Top Navbar for Chat */}
          <header className="h-16 border-b border-slate-800/50 bg-[#020617]/40 backdrop-blur-xl flex items-center justify-between px-8 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-emerald-500" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t.researchMode}</span>
                <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  {t.scholarlyAssistant}
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-black text-[10px] uppercase tracking-widest"
                title="Export current transcript as PDF/Whitepaper"
              >
                <FileText className="w-3.5 h-3.5" />
                Export Research
              </button>

              <button
                onClick={() => setResearchMode(m => m === "standard" ? "comparative" : "standard")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${
                  researchMode === "comparative" 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                    : "border-slate-800 bg-slate-900/50 text-slate-500 hover:text-white"
                }`}
                title="Switch between Standard and Comparative Fiqh Analysis"
              >
                <LibraryIcon className="w-3.5 h-3.5" />
                {researchMode === "standard" ? "Standard" : "Comparative"}
              </button>

              <button
                onClick={() => setLanguage(l => l === "en" ? "bn" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-700 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <Globe className="w-3.5 h-3.5" />
                {language === "en" ? "English" : "বাংলা"}
              </button>
              
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Adv. Semantic Engine
              </div>
            </div>
          </header>

          {/* Messages Scrolling Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {messages.length === 1 && (
                <div className="py-20 text-center max-w-2xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-1000">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 active:rotate-12 transition-transform">
                      <Sparkles className="w-10 h-10 text-slate-950 fill-slate-950" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-scholarly">
                      {t.beginResearch}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {t.askAnything}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => executeSearch(q.text)}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800 transition-all group text-left relative overflow-hidden active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                           <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                              <Search className="w-4 h-4" />
                           </div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.suggested}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors relative z-10">{q.text}</p>
                        <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-12 h-12" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-5`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg mt-1 border border-white/10">
                      <Bot className="w-6 h-6 text-slate-950" />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 max-w-[85%]">
                    <div className={`p-6 rounded-3xl shadow-2xl ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-slate-950 rounded-tr-none font-bold text-sm"
                        : "bg-slate-900/60 backdrop-blur-md border border-slate-800 text-slate-300 rounded-tl-none"
                    }`}>
                      {msg.role === "assistant" ? (
                        <div className="text-sm leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-strong:text-emerald-400 prose-p:my-2 prose-blockquote:border-emerald-500 prose-code:text-indigo-300">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-3 mt-2">
                        {msg.sources.map((source, sIdx) => (
                          <div 
                            key={sIdx}
                            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-slate-700 transition-all relative group"
                          >
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${source.type === 'quran' ? 'bg-emerald-500/10 text-emerald-400' : source.type === 'hadith' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                     {source.type === 'quran' ? <BookOpen className="w-3.5 h-3.5" /> : source.type === 'hadith' ? <FileText className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{source.id}</span>
                                </div>
                                <button 
                                  onClick={() => saveToLibrary(source)}
                                  className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                                  title="Save to Library"
                                >
                                  <BookmarkPlus className="w-4 h-4" />
                                </button>
                             </div>
                             <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">
                                "{source.content}"
                             </p>
                             <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 mt-2">
                                View Reference <ChevronRight className="w-2.5 h-2.5" />
                             </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-4 px-2">
                        <button
                          onClick={() => copyToClipboard(msg.content, idx)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 hover:text-emerald-400 transition-all uppercase tracking-widest"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedIdx === idx ? t.copied : t.copy}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && user && (
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 mt-1 border border-slate-700">
                      <UserIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl rounded-tl-none p-6 min-w-[300px]">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0ms"}} />
                        <div className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce" style={{animationDelay: "150ms"}} />
                        <div className="w-2 h-2 bg-emerald-500/30 rounded-full animate-bounce" style={{animationDelay: "300ms"}} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.searching}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt / Input Area */}
          <div className="border-t border-slate-800/50 bg-[#020617]/40 backdrop-blur-xl p-6 shrink-0 z-20">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4 items-end">
              <div className="flex-1 relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as React.FormEvent);
                    }
                  }}
                  placeholder={t.promptPlaceholder}
                  rows={1}
                  className="w-full px-6 py-4 pr-16 rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all resize-none custom-scrollbar font-medium text-sm shadow-xl"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                />
                <div className="absolute right-4 bottom-3 text-slate-600">
                   <Sparkles className="w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 h-[56px] w-[56px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-2xl shadow-emerald-500/20 disabled:opacity-30 transition-all active:scale-90 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <Send className="w-6 h-6 fill-slate-950" />
                )}
              </button>
            </form>
            <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-4">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
