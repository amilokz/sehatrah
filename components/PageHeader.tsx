'use client';

import type { ReactNode } from 'react';

/**
 * Premium section header: eyebrow pill + display title + subtitle.
 * Purely presentational — content comes from i18n keys.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : ''} animate-rise`}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 bg-white/70 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-700 shadow-card backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400" />
        {eyebrow}
      </span>
      <h1 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-brand-950 sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
