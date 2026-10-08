'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from './LangProvider';
import { DoctorCard } from './DoctorBits';
import PageHeader from './PageHeader';
import { doctorsWithOverrides } from '@/lib/overrides';
import { CITIES, SPECIALTIES } from '@/lib/types';
import { readJSON } from '@/lib/storage';

type FeeRange = 'any' | 'low' | 'mid' | 'high';

export default function DoctorsClient() {
  const { tr } = useLang();
  const params = useSearchParams();

  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [feeRange, setFeeRange] = useState<FeeRange>('any');
  const [gender, setGender] = useState('');
  const [availableToday, setAvailableToday] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featured, setFeatured] = useState<string[]>([]);

  useEffect(() => {
    setCity(params.get('city') ?? '');
    setSpecialty(params.get('specialty') ?? '');
  }, [params]);

  useEffect(() => {
    setFeatured(readJSON<string[]>('featured', []));
  }, []);

  const results = useMemo(() => {
    const list = doctorsWithOverrides().filter((d) => {
      if (city && d.city !== city) return false;
      if (specialty && d.specialty !== specialty) return false;
      if (feeRange === 'low' && d.fee >= 2000) return false;
      if (feeRange === 'mid' && (d.fee < 2000 || d.fee > 3000)) return false;
      if (feeRange === 'high' && d.fee <= 3000) return false;
      if (gender && d.gender !== gender) return false;
      if (availableToday && !d.availableToday) return false;
      if (verifiedOnly && !d.verified) return false;
      return true;
    });
    // Featured first, then by rating
    return list.sort((a, b) => {
      const fa = featured.includes(a.id) ? 0 : 1;
      const fb = featured.includes(b.id) ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return b.rating - a.rating;
    });
  }, [city, specialty, feeRange, gender, availableToday, verifiedOnly, featured]);

  const reset = () => {
    setCity('');
    setSpecialty('');
    setFeeRange('any');
    setGender('');
    setAvailableToday(false);
    setVerifiedOnly(false);
  };

  const selectCls = 'select-base';
  const labelCls = 'label-base';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('doctors.filters')} title={tr('doctors.title')} subtitle={tr('doctors.subtitle')} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="stagger-2 h-fit animate-rise rounded-3xl border border-brand-100/70 bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-700">{tr('doctors.filters')}</h2>
            <button type="button" onClick={reset} className="btn-ghost !px-2 !py-1 text-xs">
              {tr('doctors.reset')}
            </button>
          </div>
          <div className="hairline my-4" aria-hidden />
          <div className="space-y-4">
            <div>
              <label htmlFor="f-city" className={labelCls}>{tr('doctors.city')}</label>
              <select id="f-city" value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
                <option value="">{tr('home.allCities')}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-specialty" className={labelCls}>{tr('doctors.specialty')}</label>
              <select id="f-specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={selectCls}>
                <option value="">{tr('home.allSpecialties')}</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-fee" className={labelCls}>{tr('doctors.feeRange')}</label>
              <select id="f-fee" value={feeRange} onChange={(e) => setFeeRange(e.target.value as FeeRange)} className={selectCls}>
                <option value="any">{tr('doctors.feeAny')}</option>
                <option value="low">{tr('doctors.feeLow')}</option>
                <option value="mid">{tr('doctors.feeMid')}</option>
                <option value="high">{tr('doctors.feeHigh')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-gender" className={labelCls}>{tr('doctors.gender')}</label>
              <select id="f-gender" value={gender} onChange={(e) => setGender(e.target.value)} className={selectCls}>
                <option value="">{tr('doctors.anyGender')}</option>
                <option value="male">{tr('doctors.male')}</option>
                <option value="female">{tr('doctors.female')}</option>
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {tr('doctors.availableToday')}
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {tr('doctors.verifiedOnly')}
            </label>
          </div>
        </aside>

        {/* Results */}
        <div>
          <p className="stagger-3 mb-5 flex animate-rise items-baseline gap-2 text-sm font-semibold text-slate-500">
            <span className="text-gradient text-2xl font-extrabold tracking-tight">{results.length}</span>
            {tr('doctors.results')}
          </p>
          {results.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-brand-200 bg-white/60 p-12 text-center shadow-card">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.8-3.8" />
                </svg>
              </span>
              <p className="mt-4 text-sm font-medium text-slate-500">{tr('doctors.none')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((d, i) => (
                <div key={d.id} className="stagger-2 animate-rise" style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}>
                  <DoctorCard doctor={d} featured={featured.includes(d.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
