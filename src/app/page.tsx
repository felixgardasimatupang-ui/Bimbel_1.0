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
      description="Titik masuk framework berbasis Next.js untuk menampilkan seluruh layar utama secara terstruktur."
    >
      <section className="introPanel">
        <div className="introCopy">
          <p className="eyebrow">Pratinjau framework</p>
          <h1 className="heroTitle">Dasbor Utama sebagai titik masuk, tanpa aset PNG.</h1>
          <p className="heroLead">
            Struktur ini mengganti file HTML statis menjadi komponen React yang lebih mudah dibaca,
            lebih mudah dirawat, dan tetap menjaga fitur inti setiap layar.
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
            <span className="statNote">Semua layar penting dipetakan ulang ke rute Next.js.</span>
          </div>
          <div className="statCard">
            <span className="statLabel">Arsitektur</span>
            <strong>App Router</strong>
            <span className="statNote">Komponen server-first dengan struktur file yang jelas.</span>
          </div>
          <div className="statCard statCardAction">
            <span className="statLabel">Navigasi</span>
            <strong>Indeks rute</strong>
            <span className="statNote">Buka seluruh layar dari halaman indeks yang terstruktur.</span>
            <Link className="primaryButton" href="/screens">
              Buka indeks layar
            </Link>
          </div>
        </div>
      </section>

      <ScreenPanel screen={defaultScreen} />
    </AppShell>
  );
}
