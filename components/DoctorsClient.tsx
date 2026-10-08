'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from './LangProvider';
import { DoctorCard } from './DoctorBits';
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

  const selectCls =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const labelCls = 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{tr('doctors.title')}</h1>
      <p className="mt-1.5 text-sm text-slate-500">{tr('doctors.subtitle')}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">{tr('doctors.filters')}</h2>
            <button type="button" onClick={reset} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
              {tr('doctors.reset')}
            </button>
          </div>
          <div className="mt-4 space-y-4">
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
          <p className="mb-4 text-sm font-semibold text-slate-500">
            <span className="text-lg font-extrabold text-brand-700">{results.length}</span> {tr('doctors.results')}
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              {tr('doctors.none')}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((d) => (
                <DoctorCard key={d.id} doctor={d} featured={featured.includes(d.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
