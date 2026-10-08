'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { InitialsAvatar, VerifiedBadge, Stars } from '@/components/DoctorBits';
import WhatsAppMock from '@/components/WhatsAppMock';
import { getClinic, getReviews, formatFee } from '@/lib/data';
import { doctorsWithOverrides } from '@/lib/overrides';
import { readJSON, writeJSON } from '@/lib/storage';
import type { Booking } from '@/lib/types';

const SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '5:00 PM', '6:30 PM', '8:00 PM'];

function nextDays(n: number): { label: string; date: string }[] {
  const days: { label: string; date: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      date: d.toISOString().slice(0, 10),
    });
  }
  return days;
}

export default function DoctorProfileClient() {
  const { tr, lang } = useLang();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const doctor = doctorsWithOverrides().find((d) => d.id === id);

  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [booked, setBooked] = useState<Booking | null>(null);
  const [reportMsg, setReportMsg] = useState('');

  const days = useMemo(() => nextDays(4), []);
  const reviews = useMemo(() => (doctor ? getReviews(doctor.id) : []), [doctor]);
  const hiddenReviews = useMemo(() => readJSON<string[]>('hidden-reviews', []), []);
  const visibleReviews = reviews.filter((_, i) => !hiddenReviews.includes(`${id}-${i}`));

  useEffect(() => {
    setDayIdx(0);
    setSlot(null);
    setBooked(null);
    setError('');
    setReportMsg('');
  }, [id]);

  if (!doctor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-slate-500">Doctor not found.</p>
        <Link href="/doctors" className="mt-4 inline-block text-sm font-bold text-brand-600">
          {tr('profile.back')}
        </Link>
      </div>
    );
  }

  const confirm = () => {
    if (!slot || !name.trim() || !phone.trim()) {
      setError(tr('common.required'));
      return;
    }
    setError('');
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: days[dayIdx].date,
      slot,
      patientName: name.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };
    const all = readJSON<Booking[]>('bookings', []);
    writeJSON('bookings', [...all, booking]);
    setBooked(booking);
  };

  const dayLabel = (i: number) =>
    i === 0 ? tr('common.today') : i === 1 ? tr('common.tomorrow') : days[i].label;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/doctors" className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors hover:text-brand-800">
        <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
        {tr('profile.back')}
      </Link>

      {/* Header card */}
      <div className="card animate-rise relative mt-4 overflow-hidden p-6 shadow-lift sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-100/70 to-transparent" aria-hidden />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <InitialsAvatar name={doctor.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">{doctor.name}</h1>
              {doctor.verified && <VerifiedBadge />}
            </div>
            <p className="mt-1 font-medium text-brand-700">{doctor.specialty}</p>
            <p className="mt-1 text-sm text-slate-500">
              {doctor.city} · {doctor.experience} {tr('profile.years')} {tr('profile.experience').toLowerCase()}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Stars rating={doctor.rating} />
                <span className="text-sm font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({doctor.reviewsCount})</span>
              </span>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-extrabold text-brand-700">
                {formatFee(doctor.fee)}
              </span>
              {doctor.availableToday && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> {tr('doctors.availableToday')}
                </span>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">{doctor.about}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Details */}
        <div className="space-y-6">
          <section className="card animate-rise p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />{tr('profile.qualifications')}</h2>
            <ul className="mt-3 space-y-2">
              {doctor.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              <span className="font-bold text-slate-700">{tr('profile.regNumber')}: </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{doctor.regNumber}</span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-bold text-slate-700">{tr('profile.languages')}: </span>
              {doctor.languages.join(', ')}
            </p>
          </section>

          <section className="card animate-rise p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />{tr('profile.timings')}</h2>
            <dl className="mt-3 space-y-2">
              {Object.entries(doctor.timings).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 text-sm">
                  <dt className="font-semibold text-slate-700">{k}</dt>
                  <dd className="text-slate-500">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card animate-rise p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />{tr('profile.clinics')}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {doctor.clinics.map((cid) => {
                const c = getClinic(cid);
                if (!c) return null;
                return (
                  <Link
                    key={cid}
                    href={`/clinics/${cid}`}
                    className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    <p className="text-sm font-bold text-slate-900">{c.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{c.city} · {c.avgWaitMins} {tr('clinics.min')} {tr('clinics.wait').toLowerCase()}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="card animate-rise p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" aria-hidden />
              {tr('profile.reviews')} ({visibleReviews.length})
            </h2>
            <div className="mt-4 space-y-4">
              {visibleReviews.length === 0 && <p className="text-sm text-slate-400">—</p>}
              {visibleReviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-calm-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Stars rating={r.rating} className="h-3.5 w-3.5" />
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                        <path d="m9.5 12 2 2 3.5-4 1.4 1.4-4.9 4.9-3.4-3.4L9.5 12Z" />
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                      </svg>
                      {tr('profile.verifiedVisit')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{r.text}</p>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {r.author} · {r.date}
                  </p>
                </div>
              ))}
            </div>
            {reportMsg && <p className="mt-3 text-xs font-semibold text-emerald-600">{reportMsg}</p>}
          </section>
        </div>

        {/* Booking widget */}
        <aside className="stagger-2 h-fit animate-rise rounded-3xl border border-brand-200/70 bg-white p-6 shadow-lift lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold tracking-tight text-brand-950">{tr('profile.bookTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {tr('profile.fee')}: <span className="text-gradient font-extrabold">{formatFee(doctor.fee)}</span>
          </p>
          <div className="hairline my-4" aria-hidden />

          {!booked ? (
            <div className="mt-5 space-y-4">
              <div>
                <p className="label-base">{tr('profile.pickDate')}</p>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((d, i) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setDayIdx(i)}
                      className={`rounded-xl border px-1 py-2 text-center text-xs font-bold transition-all duration-200 ${
                        dayIdx === i
                          ? 'border-brand-600 bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-soft'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:shadow-card'
                      }`}
                    >
                      {dayLabel(i)}
                      <span className={`block text-[10px] font-medium ${dayIdx === i ? 'text-brand-100' : 'text-slate-400'}`}>
                        {d.date.slice(5)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="label-base">{tr('profile.pickSlot')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`rounded-xl border px-2 py-2 text-xs font-bold transition-all duration-200 ${
                        slot === s
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:shadow-card'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="bk-name" className="label-base">
                  {tr('profile.yourName')}
                </label>
                <input
                  id="bk-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base"
                />
              </div>
              <div>
                <label htmlFor="bk-phone" className="label-base">
                  {tr('profile.yourPhone')}
                </label>
                <input
                  id="bk-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="03XX XXXXXXX"
                  className="input-base"
                />
              </div>

              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

              <button
                type="button"
                onClick={confirm}
                className="btn-primary w-full"
              >
                {tr('profile.confirm')}
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <WhatsAppMock
                title={lang === 'ur' ? 'Appointment confirmed!' : 'Appointment confirmed!'}
                lines={[
                  `👨‍⚕️ ${booked.doctorName}`,
                  `📅 ${booked.date} · ${booked.slot}`,
                  `👤 ${booked.patientName}`,
                  `💰 ${formatFee(doctor.fee)}`,
                ]}
                note={lang === 'ur' ? 'Message sent (simulated) — koi asli message nahi bheja gaya.' : 'Message sent (simulated) — no real message was sent.'}
              />
              <button
                type="button"
                onClick={() => setBooked(null)}
                className="btn-secondary mt-3 w-full"
              >
                {tr('common.cancel')}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
