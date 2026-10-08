'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import PageHeader from '@/components/PageHeader';
import { CITIES, SPECIALTIES, type Signup } from '@/lib/types';
import { readJSON, writeJSON } from '@/lib/storage';

interface FormState {
  name: string;
  specialty: string;
  city: string;
  phone: string;
  fee: string;
  experience: string;
  qualifications: string;
  regNumber: string;
}

const EMPTY: FormState = {
  name: '',
  specialty: '',
  city: '',
  phone: '',
  fee: '',
  experience: '',
  qualifications: '',
  regNumber: '',
};

export default function SignupPage() {
  const { tr, lang } = useLang();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState({ degree: '', cert: '', cnic: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState<Signup | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = (k: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFiles((prev) => ({ ...prev, [k]: f.name })); // mock: store name only
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof FormState)[] = ['name', 'specialty', 'city', 'phone', 'fee', 'experience', 'qualifications', 'regNumber'];
    if (required.some((k) => !form[k].trim()) || !files.degree || !files.cert || !files.cnic) {
      setError(tr('common.required'));
      return;
    }
    setError('');
    const signup: Signup = {
      id: `app-${Date.now().toString(36).toUpperCase()}`,
      name: form.name.trim(),
      specialty: form.specialty,
      city: form.city,
      phone: form.phone.trim(),
      fee: Number(form.fee) || 0,
      experience: Number(form.experience) || 0,
      qualifications: form.qualifications.trim(),
      regNumber: form.regNumber.trim(),
      degreeFile: files.degree,
      certFile: files.cert,
      cnicFile: files.cnic,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const all = readJSON<Signup[]>('signups', []);
    writeJSON('signups', [...all, signup]);
    setDone(signup);
  };

  const inputCls = 'input-base';
  const labelCls = 'label-base';

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className="card animate-pop-in relative overflow-hidden p-8 text-center shadow-lift">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-100/60 to-transparent" aria-hidden />
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-amber-100 to-amber-200 ring-1 ring-amber-200">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </span>
          <h1 className="relative mt-4 text-2xl font-extrabold tracking-tight text-brand-950">{tr('signup.successTitle')}</h1>
          <span className="relative mt-3 inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-700 ring-1 ring-amber-200">
            {tr('signup.pending')}
          </span>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">{tr('signup.successBody')}</p>
          <p className="relative mt-4 text-sm">
            <span className="font-bold text-slate-600">{tr('signup.refId')}: </span>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-bold text-brand-700 ring-1 ring-brand-100">{done.id}</span>
          </p>
          <Link
            href="/doctors"
            className="btn-primary relative mt-6"
          >
            {tr('nav.doctors')} →
          </Link>
        </div>
      </div>
    );
  }

  const fileField = (k: 'degree' | 'cert' | 'cnic', label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <label className="group flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-gradient-to-b from-brand-50/60 to-calm-50 px-3 py-4 text-sm font-semibold text-slate-500 transition-all duration-200 hover:border-brand-400 hover:from-brand-50 hover:text-brand-700">
        <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M12 16V4m0 0 4 4m-4-4L8 8M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        {files[k] || (lang === 'ur' ? 'File chunein' : 'Choose file')}
        <input type="file" className="hidden" onChange={onFile(k)} accept=".pdf,.jpg,.jpeg,.png" />
      </label>
      <p className="mt-1 text-[11px] italic text-slate-400">{tr('signup.mockNote')}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('nav.signup')} title={tr('signup.title')} subtitle={tr('signup.subtitle')} />

      <form onSubmit={submit} className="card stagger-2 mt-8 animate-rise p-6 shadow-lift sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="su-name" className={labelCls}>{tr('signup.name')}</label>
            <input id="su-name" value={form.name} onChange={set('name')} className={inputCls} placeholder="Dr. Ahmed Raza" />
          </div>
          <div>
            <label htmlFor="su-specialty" className={labelCls}>{tr('signup.specialty')}</label>
            <select id="su-specialty" value={form.specialty} onChange={set('specialty')} className={inputCls}>
              <option value="">{tr('home.allSpecialties')}</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="su-city" className={labelCls}>{tr('signup.city')}</label>
            <select id="su-city" value={form.city} onChange={set('city')} className={inputCls}>
              <option value="">{tr('home.allCities')}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="su-phone" className={labelCls}>{tr('signup.phone')}</label>
            <input id="su-phone" value={form.phone} onChange={set('phone')} className={inputCls} inputMode="tel" placeholder="03XX XXXXXXX" />
          </div>
          <div>
            <label htmlFor="su-fee" className={labelCls}>{tr('signup.fee')}</label>
            <input id="su-fee" value={form.fee} onChange={set('fee')} className={inputCls} inputMode="numeric" placeholder="2500" />
          </div>
          <div>
            <label htmlFor="su-exp" className={labelCls}>{tr('signup.experience')}</label>
            <input id="su-exp" value={form.experience} onChange={set('experience')} className={inputCls} inputMode="numeric" placeholder="8" />
          </div>
          <div>
            <label htmlFor="su-reg" className={labelCls}>{tr('signup.regNumber')}</label>
            <input id="su-reg" value={form.regNumber} onChange={set('regNumber')} className={inputCls} placeholder="MED-REG-XXXXX" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="su-qual" className={labelCls}>{tr('signup.qualifications')}</label>
            <textarea
              id="su-qual"
              value={form.qualifications}
              onChange={set('qualifications')}
              rows={2}
              className={inputCls}
              placeholder="MBBS, FCPS (sample)"
            />
          </div>
          {fileField('degree', tr('signup.degree'))}
          {fileField('cert', tr('signup.cert'))}
          {fileField('cnic', tr('signup.cnic'))}
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          className="btn-primary mt-6 w-full !py-3.5 !text-base"
        >
          {tr('signup.submit')}
        </button>
      </form>
    </div>
  );
}
