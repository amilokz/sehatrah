import doctorsJson from '@/data/doctors.json';
import clinicsJson from '@/data/clinics.json';
import reviewsJson from '@/data/reviews.json';
import medicinesJson from '@/data/medicines.json';
import type { Clinic, Doctor, Medicine, Review } from './types';

export const DOCTORS: Doctor[] = doctorsJson as unknown as Doctor[];
export const CLINICS: Clinic[] = clinicsJson as unknown as Clinic[];
export const MEDICINES: Medicine[] = medicinesJson as unknown as Medicine[];

type ReviewMap = Record<string, Review[]> & { reported?: ReportedReview[] };

export interface ReportedReview extends Review {
  doctorId: string;
  doctorName: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'hidden';
}

const reviewMap = reviewsJson as unknown as ReviewMap;

export function getDoctor(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export function getClinic(id: string): Clinic | undefined {
  return CLINICS.find((c) => c.id === id);
}

export function getReviews(doctorId: string): Review[] {
  return reviewMap[doctorId] ?? [];
}

export function getReportedReviews(): ReportedReview[] {
  return reviewMap.reported ?? [];
}

export function initials(name: string): string {
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function formatFee(fee: number): string {
  return `PKR ${fee.toLocaleString('en-PK')}`;
}
