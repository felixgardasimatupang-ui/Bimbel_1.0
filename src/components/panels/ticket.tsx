import { SectionCard, Timeline, SimpleList, Badge } from './shared';

export function TicketPanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Detail tiket</p>
          <h2 className="sectionTitle">Detail Tiket Helpdesk</h2>
          <p className="sectionLead">Riwayat percakapan, status penanganan, dan metadata tiket ditampilkan dalam satu layar.</p>
        </div>
        <div className="heroActions">
          <Badge tone="warning">Sedang diproses</Badge>
          <Badge tone="info">#TKT-2048</Badge>
        </div>
      </div>
      <div className="twoColLayout">
        <SectionCard title="Linimasa percakapan" lead="Percakapan antara agen dan pelanggan.">
          <Timeline items={[
            { title: 'Pesan pelanggan', meta: 'Tidak bisa mengakses portal kelas.', time: '09:12', tone: 'info' },
            { title: 'Respons agen', meta: 'Meminta cabang dan ID siswa.', time: '09:18', tone: 'warning' },
            { title: 'Balasan pelanggan', meta: 'Mengirim detail verifikasi dan screenshot.', time: '09:25', tone: 'success' }
          ]} />
        </SectionCard>
        <SectionCard title="Metadata tiket" lead="Informasi operasional untuk penanganan cepat.">
          <SimpleList items={[
            { title: 'Kategori', meta: 'Akses dan autentikasi', tone: 'info' as const, extra: 'Dukungan' },
            { title: 'Penanggung jawab', meta: 'Dewi - Senior Agent', tone: 'success' as const, extra: 'Ditugaskan' },
            { title: 'Prioritas', meta: 'Tinggi karena kelas segera dimulai', tone: 'danger' as const, extra: 'Tinggi' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
