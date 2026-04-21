import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, AlertTriangle, RefreshCw, Stethoscope, Pill, Thermometer, Heart, Activity, Brain, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const QUICK_SYMPTOMS = [
  { label: 'Chest Pain', icon: Heart },
  { label: 'High Fever', icon: Thermometer },
  { label: 'Shortness of Breath', icon: Activity },
  { label: 'Severe Headache', icon: Brain },
  { label: 'Dizziness', icon: Zap },
  { label: 'Nausea & Vomiting', icon: Pill },
];

const SYSTEM_PROMPT = `You are an AI medical assistant integrated into Sanctuary Health Information System (HIS). Your role is to help healthcare professionals with symptom analysis and triage support.

When a user describes symptoms:
1. List the most likely differential diagnoses (top 3-5) with brief reasoning
2. Suggest urgency level: CRITICAL / HIGH / MODERATE / LOW
3. Recommend immediate next steps (tests, specialist referral, etc.)
4. Flag any red-flag symptoms requiring immediate attention

IMPORTANT: Always remind that this is a clinical decision-support tool only — not a replacement for professional medical judgment. Keep responses concise, structured, and clinically accurate. Use medical terminology appropriately.

Format your response with clear sections using these exact headings:
**URGENCY LEVEL:** [level]
**DIFFERENTIAL DIAGNOSES:**
**RECOMMENDED ACTIONS:**
**RED FLAGS TO MONITOR:**
**DISCLAIMER:**`;

export default function AISymptomChecker() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the Sanctuary AI Clinical Assistant. Describe the patient's symptoms and I'll provide a differential diagnosis and triage guidance.\n\nYou can type symptoms below or select a quick-start option.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.map(b => b.text).join('') || 'No response received.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please check your network and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm the Sanctuary AI Clinical Assistant. Describe the patient's symptoms and I'll provide a differential diagnosis and triage guidance.\n\nYou can type symptoms below or select a quick-start option.",
    }]);
    setInput('');
  };

  const urgencyColor = (text) => {
    if (text.includes('CRITICAL')) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (text.includes('HIGH')) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    if (text.includes('MODERATE')) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
  };

  const formatMessage = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**URGENCY LEVEL:**')) {
        return (
          <div key={i} className={cn('px-3 py-2 rounded-lg border text-sm font-bold mb-2', urgencyColor(line))}>
            🚨 {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1 text-sm">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={i} className="ml-4 text-sm text-slate-700 dark:text-slate-300 list-disc">{line.substring(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-sm text-slate-700 dark:text-slate-300">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <Bot size={26} className="text-primary" /> AI Symptom Checker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Clinical decision support powered by AI — for healthcare professionals</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <RefreshCw size={14} /> New Session
        </button>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
          This tool is for <strong>clinical decision support only</strong>. Always apply professional medical judgment. Not a substitute for diagnosis by a licensed physician.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Quick symptoms sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Start</p>
            <div className="space-y-2">
              {QUICK_SYMPTOMS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(`Patient presenting with: ${label}. Please provide differential diagnosis and triage guidance.`)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10 transition-all"
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Tips</p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>• Include symptom duration</li>
              <li>• Mention severity (1–10)</li>
              <li>• Add patient age & sex</li>
              <li>• Note any existing conditions</li>
              <li>• List current medications</li>
            </ul>
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden" style={{ minHeight: '500px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '520px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-primary')}>
                  {msg.role === 'user' ? <User size={14} /> : <Stethoscope size={14} />}
                </div>
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-slate-50 dark:bg-slate-800 rounded-tl-sm border border-slate-100 dark:border-slate-700')}>
                  {msg.role === 'assistant' ? (
                    <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={14} className="text-primary" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    Analyzing symptoms…
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex gap-3">
              <textarea
                rows={2}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Describe patient symptoms, age, duration… (Enter to send, Shift+Enter for new line)"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all placeholder:text-slate-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 self-end"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
