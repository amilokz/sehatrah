'use client';

import Link from 'next/link';
import { initials, formatFee } from '@/lib/data';
import type { Doctor } from '@/lib/types';
import { useLang } from './LangProvider';

const AVATAR_BG = [
  'from-brand-400 to-brand-600',
  'from-sky-400 to-brand-600',
  'from-indigo-400 to-brand-700',
  'from-cyan-400 to-brand-600',
  'from-blue-400 to-indigo-600',
];

export function InitialsAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-lg',
    lg: 'h-20 w-20 text-2xl',
  };
  const bg = AVATAR_BG[name.length % AVATAR_BG.length];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-extrabold text-white ${bg} ${sizes[size]}`}
    >
      {initials(name)}
    </span>
  );
}

export function VerifiedBadge({ small = false }: { small?: boolean }) {
  const { tr } = useLang();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-brand-600 font-bold text-white ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={tr('doctors.verified')}
    >
      <svg viewBox="0 0 24 24" className={small ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill="currentColor">
        <path d="M12 2 9.5 4.5 6 4l-.7 3.4L2.5 9.5 4 12.5 2.5 15.5l2.8 2.1L6 21l3.5-.5L12 23l2.5-2.5L18 21l.7-3.4 2.8-2.1-1.5-3 1.5-3-2.8-2.1L18 4l-3.5.5L12 2Zm-1.2 12.6-2.4-2.4 1.4-1.4 1 1 3.8-3.8 1.4 1.4-5.2 5.2Z" />
      </svg>
      {tr('doctors.verified')}
    </span>
  );
}

export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`${className} ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300'}`}
          fill="currentColor"
        >
          <path d="M12 2.5 14.9 8.6l6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
        </svg>
      ))}
    </span>
  );
}

export function DoctorCard({ doctor, featured = false }: { doctor: Doctor; featured?: boolean }) {
  const { tr } = useLang();
  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft sm:p-5"
    >
      <InitialsAvatar name={doctor.name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-brand-700">
            {doctor.name}
          </h3>
          {doctor.verified ? (
            <VerifiedBadge small />
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              {tr('doctors.unverified')}
            </span>
          )}
          {featured && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {tr('doctors.featured')}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-brand-700 font-medium">{doctor.specialty}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {doctor.city} · {doctor.experience} {tr('doctors.yrsExp')}
          {doctor.availableToday && (
            <span className="ml-2 inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {tr('doctors.availableToday')}
            </span>
          )}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Stars rating={doctor.rating} className="h-3.5 w-3.5" />
            <span className="font-bold text-slate-800">{doctor.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({doctor.reviewsCount})</span>
          </span>
          <span className="text-sm font-extrabold text-brand-700">{formatFee(doctor.fee)}</span>
        </div>
      </div>
    </Link>
  );
}
