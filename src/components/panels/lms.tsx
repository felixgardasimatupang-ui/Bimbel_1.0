import { MetricCard, SectionCard, CardGrid, ProgressBars } from './shared';

export function LmsPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Kelas aktif" value="24" note="Kelas yang sedang menggunakan LMS" tone="info" />
        <MetricCard label="Pengumpulan tugas" value="86%" note="Penyelesaian tugas minggu ini" tone="success" />
        <MetricCard label="Siswa berisiko" value="9" note="Perlu perhatian dari tutor" tone="warning" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Pustaka materi" lead="Materi belajar yang dapat diakses oleh kelas dan siswa.">
          <CardGrid columns={2} items={[
            { badge: 'Matematika', title: 'Dasar aljabar', meta: 'Kelas 10 · 12 pelajaran', tone: 'info' },
            { badge: 'Sains', title: 'Dasar kimia', meta: 'Kelas 11 · 8 pelajaran', tone: 'warning' },
            { badge: 'Bahasa', title: 'Klinik esai', meta: 'Kelas 12 · 6 pelajaran', tone: 'success' },
            { badge: 'Persiapan ujian', title: 'Paket tryout', meta: 'Pilihan ganda + esai', tone: 'info' }
          ]} />
        </SectionCard>
        <SectionCard title="Cuplikan progres" lead="Kelas yang perlu tindak lanjut dari tutor.">
          <ProgressBars items={[
            { label: 'Kelas 10 Sains', value: 92, tone: 'success' },
            { label: 'Kelas 11 Sosial', value: 74, tone: 'warning' },
            { label: 'Kelas 12 Bahasa', value: 61, tone: 'danger' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
