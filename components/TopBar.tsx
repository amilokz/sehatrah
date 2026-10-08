'use client';

import { useLang } from './LangProvider';

export default function TopBar() {
  const { tr } = useLang();
  return (
    <div className="bg-brand-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6">
        <a
          href="https://akclnt.com"
          className="font-medium text-brand-200 transition-colors hover:text-white"
        >
          {tr('topbar.moreDemos')}
        </a>
        <span className="hidden text-brand-300 sm:inline">SehatRah · Demo</span>
      </div>
    </div>
  );
}
