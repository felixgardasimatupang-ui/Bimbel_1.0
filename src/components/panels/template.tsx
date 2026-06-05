import { MetricCard, SectionCard, CardGrid, SimpleList } from './shared';

export function TemplatePanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Template" value="14" note="Template aktif di seluruh saluran" tone="info" />
        <MetricCard label="Disetujui" value="11" note="Template yang sudah lolos peninjauan" tone="success" />
        <MetricCard label="Perlu update" value="3" note="Versi lama yang perlu diperbarui" tone="warning" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Galeri template" lead="Pilihan template yang dapat dipakai ulang.">
          <CardGrid columns={2} items={[
            { badge: 'Keuangan', title: 'Pengingat pembayaran', meta: 'Nada hangat dengan CTA pembayaran', tone: 'danger' },
            { badge: 'Akademik', title: 'Pengumuman kelas', meta: 'Informatif dan ringkas', tone: 'info' },
            { badge: 'Dukungan', title: 'Pembaruan tiket', meta: 'Pembaruan status dengan detail SLA', tone: 'success' },
            { badge: 'Promosi', title: 'Undangan uji coba', meta: 'Singkat dan fokus konversi', tone: 'warning' }
          ]} />
        </SectionCard>
        <SectionCard title="Template terpilih" lead="Rincian untuk peninjauan dan versi.">
          <SimpleList items={[
            { title: 'Nama template', meta: 'Pengingat pembayaran v2', tone: 'info' as const, extra: 'Aktif' },
            { title: 'Bahasa', meta: 'Bahasa Indonesia', tone: 'success' as const, extra: 'Terlokalisasi' },
            { title: 'Pembaruan terakhir', meta: '2 hari lalu oleh Admin', tone: 'warning' as const, extra: 'Baru' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
