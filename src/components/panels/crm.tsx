import { MetricCard, SectionCard, CardGrid, SimpleList } from './shared';

export function CrmPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Prospek baru" value="48" note="Prospek baru minggu ini" tone="info" />
        <MetricCard label="Pemesanan uji coba" value="19" note="Jadwal uji coba yang sudah terkonfirmasi" tone="success" />
        <MetricCard label="Tingkat konversi" value="31%" note="Prospek yang berubah menjadi pendaftaran" tone="warning" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Alur prospek" lead="Pergerakan prospek dari pertanyaan awal hingga pendaftaran.">
          <CardGrid columns={4} items={[
            { badge: 'Prospek', title: '12', meta: 'Pertanyaan baru', tone: 'info' },
            { badge: 'Dihubungi', title: '15', meta: 'Tindak lanjut berjalan', tone: 'warning' },
            { badge: 'Uji coba', title: '11', meta: 'Pemesanan uji coba terkonfirmasi', tone: 'success' },
            { badge: 'Terdaftar', title: '10', meta: 'Pendaftaran selesai', tone: 'info' }
          ]} />
        </SectionCard>
        <SectionCard title="Antrian tindak lanjut" lead="Prospek yang harus ditindaklanjuti hari ini.">
          <SimpleList items={[
            { title: 'Rani Putri', meta: 'Permintaan orang tua via formulir web', tone: 'warning' as const, extra: 'Telepon' },
            { title: 'Fahmi Akbar', meta: 'Pemesanan uji coba menunggu konfirmasi', tone: 'info' as const, extra: 'WhatsApp' },
            { title: 'Maya Lestari', meta: 'Menanyakan informasi beasiswa', tone: 'success' as const, extra: 'Email' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
