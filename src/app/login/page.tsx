import type { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Masuk | Bimbel One Platform',
  description: 'Halaman autentikasi demo untuk Bimbel One Platform.'
};

export default function LoginPage() {
  return (
    <main className="authPage">
      <section className="authHero">
        <p className="eyebrow">Identitas dan akses</p>
        <h1 className="heroTitle">Masuk yang sederhana, aman, dan mudah diaudit.</h1>
        <p className="heroLead">
          Halaman ini menampilkan alur masuk berbasis endpoint versi, peka peran, dan cabang yang jelas.
        </p>
        <div className="heroActions">
          <Link className="metaPill" href="/branches">
            Buka pemilih cabang
          </Link>
          <Link className="metaPill" href="/api/v1/health">
            Cek health API
          </Link>
        </div>
      </section>

      <LoginForm />
    </main>
  );
}
