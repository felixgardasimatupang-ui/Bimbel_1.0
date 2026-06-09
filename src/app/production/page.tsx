import type { Metadata } from 'next';

import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Produksi | Bimbel One Platform',
  description: 'Ringkasan kontrol keamanan dan kesiapan operasional platform.'
};

export default function ProductionPage() {
  return (
    <AppShell
      activeSlug={undefined}
      title="Produksi"
      description="Ringkasan keamanan dan kesiapan operasional Bimbel One Platform."
    >
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Keamanan</p>
            <h2 className="sectionTitle">Kesiapan operasional</h2>
            <p className="sectionLead">
              Bimbel One Platform dirancang dengan keamanan berlapis dan perlindungan data
              untuk mendukung operasional bimbel Anda.
            </p>
          </div>
        </div>

        <div className="metricGrid metricGrid3">
          <article className="metricCard">
            <span className="metricLabel">Pengelolaan cabang</span>
            <strong className="metricValue toneInfo">Multi-cabang</strong>
            <p className="metricNote">Setiap cabang memiliki data yang terpisah dan aman.</p>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Posisi keamanan</span>
            <strong className="metricValue toneSuccess">TLS + MFA</strong>
            <p className="metricNote">Koneksi terenkripsi dan akses sensitif dilindungi verifikasi dua langkah.</p>
          </article>
          <article className="metricCard">
            <span className="metricLabel">Kesiapan data</span>
            <strong className="metricValue toneWarning">Backup + DR</strong>
            <p className="metricNote">Backup harian dan rencana pemulihan untuk menjaga kelangsungan bisnis.</p>
          </article>
        </div>

        <div className="twoColLayout">
          <section className="panel">
            <div className="panelHeader">
              <div>
                <h3 className="panelTitle">Perlindungan data</h3>
                <p className="panelLead">Prinsip utama untuk menjaga integritas dan keamanan data.</p>
              </div>
            </div>
            <div className="panelBody">
              <ul className="simpleList">
                <li className="listRow">
                  <div>
                    <strong>Identitas unik</strong>
                    <p>Setiap data memiliki identitas unik yang aman dan sulit ditebak.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Riwayat perubahan</strong>
                    <p>Setiap perubahan data tercatat secara otomatis untuk keperluan audit.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Pemisahan cabang</strong>
                    <p>Data operasional setiap cabang tersimpan secara terisolasi dan aman.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <div>
                <h3 className="panelTitle">Kontrol keamanan</h3>
                <p className="panelLead">Lapisan perlindungan untuk menjaga data Anda tetap aman.</p>
              </div>
            </div>
            <div className="panelBody">
              <ul className="simpleList">
                <li className="listRow">
                  <div>
                    <strong>Autentikasi aman</strong>
                    <p>Kata sandi dienkripsi dengan standar tinggi, dilengkapi perlindungan percobaan berulang.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Koneksi terenkripsi</strong>
                    <p>Seluruh komunikasi data dilindungi dengan enkripsi transport modern.</p>
                  </div>
                </li>
                <li className="listRow">
                  <div>
                    <strong>Catatan aktivitas</strong>
                    <p>Semua aktivitas penting dicatat dengan aman untuk keperluan pemantauan.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h3 className="panelTitle">Kesiapan platform</h3>
              <p className="panelLead">Daftar periksa untuk memastikan platform siap digunakan.</p>
            </div>
          </div>
          <div className="panelBody">
            <div className="cardGrid cardGrid4">
              <article className="miniCard">
                <strong>Struktur data siap</strong>
                <p>Seluruh tabel dan indeks telah dibuat dan siap digunakan.</p>
              </article>
              <article className="miniCard">
                <strong>Keamanan data terpasang</strong>
                <p>Pemisahan data dan kontrol akses telah aktif pada setiap cabang.</p>
              </article>
              <article className="miniCard">
                <strong>Backup teruji</strong>
                <p>Backup data berjalan otomatis dan pemulihan telah teruji.</p>
              </article>
              <article className="miniCard">
                <strong>Pemantauan aktif</strong>
                <p>Sistem pemantauan aktif untuk mendeteksi dan melaporkan anomali.</p>
              </article>
            </div>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
