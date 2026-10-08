'use client';

// Mock WhatsApp-style confirmation bubble. Nothing is actually sent.

export default function WhatsAppMock({
  title,
  lines,
  note,
}: {
  title: string;
  lines: string[];
  note: string;
}) {
  return (
    <div className="wa-pattern overflow-hidden rounded-2xl border border-slate-300/60 p-4 shadow-card" aria-label="Simulated WhatsApp message">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.7)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-bold text-slate-800">WhatsApp</p>
          <p className="inline-flex items-center gap-1 rounded-full bg-slate-900/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Simulated message</p>
        </div>
      </div>
      <div className="ml-6 max-w-md rounded-xl rounded-tl-sm bg-[#dcf8c6] p-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)]">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <div className="mt-1 space-y-0.5 text-sm text-slate-700">
          {lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <p className="mt-2 text-right text-[10px] text-slate-500">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
        </p>
      </div>
      <p className="ml-6 mt-2 text-xs italic text-slate-600">{note}</p>
    </div>
  );
}
