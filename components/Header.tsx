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
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SehatRah home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
              <path d="M12 21s-7.5-4.7-7.5-10.5A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 7.5 3.8C19.5 16.3 12 21 12 21Z" />
              <path d="M12 8.5v5M9.5 11h5" />
            </svg>
          </span>
          <span className="text-xl font-extrabold tracking-tight text-brand-900">
            Sehat<span className="text-brand-600">Rah</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'
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
            className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'اردو' : 'EN'}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand-100 bg-white px-4 py-2 lg:hidden" aria-label="Mobile navigation">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === l.href ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tr(l.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
