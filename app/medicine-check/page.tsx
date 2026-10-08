'use client';

import { useState } from 'react';
import { useLang } from '@/components/LangProvider';
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-center text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('med.title')}</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">{tr('med.subtitle')}</p>

      <form onSubmit={check} className="mt-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="med-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              {tr('med.name')}
            </label>
            <input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paracetamol 500mg"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="med-batch" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              {tr('med.batch')}
            </label>
            <input
              id="med-batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="SP-2201"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            {tr('med.check')}
          </button>
          <button type="button" onClick={fillSample} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
            {tr('med.trySample')} Paracetamol 500mg / SP-2201
          </button>
        </div>
      </form>

      {state === 'found' && matched && (
        <div className="mt-5 animate-rise rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6">
          <p className="flex items-center gap-2 text-lg font-extrabold text-emerald-700">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8Z" />
            </svg>
            {tr('med.registered')}
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex gap-2"><dt className="font-bold text-slate-600">{tr('med.name')}:</dt><dd className="text-slate-800">{matched.name}</dd></div>
            <div className="flex gap-2"><dt className="font-bold text-slate-600">{tr('med.batch')}:</dt><dd className="font-mono text-slate-800">{matched.batch}</dd></div>
            <div className="flex gap-2"><dt className="font-bold text-slate-600">{tr('med.manufacturer')}:</dt><dd className="text-slate-800">{matched.manufacturer}</dd></div>
          </dl>
        </div>
      )}

      {state === 'notfound' && (
        <div className="mt-5 animate-rise rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
          <p className="flex items-center gap-2 text-lg font-extrabold text-amber-800">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M12 2 1.5 21h21L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
            </svg>
            {tr('med.notFound')}
          </p>
          <p className="mt-2 text-sm font-medium text-amber-900">{tr('med.notFoundBody')}</p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-400">{tr('med.note')}</p>
    </div>
  );
}
