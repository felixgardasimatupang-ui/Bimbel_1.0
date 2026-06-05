import { MetricCard, SectionCard, ProgressBars, Timeline } from './shared';

export function ProgressPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Rata-rata progres" value="78%" note="Rata-rata progres semua kelas aktif" tone="success" />
        <MetricCard label="Perlu intervensi" value="9" note="Siswa yang butuh intervensi tutor" tone="warning" />
        <MetricCard label="Kohort teratas" value="Kelas 12" note="Kohort dengan performa paling stabil" tone="info" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Peringkat kohort" lead="Peringkat performa belajar per kelas.">
          <ProgressBars items={[
            { label: 'Kelas 12 Bahasa', value: 94, tone: 'success' },
            { label: 'Kelas 10 Sains', value: 82, tone: 'info' },
            { label: 'Kelas 11 Sosial', value: 68, tone: 'warning' }
          ]} />
        </SectionCard>
        <SectionCard title="Wawasan" lead="Area yang perlu perhatian berdasarkan progres.">
          <Timeline items={[
            { title: 'Kecepatan membaca', meta: 'Masih lambat pada kelas 11 Sosial.', time: 'Wawasan 1', tone: 'warning' },
            { title: 'Penyelesaian tugas', meta: 'Stabil pada kelas 10 Sains.', time: 'Wawasan 2', tone: 'success' },
            { title: 'Kesiapan ujian', meta: 'Perlu tambahan simulasi pada kelas 12.', time: 'Wawasan 3', tone: 'info' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
