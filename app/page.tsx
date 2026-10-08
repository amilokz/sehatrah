'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { CITIES, SPECIALTIES } from '@/lib/types';
import { DOCTORS } from '@/lib/data';

const STEPS = [
  { icon: 'chat', title: 'home.step1t', desc: 'home.step1d' },
  { icon: 'target', title: 'home.step2t', desc: 'home.step2d' },
  { icon: 'check', title: 'home.step3t', desc: 'home.step3d' },
];

const WHY = [
  { icon: 'shield', title: 'home.why1t', desc: 'home.why1d' },
  { icon: 'target', title: 'home.why2t', desc: 'home.why2d' },
  { icon: 'star', title: 'home.why3t', desc: 'home.why3d' },
];

function Icon({ name }: { name: string }) {
  const cls = 'h-6 w-6';
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: cls };
  if (name === 'chat')
    return (
      <svg {...common}>
        <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
      </svg>
    );
  if (name === 'target')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    );
  if (name === 'shield')
    return (
      <svg {...common}>
        <path d="M12 3 5 6v5c0 5 3.4 8.4 7 10 3.6-1.6 7-5 7-10V6l-7-3Z" />
        <path d="m9.5 12 2 2 3.5-4" />
      </svg>
    );
  if (name === 'star')
    return (
      <svg {...common}>
        <path d="M12 2.5 14.9 8.6l6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export default function HomePage() {
  const { tr } = useLang();
  const router = useRouter();
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');

  const verifiedCount = DOCTORS.filter((d) => d.verified).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (specialty) params.set('specialty', specialty);
    router.push(`/doctors${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="bg-dots bg-calm-50">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
              Demo · Sample data
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-brand-950 sm:text-5xl">
              {tr('home.tagline')}
            </h1>

            {/* Search card — try it immediately */}
            <form
              onSubmit={submit}
              className="mx-auto mt-8 grid gap-3 rounded-3xl border border-brand-100 bg-white p-4 text-left shadow-soft sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"
            >
              <div>
                <label htmlFor="home-city" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {tr('home.city')}
                </label>
                <select
                  id="home-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                >
                  <option value="">{tr('home.allCities')}</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="home-specialty" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {tr('home.specialty')}
                </label>
                <select
                  id="home-specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                >
                  <option value="">{tr('home.allSpecialties')}</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                {tr('home.searchBtn')}
              </button>
            </form>

            {/* AI triage CTA */}
            <Link
              href="/triage"
              className="group mx-auto mt-4 flex max-w-xl items-center gap-4 rounded-2xl border-2 border-dashed border-brand-300 bg-white/70 p-4 text-left transition-all hover:border-brand-500 hover:bg-white"
            >
              <span className="flex h-12 w-12 shrink-0 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white">
                <Icon name="chat" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-extrabold text-brand-900 group-hover:text-brand-700">
                  {tr('home.askAI')}
                </span>
                <span className="block text-sm text-slate-500">{tr('home.askAISub')}</span>
              </span>
              <span className="text-2xl text-brand-400 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 text-center">
            {[
              { n: `${verifiedCount}`, k: 'home.stats.doctors' },
              { n: `${CITIES.length}`, k: 'home.stats.cities' },
              { n: `${SPECIALTIES.length}`, k: 'home.stats.specialties' },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-brand-100 bg-white p-4 shadow-card">
                <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{s.n}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{tr(s.k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('home.howTitle')}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <span className="absolute right-5 top-4 text-4xl font-extrabold text-brand-100">{i + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name={s.icon} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{tr(s.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(s.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-brand-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('home.whyTitle')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl bg-calm-50 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
                  <Icon name={w.icon} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{tr(w.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(w.desc)}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/doctors"
              className="inline-block rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              {tr('home.searchBtn')} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
