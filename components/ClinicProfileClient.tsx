'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from './LangProvider';
import { Stars, DoctorCard } from './DoctorBits';
import { getClinic, getDoctor, formatFee } from '@/lib/data';

export default function ClinicProfileClient() {
  const { tr } = useLang();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const clinic = getClinic(id);

  if (!clinic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-slate-500">Clinic not found.</p>
        <Link href="/clinics" className="mt-4 inline-block text-sm font-bold text-brand-600">
          {tr('clinics.back')}
        </Link>
      </div>
    );
  }

  const doctors = clinic.doctors.map(getDoctor).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/clinics" className="text-sm font-semibold text-brand-600 hover:text-brand-800">
        {tr('clinics.back')}
      </Link>

      {/* CSS placeholder gallery */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          'from-brand-200 to-brand-400',
          'from-sky-200 to-brand-300',
          'from-indigo-200 to-sky-300',
        ].map((g, i) => (
          <div
            key={i}
            className={`flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br ${g}`}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-14 w-14 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              {i === 0 && <path d="M3 21h18M5 21V8l7-5 7 5v13M12 12v6M9 15h6" />}
              {i === 1 && <path d="M4 10h16v10H4zM8 10V7a4 4 0 0 1 8 0v3M12 14v3" />}
              {i === 2 && <path d="M9 3h6v5l3 4v9H6v-9l3-4V3ZM9 8h6" />}
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{clinic.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {tr('clinics.address')}: {clinic.address}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {tr('clinics.timings')}: {clinic.timings} · {clinic.phone}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-calm-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tr('clinics.hygiene')}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Stars rating={clinic.hygiene} />
              <span className="text-lg font-extrabold text-brand-700">{clinic.hygiene.toFixed(1)} / 5</span>
            </div>
          </div>
          <div className="rounded-2xl bg-calm-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tr('clinics.wait')}</p>
            <p className="mt-1.5 text-lg font-extrabold text-brand-700">
              ~{clinic.avgWaitMins} {tr('clinics.min')}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tr('clinics.facilities')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {clinic.facilities.map((f) => (
              <span key={f} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fee table */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">{tr('clinics.feeTable')}</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
          {clinic.feeTable.map((row, i) => (
            <div
              key={row.service}
              className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-calm-50' : 'bg-white'}`}
            >
              <span className="font-medium text-slate-700">{row.service}</span>
              <span className="font-extrabold text-brand-700">{formatFee(row.fee)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="mt-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">{tr('clinics.doctors')}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {doctors.map((d) => d && <DoctorCard key={d.id} doctor={d} />)}
        </div>
      </section>
    </div>
  );
}
