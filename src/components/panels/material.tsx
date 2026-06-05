import { SectionCard, Timeline, CardGrid, Badge } from './shared';

export function MaterialPanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Detail modul</p>
          <h2 className="sectionTitle">Detail Materi Pembelajaran</h2>
          <p className="sectionLead">Detail modul dibuat sebagai halaman informasi yang memandu tutor dan siswa dalam satu tempat.</p>
        </div>
        <div className="heroActions">
          <Badge tone="success">Diterbitkan</Badge>
          <Badge tone="info">Versi 2.4</Badge>
        </div>
      </div>
      <div className="twoColLayout">
        <SectionCard title="Kerangka pelajaran" lead="Susunan isi untuk memudahkan navigasi materi.">
          <Timeline items={[
            { title: 'Pengantar', meta: 'Konsep inti dan tujuan pembelajaran.', time: '05 menit', tone: 'info' },
            { title: 'Contoh terarah', meta: 'Contoh soal dengan langkah penyelesaian.', time: '20 menit', tone: 'warning' },
            { title: 'Latihan mandiri', meta: 'Latihan mandiri untuk siswa.', time: '25 menit', tone: 'success' }
          ]} />
        </SectionCard>
        <SectionCard title="Paket sumber daya" lead="File pendukung yang dapat diunduh oleh kelas.">
          <CardGrid columns={2} items={[
            { badge: 'PDF', title: 'Catatan pelajaran', meta: 'Ringkasan inti pembelajaran.', tone: 'info' },
            { badge: 'DOC', title: 'Panduan tutor', meta: 'Pedoman fasilitasi tutor.', tone: 'success' },
            { badge: 'ZIP', title: 'Bundel latihan', meta: 'Kumpulan latihan dan kunci jawaban.', tone: 'warning' },
            { badge: 'LINK', title: 'Video referensi', meta: 'Tautan belajar tambahan.', tone: 'info' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
