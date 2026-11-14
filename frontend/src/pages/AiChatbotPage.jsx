import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCcw, 
  HelpCircle,
  CheckCircle2,
  User,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recordHistoryEvent } from '../services/historyService';

export const AiChatbotPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I'm your OrganCare Health Assistant. I can help explain human anatomy, organ functions, evidence-informed nutrition, and when to consult a specialist.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    "What does the liver do?",
    "Best foods for heart health?",
    "Why are kidneys important?",
    "What are warning signs of lung problems?",
    "Which specialist treats kidney conditions?",
    "How does the stomach digest food?"
  ];

  const handleSend = async (messageText = input) => {
    const textToSend = (typeof messageText === 'string' ? messageText : input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Record into user search history if logged in
    if (currentUser) {
      recordHistoryEvent(currentUser.uid, {
        title: `AI Prompt: ${textToSend.slice(0, 35)}...`,
        type: 'search',
        path: '/ai-assistant',
        details: textToSend
      });
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      if (data.isEmergency) {
        setEmergencyAlert(data.reply);
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I am currently unable to process your question. Please try again shortly.",
        isEmergency: data.isEmergency,
        disclaimer: data.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a connection issue while communicating with the healthcare intelligence server. Please check your network and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Emergency Alert Modal if triggered */}
        {emergencyAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center text-rose-950">Emergency Warning Detected</h3>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed text-center">
                {emergencyAlert}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="tel:911"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm text-center shadow-lg shadow-rose-600/30"
                >
                  Call Emergency Services (911 / 112)
                </a>
                <button
                  onClick={() => setEmergencyAlert(null)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Dismiss & Return to Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- CHATBOT INTERFACE CONTAINER (Matches Reference Layout) ----------------- */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Hero Sidebar: Robot Character & Suggested Chips */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-teal-50/70 via-slate-50 to-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                AI Health Intelligence
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
                Ask Your <br />
                <span className="text-brand-600">Health Assistant</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Get evidence-based answers about organs, nutrition, symptoms and healthy living.
              </p>

              {/* Friendly Robot Avatar Illustration */}
              <div className="my-6 flex justify-center">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-400 to-cyan-500 p-1 shadow-lg shadow-brand-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center text-teal-300">
                    <Bot className="w-16 h-16 animate-float" />
                  </div>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-2.5">
                  Frequently Asked Questions:
                </span>
                <div className="flex flex-col gap-2">
                  {quickPrompts.slice(0, 4).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 text-xs font-semibold text-slate-700 hover:text-brand-700 transition-all shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety Protocol Badge */}
            <div className="mt-6 p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Medical Safety:</strong> No personal diagnoses or prescriptions provided. Always consult a physician for medical conditions.
              </span>
            </div>
          </div>

          {/* Right Area: Interactive Chat Stream */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white">
            
            {/* Messages Scroll Area */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto max-h-[500px]">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isUser ? 'bg-navy-900 text-white' : 'bg-brand-500 text-white shadow-sm'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Speech Bubble */}
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-navy-900 text-white rounded-tr-none'
                        : msg.isEmergency
                        ? 'bg-rose-50 text-rose-950 border border-rose-200 rounded-tl-none font-semibold'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {msg.disclaimer && (
                        <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                          {msg.disclaimer}
                        </div>
                      )}

                      <span className={`block text-[10px] mt-1.5 ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-100 text-slate-500 text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></div>
                    <span>Consulting medical knowledge base...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question about organs, nutrition, or symptoms..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 shadow-sm"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-brand-500/20 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
