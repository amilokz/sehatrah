'use client';

import Link from 'next/link';
import { useLang } from './LangProvider';

export default function Footer() {
  const { tr } = useLang();
  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
                  <path d="M12 21s-7.5-4.7-7.5-10.5A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 7.5 3.8C19.5 16.3 12 21 12 21Z" />
                  <path d="M12 8.5v5M9.5 11h5" />
                </svg>
              </span>
              <span className="text-lg font-extrabold text-white">
                Sehat<span className="text-brand-300">Rah</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-200">{tr('footer.tagline')}</p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.4Z" />
              </svg>
              {tr('footer.buildCta')}
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">{tr('footer.explore')}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ['/doctors', 'nav.doctors'],
                ['/clinics', 'nav.clinics'],
                ['/triage', 'nav.triage'],
                ['/medicine-check', 'nav.medicine'],
                ['/signup', 'nav.signup'],
              ].map(([href, key]) => (
                <li key={href}>
                  <Link href={href} className="text-brand-200 transition-colors hover:text-white">
                    {tr(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">{tr('footer.contact')}</h4>
            <p className="mt-3 text-sm text-brand-200">
              hello@sehatrah.demo
              <br />
              Rawalpindi, Pakistan
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-brand-300">
          {tr('footer.demoNote')}
        </div>
      </div>
    </footer>
  );
}
