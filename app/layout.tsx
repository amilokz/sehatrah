import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/components/LangProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SehatRah — Find verified doctors',
  description:
    'SehatRah demo: symptom-based specialist guidance, verified doctor directory, clinic profiles and online booking. Sample data only. Built by AKCLNT.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <LangProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
