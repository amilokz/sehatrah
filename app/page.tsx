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
      {/* HERO — premium calm mesh */}
      <section className="mesh-hero relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="orb left-[6%] top-[8%] h-64 w-64 animate-drift bg-brand-300/40" />
          <div className="orb right-[8%] top-[30%] h-72 w-72 animate-drift bg-sky-300/35 [animation-delay:-5s]" />
          <div className="orb left-[42%] top-[-10%] h-56 w-56 animate-float bg-brand-200/50" />
          <div className="bg-dots absolute inset-0 opacity-70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="stagger-1 inline-flex animate-rise items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-4 py-1.5 text-xs font-extrabold text-brand-700 shadow-card backdrop-blur">
              <span className="h-2 w-2 animate-pulse-soft rounded-full bg-gradient-to-r from-brand-500 to-sky-400" />
              Demo · Sample data
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
                {tr('triage.simLabel')}
              </span>
            </span>

            <h1 className="stagger-2 mt-6 animate-rise text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-6xl">
              <span className="text-gradient">SehatRah</span> — {tr('home.tagline')}
            </h1>

            {/* Search card — try it immediately */}
            <form
              onSubmit={submit}
              className="stagger-3 glass mx-auto mt-10 grid animate-rise gap-3 rounded-3xl p-4 text-left sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"
            >
              <div>
                <label htmlFor="home-city" className="label-base">
                  {tr('home.city')}
                </label>
                <select
                  id="home-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="select-base"
                >
                  <option value="">{tr('home.allCities')}</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="home-specialty" className="label-base">
                  {tr('home.specialty')}
                </label>
                <select
                  id="home-specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="select-base"
                >
                  <option value="">{tr('home.allSpecialties')}</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.8-3.8" />
                </svg>
                {tr('home.searchBtn')}
              </button>
            </form>

            {/* AI triage CTA */}
            <Link
              href="/triage"
              className="stagger-4 group mx-auto mt-5 flex max-w-xl animate-rise items-center gap-4 rounded-3xl border border-brand-200/70 bg-white/80 p-4 text-left shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-white hover:shadow-lift"
            >
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600 p-3 text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon name="chat" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-extrabold text-brand-950 group-hover:text-brand-700">
                  {tr('home.askAI')}
                </span>
                <span className="block text-sm text-slate-500">{tr('home.askAISub')}</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xl text-brand-500 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-brand-600 group-hover:text-white">
                →
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="stagger-5 mx-auto mt-12 grid max-w-3xl animate-rise grid-cols-3 gap-3 text-center sm:gap-4">
            {[
              { n: `${verifiedCount}`, k: 'home.stats.doctors' },
              { n: `${CITIES.length}`, k: 'home.stats.cities' },
              { n: `${SPECIALTIES.length}`, k: 'home.stats.specialties' },
            ].map((s) => (
              <div key={s.k} className="glass rounded-3xl p-4 sm:p-6">
                <p className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">{s.n}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {tr(s.k)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
          {tr('home.howTitle')}
        </p>
        <div className="relative mt-8 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block" aria-hidden />
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="card card-hover relative animate-rise p-6 sm:p-7"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="pointer-events-none absolute right-5 top-4 bg-gradient-to-b from-brand-100 to-transparent bg-clip-text text-5xl font-extrabold text-transparent" aria-hidden>
                {i + 1}
              </span>
              <span className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-3 text-brand-600 ring-1 ring-brand-200/60">
                <Icon name={s.icon} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">{tr(s.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(s.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="mesh-hero relative overflow-hidden border-y border-brand-100/60">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="orb left-[10%] top-[20%] h-56 w-56 animate-drift bg-brand-300/30" />
          <div className="orb right-[12%] bottom-[10%] h-64 w-64 animate-drift bg-sky-300/30 [animation-delay:-8s]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            {tr('home.whyTitle')}
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {WHY.map((w, i) => (
              <div
                key={w.title}
                className="glass card-hover rounded-3xl p-6 animate-rise sm:p-7"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3 text-white shadow-glow-sm">
                  <Icon name={w.icon} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">{tr(w.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(w.desc)}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/doctors" className="btn-primary-lg group">
              {tr('home.searchBtn')}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
