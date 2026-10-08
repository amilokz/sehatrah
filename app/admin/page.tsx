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
        <div className="rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <h1 className="mt-4 text-xl font-extrabold text-brand-950">{tr('admin.loginTitle')}</h1>
          <p className="mt-2 text-sm text-slate-500">{tr('admin.loginSub')}</p>
          <button
            type="button"
            onClick={login}
            className="mt-5 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('admin.loginTitle')}</h1>
          <p className="mt-1 text-xs font-semibold text-slate-400">Demo session — {lang === 'ur' ? 'koi asli auth nahi' : 'no real auth'}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            {tr('admin.reset')}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            {tr('admin.logout')}
          </button>
        </div>
      </div>

      {/* Verification queue */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className={sectionTitle}>{tr('admin.queue')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.queueSub')}</p>
        {queue.length === 0 ? (
          <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{tr('admin.noQueue')}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {queue.map((item) => (
              <li key={item.key} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-calm-50 p-4 sm:flex-row sm:items-center">
                <InitialsAvatar name={item.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {item.name}
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-700">
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
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    {tr('admin.approve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectItem(item)}
                    className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-200"
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
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className={sectionTitle}>{tr('admin.reports')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.reportsSub')}</p>
        {reported.filter((r, i) => !reportStatuses[`${r.doctorId}-${i}`]).length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">{tr('admin.noReports')}</p>
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
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className={sectionTitle}>{tr('admin.featured')}</h2>
        <p className="mt-1 text-sm text-slate-500">{tr('admin.featuredSub')}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DOCTORS.map((d) => {
            const on = featured.includes(d.id);
            return (
              <li key={d.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2">
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
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-brand-600' : 'bg-slate-300'}`}
                  aria-label={`${d.name} featured`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
