import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ToastProvider } from '@/components/ui/toast-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Bimbel One Platform',
  description: 'Ruang kerja Next.js untuk layar dan alur operasional Bimbel One Platform.'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
