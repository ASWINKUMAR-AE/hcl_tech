import React, { useState } from 'react';
import { Sparkles, Bot, X, Send, User, Loader2 } from 'lucide-react';
import { aiAPI } from '../services/api';

export default function AIOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am PathFinder AI. I have analyzed your learning goal and progress context. Ask me anything about your roadmap or prerequisites!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat(userText);
      if (res.data && res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: res.data.data.ai_response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to the AI server right now, but feel free to check your recommendation explanation!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Orb Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-brand-500/40 hover:scale-110 transition-all duration-300"
          title="Ask PathFinder AI Assistant"
        >
          <div className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center group-hover:bg-transparent transition-colors">
            <Sparkles className="w-6 h-6 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
          </span>
        </button>
      )}

      {/* Conversational Drawer / Panel */}
      {isOpen && (
        <div className="w-96 h-[500px] glass-card rounded-2xl border border-brand-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 bg-dark-bg/95">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-brand-900/60 to-indigo-900/60 border-b border-dark-border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/30 flex items-center justify-center border border-brand-400/30">
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Ask PathFinder <span className="gradient-text">AI</span>
                </h3>
                <span className="text-[10px] text-cyan-400 font-medium">Context-Aware Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-brand-900 border border-brand-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/20'
                      : 'bg-dark-card border border-dark-border text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-900 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                <span>Thinking & retrieving learner context...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-dark-border bg-dark-card/50 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Why learn Node before Express?"
              className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
