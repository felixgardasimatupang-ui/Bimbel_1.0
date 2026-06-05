import { MetricCard, SectionCard, DataTable, ProgressBars, Badge } from './shared';

export function BroadcastPanel() {
  const campaigns = [
    { key: 'Campaign 1', cells: [<span key="a">Kampanye 1</span>, <span key="b">1.204 penerima</span>, <Badge key="c" tone="success">Terkirim</Badge>, <span key="d">98%</span>] },
    { key: 'Campaign 2', cells: [<span key="a">Kampanye 2</span>, <span key="b">842 penerima</span>, <Badge key="c" tone="warning">Diproses</Badge>, <span key="d">71%</span>] },
    { key: 'Campaign 3', cells: [<span key="a">Kampanye 3</span>, <span key="b">412 penerima</span>, <Badge key="c" tone="danger">Gagal</Badge>, <span key="d">0%</span>] }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Terkirim hari ini" value="2.458" note="Notifikasi yang berhasil dikirim" tone="success" />
        <MetricCard label="Gagal kirim" value="12" note="Perlu coba ulang dan investigasi" tone="danger" />
        <MetricCard label="Tingkat buka" value="87%" note="Perkiraan keterbacaan broadcast" tone="info" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Dasbor kampanye" lead="Pantau status distribusi notifikasi massal.">
          <DataTable columns={[{ label: 'Kampanye' }, { label: 'Audiens' }, { label: 'Status' }, { label: 'Tingkat buka', align: 'right' }]} rows={campaigns} />
        </SectionCard>
        <SectionCard title="Wawasan pengiriman" lead="Ringkasan performa saluran dan coba ulang.">
          <ProgressBars items={[
            { label: 'WhatsApp', value: 92, tone: 'success' },
            { label: 'Email', value: 81, tone: 'info' },
            { label: 'Push', value: 64, tone: 'warning' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
