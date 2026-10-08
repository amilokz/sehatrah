'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from './LangProvider';

const LINKS = [
  { href: '/', key: 'nav.home' },
  { href: '/doctors', key: 'nav.doctors' },
  { href: '/clinics', key: 'nav.clinics' },
  { href: '/triage', key: 'nav.triage' },
  { href: '/medicine-check', key: 'nav.medicine' },
  { href: '/signup', key: 'nav.signup' },
  { href: '/admin', key: 'nav.admin' },
];

export default function Header() {
  const { tr, lang, toggleLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 shadow-[0_1px_12px_-4px_rgba(37,99,235,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="SehatRah home">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 shadow-soft ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
              <path d="M12 21s-7.5-4.7-7.5-10.5A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 7.5 3.8C19.5 16.3 12 21 12 21Z" />
              <path d="M12 8.5v5M9.5 11h5" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-sky-300 ring-2 ring-white" aria-hidden />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-brand-950">
            Sehat<span className="text-gradient">Rah</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/60 p-1 shadow-card backdrop-blur lg:flex" aria-label="Main navigation">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {tr(l.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-brand-200 bg-gradient-to-b from-brand-50 to-white px-3.5 py-1.5 text-xs font-extrabold text-brand-700 shadow-card transition-all duration-200 hover:border-brand-300 hover:shadow-soft active:scale-95"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'اردو' : 'EN'}
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-card transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-rise border-t border-brand-100/70 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          <div className="grid gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  pathname === l.href
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-soft'
                    : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {tr(l.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
