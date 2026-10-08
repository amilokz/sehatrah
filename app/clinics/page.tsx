'use client';

import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { Stars } from '@/components/DoctorBits';
import PageHeader from '@/components/PageHeader';
import { CLINICS, getDoctor, initials } from '@/lib/data';

function ClinicArt({ seed }: { seed: number }) {
  // Pure CSS/SVG placeholder "photo" — layered gradient with soft geometry
  const hues = [
    'from-brand-300 via-brand-200 to-sky-200',
    'from-sky-300 via-brand-200 to-indigo-200',
    'from-indigo-300 via-sky-200 to-brand-200',
    'from-cyan-200 via-brand-200 to-sky-300',
  ];
  return (
    <div className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${hues[seed % hues.length]}`} aria-hidden>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/25" />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/15" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/50 shadow-card ring-1 ring-white/60 backdrop-blur">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand-600/80" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V8l7-5 7 5v13" />
          <path d="M12 12v6M9 15h6" />
        </svg>
      </span>
    </div>
  );
}

export default function ClinicsPage() {
  const { tr } = useLang();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('nav.clinics')} title={tr('clinics.title')} subtitle={tr('clinics.subtitle')} />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CLINICS.map((c, i) => (
          <Link
            key={c.id}
            href={`/clinics/${c.id}`}
            className="group card card-hover animate-rise overflow-hidden"
            style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}
          >
            <ClinicArt seed={i} />
            <div className="p-5">
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-700">{c.name}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{c.city}</p>
              <div className="mt-3 flex items-center gap-2">
                <Stars rating={c.hygiene} className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700">
                  {c.hygiene.toFixed(1)} · {tr('clinics.hygiene')}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                ⏱ {tr('clinics.wait')}: <span className="font-bold text-slate-700">{c.avgWaitMins} {tr('clinics.min')}</span>
              </p>
              <div className="mt-4 flex -space-x-2">
                {c.doctors.slice(0, 4).map((did) => {
                  const d = getDoctor(did);
                  if (!d) return null;
                  return (
                    <span
                      key={did}
                      title={d.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-[10px] font-extrabold text-white ring-2 ring-white"
                    >
                      {initials(d.name)}
                    </span>
                  );
                })}
                <span className="ml-3 self-center text-xs font-semibold text-slate-500">
                  {c.doctors.length} {tr('clinics.doctors').toLowerCase()}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white">
                {tr('clinics.viewClinic')}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
