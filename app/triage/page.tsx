'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { triageSymptoms, type TriageResult } from '@/lib/triage';

interface Msg {
  id: number;
  from: 'user' | 'ai';
  text: string;
  result?: TriageResult;
}

let msgId = 0;
const nextId = () => ++msgId;

function hasSpeechRecognition(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export default function TriagePage() {
  const { tr, lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: nextId(), from: 'ai', text: tr('triage.greeting') }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (!hasSpeechSynthesis()) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
      u.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    } catch {
      setSpeaking(false);
    }
  };

  const stopSpeak = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    setSpeaking(false);
  };

  const respond = (userText: string) => {
    const result = triageSymptoms(userText);
    const reason = lang === 'ur' ? result.reasonUr : result.reasonEn;
    let text: string;
    if (result.kind === 'emergency') {
      text = `${tr('triage.emergencyTitle')}: ${tr('triage.emergencyBody')}`;
    } else {
      const intro =
        lang === 'ur'
          ? `Aap ko ${result.specialty} se milna chahiye.`
          : `You should see a ${result.specialty}.`;
      text = `${intro} ${reason}`;
    }
    const aiMsg: Msg = { id: nextId(), from: 'ai', text, result };
    setMessages((m) => [...m, aiMsg]);
    // Auto-read the reply aloud only if the user used voice
    return aiMsg;
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { id: nextId(), from: 'user', text }]);
    window.setTimeout(() => respond(text), 450);
  };

  const startListening = () => {
    if (!hasSpeechRecognition()) return;
    try {
      const w = window as unknown as {
        SpeechRecognition?: new () => any;
        webkitSpeechRecognition?: new () => any;
      };
      const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      setListening(true);
      rec.onresult = (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => {
        const transcript = e.results[0][0].transcript as string;
        setListening(false);
        send(transcript);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const voiceSupported = hasSpeechRecognition();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7v3a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7Zm-3 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
          </svg>
          {tr('triage.simLabel')}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('triage.title')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{tr('triage.subtitle')}</p>
      </div>

      {/* Chat card */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-soft">
        <div ref={scrollRef} className="chat-scroll h-[380px] space-y-4 overflow-y-auto bg-calm-50 p-4 sm:h-[420px] sm:p-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.from === 'user'
                    ? 'rounded-br-sm bg-brand-600 text-white'
                    : m.result?.kind === 'emergency'
                      ? 'rounded-bl-sm border-2 border-red-300 bg-red-50 text-red-900'
                      : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-card'
                }`}
              >
                {m.result?.kind === 'emergency' && (
                  <p className="mb-1 flex items-center gap-1.5 text-sm font-extrabold text-red-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M12 2 1.5 21h21L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
                    </svg>
                    {tr('triage.emergencyTitle')}
                  </p>
                )}
                <p>{m.text}</p>
                {m.from === 'ai' && m.result?.kind === 'specialist' && m.result.specialty && (
                  <Link
                    href={`/doctors?specialty=${encodeURIComponent(m.result.specialty)}`}
                    className="mt-2.5 inline-block rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700"
                  >
                    {tr('triage.findDoctors')} →
                  </Link>
                )}
                {m.from === 'ai' && hasSpeechSynthesis() && (
                  <button
                    type="button"
                    onClick={() => (speaking ? stopSpeak() : speak(m.text))}
                    className="mt-2 block text-xs font-semibold text-brand-600 hover:text-brand-800"
                    aria-label={speaking ? 'Stop' : 'Listen'}
                  >
                    {speaking ? '⏹ Stop' : '🔊 Listen'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Always-visible disclaimer */}
        <p className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-semibold text-amber-800 sm:px-6">
          ⚠️ {tr('triage.disclaimer')}
        </p>

        {/* Input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 border-t border-slate-100 p-3 sm:p-4"
        >
          <button
            type="button"
            onClick={startListening}
            disabled={!voiceSupported || listening}
            title={voiceSupported ? tr('triage.listen') : tr('triage.noVoice')}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
              listening
                ? 'animate-pulse bg-red-500 text-white'
                : voiceSupported
                  ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                  : 'cursor-not-allowed bg-slate-100 text-slate-300'
            }`}
            aria-label={tr('triage.listen')}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? tr('triage.listening') : tr('triage.placeholder')}
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label={tr('triage.placeholder')}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            {tr('triage.send')}
          </button>
        </form>
        {!voiceSupported && (
          <p className="bg-slate-50 px-4 pb-3 text-center text-[11px] text-slate-400">{tr('triage.noVoice')}</p>
        )}
      </div>
    </div>
  );
}
