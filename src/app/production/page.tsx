import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Produksi | Bimbel One Platform',
  description: 'Ringkasan arsitektur data, kontrol keamanan, dan kesiapan rilis.'
};

export default function ProductionPage() {
  return (
    <AppShell
      activeSlug={undefined}
      title="Produksi"
      description="Ringkasan teknis untuk memastikan platform siap dijalankan secara aman dan terukur."
    >
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Basis data dan keamanan</p>
            <h2 className="sectionTitle">Panduan kesiapan produksi</h2>
            <p className="sectionLead">
              Halaman ini merangkum prinsip sadar cabang, keterauditan, keamanan transport, dan rencana pemulihan
              yang menjadi dasar panduan produksi.
            </p>
          </div>
          <div className="heroActions">
            <Link className="metaPill" href="/api/v1/health">
              Health API
            </Link>
            <Link className="metaPill" href="/api/v1/permissions">
              Permissions API
            </Link>
          </div>
        </div>

        <div className="metricGrid metricGrid3">
          <article className="metricCard">
            <span className="metricLabel">Model multi-cabang</span>
            <strong className="metricValue toneInfo">RLS + branch_id</strong>
            <p className="metricNote">Setiap record bisnis membawa scope cabang yang tegas.</p>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Posisi keamanan</span>
            <strong className="metricValue toneSuccess">TLS + MFA</strong>
            <p className="metricNote">Transport terenkripsi dan akses sensitif dilindungi MFA.</p>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Kesiapan operasional</span>
            <strong className="metricValue toneWarning">Backup + DR</strong>
            <p className="metricNote">Backup harian, arsip WAL, dan latihan pemulihan dijaga.</p>
          </article>
        </div>

        <div className="twoColLayout">
          <section className="panel">
            <div className="panelHeader">
              <div>
                <h3 className="panelTitle">Standar database</h3>
                <p className="panelLead">Aturan inti untuk menjaga integritas dan keterlacakan data.</p>
              </div>
            </div>
            <div className="panelBody">
              <ul className="simpleList">
                <li className="listRow">
                  <div>
                    <strong>Kunci utama UUID</strong>
                    <p>Semua entitas utama menggunakan UUID agar sulit ditebak dan aman untuk distribusi.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Kolom audit</strong>
                    <p>Setiap tabel penting membawa created_at, updated_at, deleted_at, created_by, updated_by.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Isolasi cabang</strong>
                    <p>Data operasional wajib membawa branch_id dan dapat dikunci lewat policy database.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <div>
                <h3 className="panelTitle">Kontrol keamanan</h3>
                <p className="panelLead">Lapisan proteksi yang harus aktif sebelum rilis.</p>
              </div>
            </div>
            <div className="panelBody">
              <ul className="simpleList">
                <li className="listRow">
                  <div>
                    <strong>Autentikasi</strong>
                    <p>Hash kata sandi yang kuat, pembatasan laju masuk, dan MFA untuk peran sensitif.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Transport dan secret</strong>
                    <p>HTTPS, TLS basis data, dan pengelola secret untuk kredensial produksi.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Logging dan audit</strong>
                    <p>Audit log tidak dapat diubah, log terstruktur, correlation ID, dan masking data sensitif.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h3 className="panelTitle">Daftar periksa rilis</h3>
              <p className="panelLead">Daftar periksa produksi yang bisa dipakai sebagai gerbang sebelum rilis.</p>
            </div>
          </div>
          <div className="panelBody">
            <div className="cardGrid cardGrid4">
              <article className="miniCard">
                <strong>Skema siap</strong>
                <p>Migrasi tervalidasi dan indeks utama sudah dibuat.</p>
              </article>
              <article className="miniCard">
                <strong>RLS aktif</strong>
                <p>Policy sadar cabang aktif pada tabel yang sensitif.</p>
              </article>
              <article className="miniCard">
                <strong>Backup teruji</strong>
                <p>Latihan pemulihan berhasil dan arsip WAL aktif.</p>
              </article>
              <article className="miniCard">
                <strong>Monitoring aktif</strong>
                <p>Alert untuk masuk anomali, backup, dan error layanan aktif.</p>
              </article>
            </div>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
