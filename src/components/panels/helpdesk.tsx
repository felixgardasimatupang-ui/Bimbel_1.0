import { MetricCard, SectionCard, CardGrid, SimpleList } from './shared';

export function HelpdeskPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Tiket terbuka" value="17" note="Tiket yang belum ditutup" tone="danger" />
        <MetricCard label="SLA at risk" value="4" note="Kasus mendekati batas penyelesaian" tone="warning" />
        <MetricCard label="Selesai hari ini" value="23" note="Tiket yang sudah selesai hari ini" tone="success" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Papan tiket" lead="Distribusi tiket berdasarkan status layanan.">
          <CardGrid columns={3} items={[
            { badge: 'Terbuka', title: '8', meta: 'Menunggu assignment', tone: 'danger' },
            { badge: 'Proses', title: '6', meta: 'Sedang ditangani agen', tone: 'warning' },
            { badge: 'Selesai', title: '23', meta: 'Ditutup dalam SLA', tone: 'success' }
          ]} />
        </SectionCard>
        <SectionCard title="Daftar pantau SLA" lead="Tiket yang perlu dipantau lebih dekat.">
          <SimpleList items={[
            { title: 'Pertanyaan invoice', meta: 'Sisa 2 jam sebelum SLA lewat.', tone: 'warning' as const, extra: 'Prioritas' },
            { title: 'Akses masuk', meta: 'Menunggu konfirmasi cabang.', tone: 'info' as const, extra: 'Normal' },
            { title: 'Pengiriman WhatsApp', meta: 'Perlu investigasi pada pengiriman gagal.', tone: 'danger' as const, extra: 'Tinggi' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
