import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Send, X, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';

export const ChatbotWidget = () => {
  const { chatMessages, sendChatMessage, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleQuickPrompt = (promptText) => {
    sendChatMessage(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transition flex items-center gap-2 border border-indigo-400/30"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="hidden sm:inline text-xs font-bold pr-1">Freewheel AI Assistant</span>
          <span className="w-3 h-3 rounded-full bg-emerald-500 absolute top-0 right-0 ring-4 ring-white"></span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl w-[360px] sm:w-[420px] h-[520px] shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Freewheel AI Assistant
                  <span className="text-[9px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">Gemini 3.6 Flash</span>
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Context Aware
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs bg-slate-50">
            {chatMessages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-xl ${
                      isBot
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                        : 'bg-indigo-600 text-white font-medium'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1.5 ${
                        isBot ? 'text-slate-400' : 'text-indigo-200'
                      } text-right`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts without emojis */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleQuickPrompt("Summarize unbilled hours")}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 border border-slate-200 whitespace-nowrap transition font-medium"
            >
              Unbilled Hours
            </button>
            <button
              onClick={() => handleQuickPrompt("What projects are currently in progress?")}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 border border-slate-200 whitespace-nowrap transition font-medium"
            >
              Active Projects
            </button>
            <button
              onClick={() => {
                setActiveTab('showcase');
                handleQuickPrompt("Inspect completed project history & past deliverables audit");
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 border border-slate-200 whitespace-nowrap transition font-medium"
            >
              Project History
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI agent a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
