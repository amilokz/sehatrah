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
          'from-brand-300 via-brand-200 to-sky-200',
          'from-sky-300 via-brand-200 to-indigo-200',
          'from-indigo-300 via-sky-200 to-brand-200',
        ].map((g, i) => (
          <div
            key={i}
            className={`relative flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${g} shadow-card`}
            aria-hidden
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/25" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/15" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/50 ring-1 ring-white/60 backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand-600/80" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                {i === 0 && <path d="M3 21h18M5 21V8l7-5 7 5v13M12 12v6M9 15h6" />}
                {i === 1 && <path d="M4 10h16v10H4zM8 10V7a4 4 0 0 1 8 0v3M12 14v3" />}
                {i === 2 && <path d="M9 3h6v5l3 4v9H6v-9l3-4V3ZM9 8h6" />}
              </svg>
            </span>
          </div>
        ))}
      </div>

      <div className="card animate-rise relative mt-6 overflow-hidden p-6 shadow-lift sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-100/70 to-transparent" aria-hidden />
        <div className="relative">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">{clinic.name}</h1>
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
              <span key={f} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Fee table */}
      <section className="card animate-rise mt-6 p-6 sm:p-7">
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />{tr('clinics.feeTable')}</h2>
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
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />{tr('clinics.doctors')}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {doctors.map((d) => d && <DoctorCard key={d.id} doctor={d} />)}
        </div>
      </section>
    </div>
  );
}
