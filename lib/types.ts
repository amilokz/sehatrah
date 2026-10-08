export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  city: string;
  experience: number;
  fee: number;
  rating: number;
  reviewsCount: number;
  gender: 'male' | 'female';
  verified: boolean;
  availableToday: boolean;
  qualifications: string[];
  regNumber: string;
  languages: string[];
  clinics: string[];
  timings: Record<string, string>;
  about: string;
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  address: string;
  hygiene: number;
  avgWaitMins: number;
  doctors: string[];
  facilities: string[];
  feeTable: { service: string; fee: number }[];
  phone: string;
  timings: string;
}

export interface Review {
  author: string;
  date: string;
  rating: number;
  text: string;
}

export interface Medicine {
  name: string;
  batch: string;
  manufacturer: string;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  slot: string;
  patientName: string;
  phone: string;
  createdAt: string;
}

export interface Signup {
  id: string;
  name: string;
  specialty: string;
  city: string;
  phone: string;
  fee: number;
  experience: number;
  qualifications: string;
  regNumber: string;
  degreeFile: string;
  certFile: string;
  cnicFile: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type Lang = 'en' | 'ur';

export const CITIES = ['Rawalpindi', 'Islamabad', 'Lahore', 'Karachi'];

export const SPECIALTIES = [
  'General Physician',
  'Dermatologist',
  'ENT Specialist',
  'Dentist',
  'Endocrinologist',
  'Orthopedic',
  'Pediatrician',
  'Cardiologist',
  'Gynecologist',
  'Neurologist',
  'Ophthalmologist',
  'Psychiatrist',
];
