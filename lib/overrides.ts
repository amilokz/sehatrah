// Client-side admin overrides: verification decisions, featured flags,
// signup statuses, review moderation. All stored in localStorage (sehatrah-*).

import { readJSON, writeJSON } from './storage';
import { DOCTORS } from './data';
import type { Doctor } from './types';

export function getVerifiedOverrides(): Record<string, boolean> {
  return readJSON<Record<string, boolean>>('verified', {});
}

/** Doctors with admin verification decisions applied. */
export function doctorsWithOverrides(): Doctor[] {
  const overrides = getVerifiedOverrides();
  return DOCTORS.map((d) =>
    overrides[d.id] !== undefined ? { ...d, verified: overrides[d.id] } : d,
  );
}

export function getSignupStatuses(): Record<string, 'approved' | 'rejected'> {
  return readJSON<Record<string, 'approved' | 'rejected'>>('signup-status', {});
}

export function setSignupStatus(id: string, status: 'approved' | 'rejected'): void {
  const all = getSignupStatuses();
  writeJSON('signup-status', { ...all, [id]: status });
}

export function setDoctorVerified(id: string, verified: boolean): void {
  const all = getVerifiedOverrides();
  writeJSON('verified', { ...all, [id]: verified });
}

export function getFeatured(): string[] {
  return readJSON<string[]>('featured', []);
}

export function toggleFeatured(id: string): string[] {
  const current = getFeatured();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  writeJSON('featured', next);
  return next;
}

export function getReportStatuses(): Record<string, 'dismissed' | 'hidden'> {
  return readJSON<Record<string, 'dismissed' | 'hidden'>>('report-status', {});
}

export function setReportStatus(key: string, status: 'dismissed' | 'hidden'): void {
  const all = getReportStatuses();
  writeJSON('report-status', { ...all, [key]: status });
}
