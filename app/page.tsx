'use client';

import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { CITIES } from '@/lib/types';
import { DOCTORS, CLINICS } from '@/lib/data';

/* ---------- Inline SVG icon set (CSS/SVG only, no external assets) ---------- */
function Icon({ name, className = 'h-6 w-6' }: { name: string; className?: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 5 3.4 8.4 7 10 3.6-1.6 7-5 7-10V6l-7-3Z" />
          <path d="m9.5 12 2 2 3.5-4" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 3.5 2.5 20h19L12 3.5Z" />
          <path d="M12 9.5v4.5" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'clinic':
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M12 9.5v5M9.5 12h5" />
        </svg>
      );
    case 'pill':
      return (
        <svg {...common}>
          <path d="m10.5 20.5-7-7a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      );
    case 'idcard':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <circle cx="8.5" cy="11" r="2" />
          <path d="M5.6 16c.6-1.7 1.7-2.5 2.9-2.5s2.3.8 2.9 2.5" />
          <path d="M14 9.5h5M14 13h5" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2c.6 5.5 2.5 7.4 8 8-5.5.6-7.4 2.5-8 8-.6-5.5-2.5-7.4-8-8 5.5-.6 7.4-2.5 8-8Z" />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M9 20h6M12 16v4" />
        </svg>
      );
    case 'db':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5.5" rx="8" ry="2.8" />
          <path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13" />
          <path d="M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8" />
        </svg>
      );
    case 'person':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 13 4 4L19 7" />
        </svg>
      );
    case 'chev':
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    default:
      return null;
  }
}

function Star({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5 14.9 8.6l6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
      {children}
    </p>
  );
}

const FEATURES = [
  { icon: 'chat', title: 'landing.f1t', desc: 'landing.f1d' },
  { icon: 'shield', title: 'landing.f2t', desc: 'landing.f2d' },
  { icon: 'alert', title: 'landing.f3t', desc: 'landing.f3d' },
  { icon: 'clinic', title: 'landing.f4t', desc: 'landing.f4d' },
  { icon: 'pill', title: 'landing.f5t', desc: 'landing.f5d' },
  { icon: 'idcard', title: 'landing.f6t', desc: 'landing.f6d' },
];

const STEPS = [
  { title: 'landing.step1t', desc: 'landing.step1d' },
  { title: 'landing.step2t', desc: 'landing.step2d' },
  { title: 'landing.step3t', desc: 'landing.step3d' },
];

const FAQS = [
  { q: 'landing.faq1q', a: 'landing.faq1a' },
  { q: 'landing.faq2q', a: 'landing.faq2a' },
  { q: 'landing.faq3q', a: 'landing.faq3a' },
  { q: 'landing.faq4q', a: 'landing.faq4a' },
  { q: 'landing.faq5q', a: 'landing.faq5a' },
];

const TESTIMONIALS = [
  { q: 'landing.t1', n: 'landing.t1n' },
  { q: 'landing.t2', n: 'landing.t2n' },
  { q: 'landing.t3', n: 'landing.t3n' },
];

