import { DOCTORS } from '@/lib/data';
import DoctorProfileClient from '@/components/DoctorProfileClient';

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ id: d.id }));
}

export default function DoctorPage() {
  return <DoctorProfileClient />;
}
