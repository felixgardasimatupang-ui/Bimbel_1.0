import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { BranchBrowser } from '@/components/branch-browser';
import { branchDirectory } from '@/lib/branch-directory';

export const metadata: Metadata = {
  title: 'Cabang | Bimbel One Platform',
  description: 'Pilih cabang untuk memulai operasional.'
};

export default function BranchesPage() {
  return (
    <AppShell
      activeSlug={undefined}
      title="Cabang"
      description="Pilih cabang aktif untuk memulai operasional."
    >
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Pemilih cabang</p>
            <h2 className="sectionTitle">Pilih cabang aktif</h2>
            <p className="sectionLead">
              Pengguna dapat menelusuri cabang yang tersedia lalu memeriksa detail alamat, timezone, dan status.
            </p>
          </div>
          <div className="heroActions">
            <Link className="metaPill" href="/login">
              Kembali ke halaman masuk
            </Link>
            <span className="metaPill">{branchDirectory.length} cabang terdaftar</span>
          </div>
        </div>

        <BranchBrowser branches={branchDirectory} />
      </section>
    </AppShell>
  );
}
