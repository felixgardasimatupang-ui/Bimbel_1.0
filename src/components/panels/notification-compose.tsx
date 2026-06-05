import { SectionCard, CardGrid, Timeline, Badge } from './shared';

export function NotificationComposePanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Penyusun notifikasi</p>
          <h2 className="sectionTitle">Buat Notifikasi Baru</h2>
          <p className="sectionLead">Menyusun pesan, memilih audiens, dan menyiapkan jadwal kirim tanpa mengorbankan keterbacaan.</p>
        </div>
        <div className="heroActions">
          <Badge tone="success">Draft tersimpan</Badge>
          <Badge tone="info">WhatsApp + Email</Badge>
        </div>
      </div>
      <div className="twoColLayout">
        <SectionCard title="Formulir penyusun" lead="Komponen input yang siap untuk kebutuhan produksi.">
          <CardGrid columns={2} items={[
            { badge: 'Audiens', title: 'Cabang: Jakarta Selatan', meta: 'Difilter berdasarkan enrollment aktif', tone: 'info' },
            { badge: 'Saluran', title: 'WhatsApp', meta: 'Fallback ke email jika dibutuhkan', tone: 'success' },
            { badge: 'Jadwal', title: 'Hari ini 14:00', meta: 'Masuk antrean pengiriman batch', tone: 'warning' },
            { badge: 'Prioritas', title: 'Tinggi', meta: 'Notifikasi perlu dikirim cepat', tone: 'danger' }
          ]} />
        </SectionCard>
        <SectionCard title="Pratinjau pesan" lead="Pratinjau teks yang akan diterima penerima.">
          <Timeline items={[
            { title: 'Header', meta: 'Pengingat pembayaran bulan ini', time: 'Baris 1', tone: 'info' },
            { title: 'Isi pesan', meta: 'Invoice Anda telah jatuh tempo dan perlu tindak lanjut.', time: 'Baris 2', tone: 'warning' },
            { title: 'Footer', meta: 'Hubungi tim dukungan jika butuh bantuan.', time: 'Baris 3', tone: 'success' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
