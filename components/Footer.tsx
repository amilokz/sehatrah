'use client';

import Link from 'next/link';
import { useLang } from './LangProvider';

export default function Footer() {
  const { tr } = useLang();
  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-950 text-brand-100">
      {/* Gradient hairline + ambient glow */}
      <div className="hairline absolute inset-x-0 top-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="orb left-[8%] top-[-40%] h-72 w-72 animate-drift bg-brand-500/25" />
        <div className="orb right-[5%] top-[10%] h-56 w-56 animate-drift bg-sky-400/20 [animation-delay:-7s]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(rgba(147,197,253,0.14) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 shadow-glow-sm ring-1 ring-white/30">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
                  <path d="M12 21s-7.5-4.7-7.5-10.5A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 7.5 3.8C19.5 16.3 12 21 12 21Z" />
                  <path d="M12 8.5v5M9.5 11h5" />
                </svg>
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Sehat<span className="text-brand-300">Rah</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-200/90">{tr('footer.tagline')}</p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.7)] active:translate-y-0"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.4Z" />
              </svg>
              {tr('footer.buildCta')}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <nav aria-label="Footer">
            <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/90">{tr('footer.explore')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/doctors', 'nav.doctors'],
                ['/clinics', 'nav.clinics'],
                ['/triage', 'nav.triage'],
                ['/medicine-check', 'nav.medicine'],
                ['/signup', 'nav.signup'],
              ].map(([href, key]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-brand-200/90 transition-all duration-200 hover:translate-x-1 hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-300 transition-all duration-200 group-hover:w-3" aria-hidden />
                    {tr(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/90">{tr('footer.contact')}</h4>
            <p className="mt-4 text-sm leading-relaxed text-brand-200/90">
              hello@sehatrah.demo
              <br />
              Rawalpindi, Pakistan
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-200/80">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" aria-hidden />
              Demo · Sample data
            </p>
          </div>
        </div>

        <div className="hairline mt-12 opacity-60" aria-hidden />
        <div className="pt-6 text-center text-xs font-medium tracking-wide text-brand-300/80">
          {tr('footer.demoNote')}
        </div>
      </div>
    </footer>
  );
}