export default function HomePage() {
  const { tr } = useLang();
  const verifiedCount = DOCTORS.filter((d) => d.verified).length;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="mesh-hero relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb left-[6%] top-[8%] h-64 w-64 animate-drift bg-brand-300/40" />
          <div className="orb right-[8%] top-[30%] h-72 w-72 animate-drift bg-sky-300/35 [animation-delay:-5s]" />
          <div className="orb left-[42%] top-[-10%] h-56 w-56 animate-float bg-brand-200/50" />
          <div className="bg-dots absolute inset-0 opacity-70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="stagger-1 inline-flex animate-rise items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-4 py-1.5 text-xs font-extrabold text-brand-700 shadow-card backdrop-blur">
                <Icon name="spark" className="h-3.5 w-3.5 text-brand-500" />
                {tr('landing.eyebrow')}
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
                  {tr('triage.simLabel')}
                </span>
              </span>

              <h1 className="stagger-2 mt-6 animate-rise text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
                {tr('landing.h1a')}{' '}
                <span className="text-gradient">{tr('landing.h1b')}</span>
              </h1>

              <p className="stagger-3 mx-auto mt-5 max-w-xl animate-rise text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                {tr('landing.sub')}
              </p>

              <div className="stagger-4 mt-8 flex animate-rise flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/triage" className="btn-primary-lg group">
                  <Icon name="chat" className="h-5 w-5" />
                  {tr('landing.ctaAsk')}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link href="/doctors" className="btn-secondary rounded-2xl px-8 py-4 text-base">
                  <Icon name="shield" className="h-5 w-5" />
                  {tr('landing.ctaBrowse')}
                </Link>
              </div>

              <p className="stagger-5 mt-5 animate-rise text-xs font-semibold text-slate-500">
                {tr('triage.disclaimer')}
              </p>
            </div>

            {/* Decorative CSS-only hero visual */}
            <div className="relative mx-1 sm:mx-4 lg:mx-0" aria-hidden="true">
              <div className="glass relative rounded-[1.75rem] p-5 shadow-lift sm:p-6">
                {/* Mock search */}
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  {tr('landing.mockSearch')}
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="flex-1 truncate rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-500 ring-1 ring-slate-200">
                    {tr('landing.mockCity')}
                  </span>
                  <span className="flex-1 truncate rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-500 ring-1 ring-slate-200">
                    {tr('landing.mockSpec')}
                  </span>
                  <span className="rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft">
                    {tr('landing.mockSearchBtn')}
                  </span>
                </div>
                {/* Specialty chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Dermatology', 'Dentistry', 'Cardiology', 'Pediatrics'].map((c, i) => (
                    <span
                      key={c}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        i === 0
                          ? 'bg-brand-600 text-white shadow-soft'
                          : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="hairline my-5" />

                {/* Sample doctor card */}
                <div className="flex items-start gap-3.5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-sky-100 text-brand-600 ring-1 ring-brand-200/70">
                    <Icon name="person" className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-base font-extrabold text-slate-900">
                      {tr('landing.mockName')}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {tr('landing.mockSample')}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {tr('landing.mockSpec')} · {tr('landing.mockCity')}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-3 py-1 text-xs font-extrabold text-white shadow-glow-sm">
                        <Icon name="shield" className="h-3.5 w-3.5" />
                        {tr('doctors.verified')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                        <span className="flex text-amber-400">
                          <Star /><Star /><Star /><Star /><Star />
                        </span>
                        4.9
                      </span>
                      <span className="text-xs text-slate-400">(128 {tr('landing.mockVisits')})</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="font-extrabold text-brand-700">PKR 2,500</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">8 {tr('doctors.yrsExp')}</span>
                    </div>
                  </div>
                </div>

                <span className="mt-5 block rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-center text-sm font-bold text-white shadow-soft">
                  {tr('landing.mockBook')}
                </span>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -right-2 top-16 animate-float rounded-2xl border border-emerald-200/70 bg-white/90 px-4 py-2.5 shadow-lift backdrop-blur sm:-right-5">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {tr('landing.mockBadge1')}
                </p>
              </div>
              <div className="absolute -left-2 bottom-14 animate-float rounded-2xl border border-brand-200/70 bg-white/90 px-4 py-2.5 shadow-lift backdrop-blur [animation-delay:-3s] sm:-left-5">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-brand-700">
                  <Icon name="chat" className="h-4 w-4 text-brand-500" />
                  {tr('landing.mockBadge2')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <dl className="stagger-5 mx-auto mt-14 grid max-w-2xl animate-rise grid-cols-3 gap-3 text-center sm:gap-4">
            {[
              { n: `${verifiedCount}+`, k: 'landing.statsDoctors' },
              { n: `${CITIES.length}`, k: 'home.stats.cities' },
              { n: `${CLINICS.length}`, k: 'landing.statsClinics' },
            ].map((s) => (
              <div key={s.k} className="glass rounded-3xl p-4 sm:p-6">
                <dt className="order-2 mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {tr(s.k)}
                </dt>
                <dd className="text-gradient order-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section aria-label={tr('landing.eyebrow')} className="border-b border-brand-100/60 bg-white/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 lg:grid-cols-4">
          {[
            { icon: 'shield', key: 'landing.trust1' },
            { icon: 'db', key: 'landing.trust2' },
            { icon: 'monitor', key: 'landing.trust3' },
            { icon: 'spark', key: 'triage.simLabel' },
          ].map((t) => (
            <div key={t.key} className="flex items-center justify-center gap-2.5 text-sm font-bold text-slate-600">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              {tr(t.key)}
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <Eyebrow>{tr('nav.features')}</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {tr('landing.featuresTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">{tr('landing.featuresSub')}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="card card-hover animate-rise p-6 sm:p-7"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3 text-white shadow-glow-sm">
                <Icon name={f.icon} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">{tr(f.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(f.desc)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="mesh-hero relative scroll-mt-24 overflow-hidden border-y border-brand-100/60">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="orb left-[10%] top-[20%] h-56 w-56 animate-drift bg-brand-300/30" />
          <div className="orb right-[12%] bottom-[10%] h-64 w-64 animate-drift bg-sky-300/30 [animation-delay:-8s]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <Eyebrow>{tr('nav.how')}</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {tr('landing.howTitle')}
          </h2>

          <div className="relative mt-10 grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="glass card-hover relative animate-rise rounded-3xl p-6 sm:p-7"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="pointer-events-none absolute right-5 top-4 bg-gradient-to-b from-brand-200 to-transparent bg-clip-text text-5xl font-extrabold text-transparent" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-extrabold text-white shadow-glow-sm">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">{tr(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tr(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIVE DEMO CTA BAND ============ */}
      <section id="browse" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-12 text-center shadow-deep sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="orb left-[5%] top-[-30%] h-64 w-64 animate-drift bg-sky-400/30" />
            <div className="orb right-[5%] bottom-[-40%] h-72 w-72 animate-drift bg-brand-300/25 [animation-delay:-6s]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1.2px, transparent 1.2px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur">
              <Icon name="spark" className="h-3.5 w-3.5" />
              {tr('triage.simLabel')}
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {tr('landing.bandTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100/90">{tr('landing.bandSub')}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/triage"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-brand-700 shadow-lift transition-all duration-200 hover:-translate-y-0.5 hover:shadow-deep active:translate-y-0"
              >
                <Icon name="chat" className="h-5 w-5" />
                {tr('landing.ctaAsk')}
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-extrabold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:translate-y-0"
              >
                <Icon name="shield" className="h-5 w-5" />
                {tr('landing.ctaBrowse')}
              </Link>
            </div>
            <p className="mt-6 text-xs font-semibold text-brand-200/80">{tr('triage.disclaimer')}</p>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <Eyebrow>{tr('landing.testiNote')}</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {tr('landing.testiTitle')}
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((tst, i) => (
            <figure
              key={tst.n}
              className="card card-hover flex animate-rise flex-col p-6 sm:p-7"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                <Star /><Star /><Star /><Star /><Star />
              </span>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">
                {tr(tst.q)}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-sky-100 text-brand-600 ring-1 ring-brand-200/70">
                  <Icon name="person" className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-slate-700">{tr(tst.n)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <Eyebrow>{tr('nav.faq')}</Eyebrow>
        <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {tr('landing.faqTitle')}
        </h2>

        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-[15px] font-extrabold text-slate-900">{tr(f.q)}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-transform duration-300 group-open:rotate-180">
                  <Icon name="chev" className="h-4 w-4" />
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{tr(f.a)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mesh-hero relative overflow-hidden rounded-[2rem] border border-brand-100/70 px-6 py-14 text-center shadow-card sm:px-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="orb left-[15%] top-[-40%] h-56 w-56 animate-drift bg-brand-300/40" />
            <div className="orb right-[15%] bottom-[-50%] h-56 w-56 animate-drift bg-sky-300/35 [animation-delay:-7s]" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-brand-950 sm:text-4xl">
              {tr('landing.finalTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">{tr('landing.finalSub')}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/triage" className="btn-primary-lg group">
                <Icon name="chat" className="h-5 w-5" />
                {tr('landing.ctaAsk')}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/doctors" className="btn-secondary rounded-2xl px-8 py-4 text-base">
                {tr('landing.ctaBrowse')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
