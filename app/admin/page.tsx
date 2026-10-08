'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import { InitialsAvatar, VerifiedBadge } from '@/components/DoctorBits';
import {
  getVerifiedOverrides,
  getSignupStatuses,
  setSignupStatus,
  setDoctorVerified,
  getFeatured,
  toggleFeatured,
  getReportStatuses,
  setReportStatus,
} from '@/lib/overrides';
import { DOCTORS, getReportedReviews, formatFee } from '@/lib/data';
import { readJSON, readString, writeString, clearAllDemoData } from '@/lib/storage';
import type { Signup } from '@/lib/types';

interface QueueItem {
  key: string;
  kind: 'doctor' | 'signup';
  name: string;
  sub: string;
  detail: string;
}

export default function AdminPage() {
  const { tr, lang } = useLang();
  const [loggedIn, setLoggedIn] = useState(false);
  const [tick, setTick] = useState(0); // re-read storage after actions
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    setLoggedIn(readString('admin', '') === '1');
  }, []);

  const login = () => {
    writeString('admin', '1');
    setLoggedIn(true);
  };
  const logout = () => {
    writeString('admin', '');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="card animate-pop-in relative overflow-hidden p-8 text-center shadow-lift">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-100/70 to-transparent" aria-hidden />
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-sm">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <h1 className="relative mt-4 text-xl font-extrabold tracking-tight text-brand-950">{tr('admin.loginTitle')}</h1>
          <p className="relative mt-2 text-sm text-slate-500">{tr('admin.loginSub')}</p>
          <button
            type="button"
            onClick={login}
            className="btn-primary relative mt-6 w-full"
          >
            {tr('admin.loginBtn')}
          </button>
        </div>
      </div>
    );
  }

  // ---- derive state from storage ----
  void tick;
  const verifiedOverrides = getVerifiedOverrides();
  const signupStatuses: Record<string, Signup['status'] | undefined> = getSignupStatuses();
  const signups = readJSON<Signup[]>('signups', []);
  const reportStatuses = getReportStatuses();
  const featured = getFeatured();
  const reported = getReportedReviews();

  const queue: QueueItem[] = [
    ...DOCTORS.filter((d) => !d.verified && verifiedOverrides[d.id] === undefined).map((d) => ({
      key: `doc-${d.id}`,
      kind: 'doctor' as const,
      name: d.name,
      sub: `${d.specialty} · ${d.city} · ${formatFee(d.fee)}`,
      detail: `${d.qualifications.join(' · ')} — Reg: ${d.regNumber}`,
    })),
    ...signups
      .filter((s) => (signupStatuses[s.id] ?? s.status) === 'pending')
      .map((s) => ({
        key: `su-${s.id}`,
        kind: 'signup' as const,
        name: s.name,
        sub: `${s.specialty} · ${s.city} · ${formatFee(s.fee)} — Ref ${s.id}`,
        detail: `${s.qualifications} — Reg: ${s.regNumber} — Docs: ${s.degreeFile}, ${s.certFile}, ${s.cnicFile}`,
      })),
  ];

  const decided = [
    ...DOCTORS.filter((d) => verifiedOverrides[d.id] !== undefined).map((d) => ({
      name: d.name,
      status: verifiedOverrides[d.id] ? 'approved' : 'rejected',
    })),
    ...signups
      .filter((s) => (signupStatuses[s.id] ?? s.status) !== 'pending')
      .map((s) => ({ name: s.name, status: signupStatuses[s.id] ?? s.status })),
  ];

  const approveItem = (item: QueueItem) => {
    if (item.kind === 'doctor') {
      setDoctorVerified(item.key.replace('doc-', ''), true);
    } else {
      setSignupStatus(item.key.replace('su-', ''), 'approved');
    }
    refresh();
  };
  const rejectItem = (item: QueueItem) => {
    if (item.kind === 'doctor') {
      setDoctorVerified(item.key.replace('doc-', ''), false);
    } else {
      setSignupStatus(item.key.replace('su-', ''), 'rejected');
    }
    refresh();
  };

  const resetAll = () => {
    if (window.confirm(tr('admin.resetConfirm'))) {
      clearAllDemoData();
      window.location.reload();
    }
  };

  const sectionTitle = 'text-lg font-extrabold text-brand-950';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex animate-rise flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">{tr('admin.loginTitle')}</h1>
          <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-amber-500" aria-hidden />
            Demo session — {lang === 'ur' ? 'koi asli auth nahi' : 'no real auth'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-[0_6px_16px_-6px_rgba(220,38,38,0.4)]"
          >
            {tr('admin.reset')}
          </button>
          <button
            type="button"
            onClick={logout}
            className="btn-secondary !px-4 !py-2.5 !text-xs"
          >
            {tr('admin.logout')}
          </button>
        </div>
      </div>

      {/* Verification queue */}
      <section className="card animate-rise mt-8 p-6 sm:p-7">
        <h2 className={sectionTitle}>{tr('admin.queue')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.queueSub')}</p>
        {queue.length === 0 ? (
          <p className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.6-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8Z" />
            </svg>
            {tr('admin.noQueue')}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {queue.map((item) => (
              <li key={item.key} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-gradient-to-b from-calm-50 to-white p-4 transition-all duration-200 hover:border-brand-200 hover:shadow-card sm:flex-row sm:items-center">
                <InitialsAvatar name={item.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {item.name}
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                      {tr('admin.pending')}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.detail}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => approveItem(item)}
                    className="rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-[0_4px_12px_-4px_rgba(16,185,129,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px_rgba(16,185,129,0.7)] active:translate-y-0"
                  >
                    {tr('admin.approve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectItem(item)}
                    className="rounded-xl bg-red-100 px-5 py-2 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-200"
                  >
                    {tr('admin.reject')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {decided.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {decided.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {d.name}
                <span className={d.status === 'approved' ? 'font-bold text-emerald-600' : 'font-bold text-red-500'}>
                  {d.status === 'approved' ? tr('admin.approved') : tr('admin.rejected')}
                </span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Reported reviews */}
      <section className="card animate-rise mt-6 p-6 sm:p-7">
        <h2 className={sectionTitle}>{tr('admin.reports')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.reportsSub')}</p>
        {reported.filter((r, i) => !reportStatuses[`${r.doctorId}-${i}`]).length === 0 ? (
          <p className="mt-5 rounded-2xl bg-calm-50 p-4 text-sm font-semibold text-slate-500 ring-1 ring-slate-100">{tr('admin.noReports')}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reported.map((r, i) => {
              const key = `${r.doctorId}-${i}`;
              if (reportStatuses[key]) return null;
              return (
                <li key={key} className="rounded-xl border border-slate-100 bg-calm-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {r.doctorName}
                      <span className="ml-2 text-xs font-medium text-slate-400">{r.author} · {r.date}</span>
                    </p>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                      {r.reason}
                    </span>
                  </div>
                  <p className="mt-2 text-sm italic text-slate-600">“{r.text}”</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setReportStatus(key, 'dismissed'); refresh(); }}
                      className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      {tr('admin.dismiss')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReportStatus(key, 'hidden'); refresh(); }}
                      className="rounded-lg bg-red-100 px-4 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200"
                    >
                      {tr('admin.hide')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Featured listings */}
      <section className="card animate-rise mt-6 p-6 sm:p-7">
        <h2 className={sectionTitle}>{tr('admin.featured')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.featuredSub')}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DOCTORS.map((d) => {
            const on = featured.includes(d.id);
            return (
              <li key={d.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 transition-all duration-200 hover:border-brand-200 hover:shadow-card">
                <span className="flex min-w-0 items-center gap-2">
                  <InitialsAvatar name={d.name} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-slate-800">{d.name}</span>
                    <span className="block text-[10px] text-slate-400">{d.specialty} · {d.city}</span>
                  </span>
                  {d.verified && <VerifiedBadge small />}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => { toggleFeatured(d.id); refresh(); }}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-200 ${on ? 'bg-gradient-to-b from-brand-500 to-brand-600 shadow-glow-sm' : 'bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`${d.name} featured`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${on ? 'left-6' : 'left-1'}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
