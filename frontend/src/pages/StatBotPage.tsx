import React, { useState } from 'react';
import { Bot, Send, User as UserIcon, Sparkles, MessageSquare, BookOpen } from 'lucide-react';
import { User } from '../types';
import { aiService } from '../services/api';

interface StatBotPageProps {
  user: User;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const StatBotPage: React.FC<StatBotPageProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: `Hello ${user.full_name}! I am StatBot, your AI Learning Assistant for India's Official Statistical System. I see you are a ${user.designation} in ${user.department?.name || 'MoSPI'} with an overall competency score of ${user.overall_competency_score}%. How can I help you master statistical concepts or Python data engineering today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const suggestedPrompts = [
    "Explain stratified sampling vs cluster sampling",
    "Why is data privacy crucial under DPDP Act 2023?",
    "How do I use Python Pandas for survey data cleaning?",
    "Which course should I take next to improve Cloud Computing score?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setSending(true);

    try {
      const res = await aiService.chat(query, user.email);
      const botMsg: ChatMessage = {
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white">StatBot AI Assistant</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                MoSPI Domain Trained
              </span>
            </div>
            <p className="text-xs text-slate-400">Contextualized for {user.full_name} • {user.designation}</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-1 shrink-0 custom-scrollbar">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-900 whitespace-nowrap transition shadow-sm"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 overflow-y-auto space-y-4 shadow-sm custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-amber-400 border border-slate-800'
              }`}
            >
              {msg.sender === 'user' ? 'AS' : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div className={`text-[10px] mt-1.5 font-mono ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 text-amber-500 animate-spin" />
            <span>StatBot is formulating an answer...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask StatBot about statistical methods, Python, R, SQL, or iGOT courses..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !input.trim()}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold shadow-md transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
