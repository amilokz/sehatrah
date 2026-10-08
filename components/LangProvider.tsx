'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { t } from '@/lib/i18n';
import { readString, writeString } from '@/lib/storage';
import type { Lang } from '@/lib/types';

interface LangCtx {
  lang: Lang;
  toggleLang: () => void;
  tr: (key: string) => string;
}

const Ctx = createContext<LangCtx>({ lang: 'en', toggleLang: () => {}, tr: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(readString('lang', 'en') === 'ur' ? 'ur' : 'en');
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'ur' : 'en';
      writeString('lang', next);
      return next;
    });
  };

  const tr = (key: string) => t(key, lang);

  return <Ctx.Provider value={{ lang, toggleLang, tr }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
