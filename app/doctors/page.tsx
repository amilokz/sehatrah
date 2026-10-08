import { Suspense } from 'react';
import DoctorsClient from '@/components/DoctorsClient';

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      }
    >
      <DoctorsClient />
    </Suspense>
  );
}
