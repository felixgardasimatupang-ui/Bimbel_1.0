import type { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Masuk | Bimbel One Platform',
  description: 'Masuk ke akun Bimbel One Platform Anda.'
};

export default function LoginPage() {
  return (
    <main className="authPage">
      <section className="authHero">
        <p className="eyebrow">Selamat datang</p>
        <h1 className="heroTitle">Masuk ke akun Anda</h1>
        <p className="heroLead">
          Masuk menggunakan akun yang telah terdaftar untuk mengakses seluruh layanan.
        </p>
        <div className="heroActions">
          <Link className="metaPill" href="/branches">
            Buka pemilih cabang
          </Link>
          <Link className="metaPill" href="/">
            Kembali ke dasbor
          </Link>
        </div>
      </section>

      <LoginForm />
    </main>
  );
}
