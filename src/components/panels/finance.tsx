import { MetricCard, SectionCard, DataTable, SimpleList, Badge } from './shared';

export function FinancePanel() {
  const metrics = [
    { label: 'Piutang tertunda', value: 'Rp 45.200.000', note: '12 invoice melewati jatuh tempo', tone: 'danger' as const },
    { label: 'Terkumpul bulan ini', value: 'Rp 128.500.000', note: '+15% dari bulan lalu', tone: 'success' as const },
    { label: 'Pendapatan mendatang', value: 'Rp 15.000.000', note: 'Masuk dalam 7 hari ke depan', tone: 'info' as const }
  ];

  const invoices = [
    { key: '#INV-2023-089', cells: [<span key="a">#INV-2023-089</span>, <span key="b">Budi Santoso</span>, <span key="c">Rp 2.500.000</span>, <Badge key="d" tone="danger">Lewat tempo</Badge>] },
    { key: '#INV-2023-090', cells: [<span key="a">#INV-2023-090</span>, <span key="b">Siti Aminah</span>, <span key="c">Rp 1.800.000</span>, <Badge key="d" tone="warning">Sebagian</Badge>] },
    { key: '#INV-2023-091', cells: [<span key="a">#INV-2023-091</span>, <span key="b">Agus Pratama</span>, <span key="c">Rp 2.200.000</span>, <Badge key="d" tone="success">Lunas</Badge>] }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        {metrics.map((metric) => (<MetricCard key={metric.label} {...metric} />))}
      </div>
      <div className="twoColLayout">
        <SectionCard title="Invoice aktif" lead="Daftar invoice yang perlu ditinjau oleh finance team.">
          <DataTable columns={[{ label: 'Invoice' }, { label: 'Siswa' }, { label: 'Nominal' }, { label: 'Status', align: 'right' }]} rows={invoices} />
        </SectionCard>
        <SectionCard title="Aksi penagihan" lead="Langkah cepat untuk menutup selisih pembayaran.">
          <SimpleList items={[
            { title: 'Kirim pengingat WhatsApp', meta: 'Otomatis untuk invoice yang lewat jatuh tempo.', tone: 'info' as const, extra: 'Siap' },
            { title: 'Ekspor rekonsiliasi', meta: 'Unduh data pembayaran untuk audit.', tone: 'success' as const, extra: 'CSV' },
            { title: 'Tinjau voucher diskon', meta: 'Validasi voucher yang dipakai pada batch ini.', tone: 'warning' as const, extra: 'Tinjau' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
