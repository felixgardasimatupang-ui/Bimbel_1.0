import { MetricCard, SectionCard, CardGrid, SimpleList } from './shared';

export function WhatsAppPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Koneksi" value="Online" note="Gateway aktif dan siap mengirim" tone="success" />
        <MetricCard label="Kuota tersisa" value="1.840" note="Sisa pesan yang dapat dikirim" tone="info" />
        <MetricCard label="Kesehatan webhook" value="Stabil" note="Panggilan masuk tervalidasi" tone="warning" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Pengaturan gateway" lead="Parameter inti untuk integrasi WhatsApp.">
          <CardGrid columns={2} items={[
            { badge: 'Kunci API', title: 'Disimpan aman', meta: 'Hanya tampil sebagai status.', tone: 'success' },
            { badge: 'Pengirim', title: 'Dukungan Bimbel One', meta: 'Nama pengirim utama.', tone: 'info' },
            { badge: 'Webhook', title: 'Endpoint terverifikasi', meta: 'Sinkronisasi peristiwa pengiriman.', tone: 'warning' },
            { badge: 'Pembatas laju', title: 'Dilindungi', meta: 'Menghindari throttle dari penyedia.', tone: 'danger' }
          ]} />
        </SectionCard>
        <SectionCard title="Profil pengirim" lead="Identitas pengirim yang terlihat oleh penerima.">
          <SimpleList items={[
            { title: 'Nama tampil', meta: 'Dukungan Bimbel One', tone: 'info' as const, extra: 'Utama' },
            { title: 'Nomor telepon', meta: '+62 812-3456-7890', tone: 'success' as const, extra: 'Terverifikasi' },
            { title: 'Email cadangan', meta: 'support@bimbel.one', tone: 'warning' as const, extra: 'Cadangan' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
