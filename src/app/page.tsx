import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { ScreenPanel } from '@/components/screen-panels';
import { defaultScreenSlug, screenMap } from '@/lib/screens';

const defaultScreen = screenMap.get(defaultScreenSlug);

export const metadata: Metadata = {
  title: 'Bimbel One Platform',
  description: 'Dasbor dan pusat navigasi untuk seluruh layar Bimbel One Platform.'
};

export default function HomePage() {
  if (!defaultScreen) {
    throw new Error('Layar default tidak ditemukan.');
  }

  return (
    <AppShell
      activeSlug={defaultScreen.slug}
      currentScreen={defaultScreen}
      title="Bimbel One Platform"
      description="Titik masuk untuk menampilkan seluruh layar utama Bimbel One Platform."
    >
      <section className="introPanel">
        <div className="introCopy">
          <p className="eyebrow">Selamat datang</p>
          <h1 className="heroTitle">Dasbor Utama Bimbel One Platform</h1>
          <p className="heroLead">
            Kelola seluruh operasional bimbel Anda dari satu tempat: keuangan, jadwal, absensi,
            LMS, CRM, notifikasi, dan banyak lagi.
          </p>
          <div className="heroActions">
            <Link className="metaPill" href="/login">
              Masuk
            </Link>
            <Link className="metaPill" href="/branches">
              Cabang
            </Link>
            <Link className="metaPill" href="/production">
              Produksi
            </Link>
            <Link className="metaPill" href="/screens">
              Semua layar
            </Link>
          </div>
        </div>

        <div className="introStats">
          <div className="statCard">
            <span className="statLabel">Layar</span>
            <strong>16</strong>
            <span className="statNote">Semua fitur operasional tersedia dari satu dasbor.</span>
          </div>
          <div className="statCard">
            <span className="statLabel">Kinerja</span>
            <strong>Cepat</strong>
            <span className="statNote">Akses instan ke setiap layar tanpa memuat ulang halaman.</span>
          </div>
          <div className="statCard statCardAction">
            <span className="statLabel">Navigasi</span>
            <strong>Daftar layar</strong>
            <span className="statNote">Jelajahi seluruh layar yang tersedia untuk operasional harian.</span>
            <Link className="primaryButton" href="/screens">
              Buka daftar layar
            </Link>
          </div>
        </div>
      </section>

      <ScreenPanel screen={defaultScreen} />
    </AppShell>
  );
}
