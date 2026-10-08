'use client';

import { useState } from 'react';
import { useLang } from '@/components/LangProvider';
import PageHeader from '@/components/PageHeader';
import { MEDICINES } from '@/lib/data';

type State = 'idle' | 'found' | 'notfound';

export default function MedicineCheckPage() {
  const { tr } = useLang();
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [state, setState] = useState<State>('idle');
  const [matched, setMatched] = useState<(typeof MEDICINES)[number] | null>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().toLowerCase();
    const b = batch.trim().toLowerCase();
    const hit = MEDICINES.find(
      (m) => m.name.toLowerCase().includes(n) && m.batch.toLowerCase() === b,
    );
    if (n && hit) {
      setMatched(hit);
      setState('found');
    } else {
      setMatched(null);
      setState('notfound');
    }
  };

  const fillSample = () => {
    setName('Paracetamol 500mg');
    setBatch('SP-2201');
    setState('idle');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('nav.medicine')} title={tr('med.title')} subtitle={tr('med.subtitle')} />

      <form onSubmit={check} className="card stagger-2 mt-8 animate-rise p-6 shadow-lift sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="med-name" className="label-base">
              {tr('med.name')}
            </label>
            <input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paracetamol 500mg"
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="med-batch" className="label-base">
              {tr('med.batch')}
            </label>
            <input
              id="med-batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="SP-2201"
              className="input-base"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary">
            {tr('med.check')}
          </button>
          <button type="button" onClick={fillSample} className="btn-ghost">
            {tr('med.trySample')} Paracetamol 500mg / SP-2201
          </button>
        </div>
      </form>

      {state === 'found' && matched && (
        <div className="mt-5 animate-pop-in overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-50 to-white shadow-[0_12px_32px_-12px_rgba(16,185,129,0.45)]">
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" aria-hidden />
          <div className="p-6">
          <p className="flex items-center gap-2.5 text-lg font-extrabold text-emerald-700">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.7)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8Z" />
              </svg>
            </span>
            {tr('med.registered')}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2"><dt className="font-bold text-slate-500">{tr('med.name')}:</dt><dd className="font-semibold text-slate-800">{matched.name}</dd></div>
            <div className="flex gap-2"><dt className="font-bold text-slate-500">{tr('med.batch')}:</dt><dd className="rounded bg-slate-100 px-2 font-mono text-xs font-bold text-slate-700">{matched.batch}</dd></div>
            <div className="flex gap-2"><dt className="font-bold text-slate-500">{tr('med.manufacturer')}:</dt><dd className="font-semibold text-slate-800">{matched.manufacturer}</dd></div>
          </dl>
          </div>
        </div>
      )}

      {state === 'notfound' && (
        <div className="mt-5 animate-pop-in overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-[0_12px_32px_-12px_rgba(217,119,6,0.4)]">
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" aria-hidden />
          <div className="p-6">
          <p className="flex items-center gap-2.5 text-lg font-extrabold text-amber-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.7)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2 1.5 21h21L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
              </svg>
            </span>
            {tr('med.notFound')}
          </p>
          <p className="mt-3 text-sm font-medium leading-relaxed text-amber-900">{tr('med.notFoundBody')}</p>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">{tr('med.note')}</p>
    </div>
  );
}
