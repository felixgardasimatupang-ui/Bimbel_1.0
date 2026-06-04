import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { defaultScreenSlug, screens, screenMap } from '@/lib/screens';

const defaultScreen = screenMap.get(defaultScreenSlug);

export const metadata: Metadata = {
  title: 'Semua Layar | Bimbel One Platform',
  description: 'Indeks rute untuk membuka seluruh layar utama Bimbel One Platform.'
};

export default function ScreensIndexPage() {
  return (
    <AppShell
      activeSlug={defaultScreenSlug}
      currentScreen={defaultScreen}
      title="Semua Layar"
      description="Hub navigasi untuk membuka seluruh layar Bimbel One Platform."
    >
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Indeks rute</p>
            <h2 className="sectionTitle">Kumpulan layar utama</h2>
            <p className="sectionLead">
              Semua layar dipetakan sebagai rute Next.js agar mudah ditelusuri, diuji, dan dipelihara.
            </p>
          </div>
          <div className="heroActions">
            <span className="metaPill">16 rute aktif</span>
            <span className="metaPill">Sadar cabang</span>
            <Link className="metaPill" href="/login">
              Masuk
            </Link>
            <Link className="metaPill" href="/branches">
              Cabang
            </Link>
            <Link className="metaPill" href="/production">
              Produksi
            </Link>
          </div>
        </div>

        <div className="cardGrid cardGrid4">
          {screens.map((screen) => (
            <Link key={screen.slug} className="miniCard routeCard" href={`/screens/${screen.slug}`}>
              <span className="badge toneInfo">{screen.index}</span>
              <strong>{screen.title}</strong>
              <p>{screen.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
