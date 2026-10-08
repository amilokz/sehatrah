'use client';

import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { Stars } from '@/components/DoctorBits';
import { CLINICS, getDoctor, initials } from '@/lib/data';

function ClinicArt({ seed }: { seed: number }) {
  // Pure CSS/SVG placeholder "photo"
  const hues = [
    'from-brand-100 to-brand-300',
    'from-sky-100 to-brand-200',
    'from-indigo-100 to-sky-200',
    'from-cyan-100 to-brand-200',
  ];
  return (
    <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${hues[seed % hues.length]}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-brand-400/70" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V8l7-5 7 5v13" />
        <path d="M12 12v6M9 15h6" />
      </svg>
    </div>
  );
}

export default function ClinicsPage() {
  const { tr } = useLang();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('clinics.title')}</h1>
      <p className="mt-1.5 text-sm text-slate-500">{tr('clinics.subtitle')}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CLINICS.map((c, i) => (
          <Link
            key={c.id}
            href={`/clinics/${c.id}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
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
              <div className="mt-3 flex items-center gap-1.5">
                {c.doctors.slice(0, 4).map((did) => {
                  const d = getDoctor(did);
                  if (!d) return null;
                  return (
                    <span
                      key={did}
                      title={d.name}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[10px] font-extrabold text-white"
                    >
                      {initials(d.name)}
                    </span>
                  );
                })}
                <span className="ml-1 text-xs text-slate-400">
                  {c.doctors.length} {tr('clinics.doctors').toLowerCase()}
                </span>
              </div>
              <span className="mt-4 inline-block text-sm font-bold text-brand-600 group-hover:text-brand-800">
                {tr('clinics.viewClinic')} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
