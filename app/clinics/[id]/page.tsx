import { CLINICS } from '@/lib/data';
import ClinicProfileClient from '@/components/ClinicProfileClient';

export function generateStaticParams() {
  return CLINICS.map((c) => ({ id: c.id }));
}

export default function ClinicPage() {
  return <ClinicProfileClient />;
}
