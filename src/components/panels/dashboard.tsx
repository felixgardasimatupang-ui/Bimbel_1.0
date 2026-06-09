import { MetricCard, SectionCard, DataTable, SimpleList, Badge } from './shared';

export function DashboardPanel() {
  const metrics = [
    { label: 'Pendapatan total', value: 'Rp 124,5M', emoji: '💰', note: '+12,5% dibanding bulan lalu', tone: 'success' as const },
    { label: 'Siswa aktif', value: '842', emoji: '👥', note: '+42 siswa baru pada periode ini', tone: 'info' as const },
    { label: 'Tingkat kehadiran', value: '94,2%', emoji: '📊', note: 'Turun 1,2% dari pekan lalu', tone: 'warning' as const },
    { label: 'Invoice tertunda', value: '34', emoji: '📋', note: 'Perlu tindak lanjut hari ini', tone: 'danger' as const }
  ];

  const priorities = [
    { title: 'Tinjau cabang Bandung', meta: 'Kesehatan cabang dan okupansi perlu validasi.', tone: 'info' as const, extra: 'Hari ini' },
    { title: 'Setujui batch payroll', meta: '22 instruksi pembayaran menunggu persetujuan.', tone: 'warning' as const, extra: 'Jatuh tempo 14:00' },
    { title: 'Tindak lanjuti invoice lewat jatuh tempo', meta: 'Sisa 12 invoice melewati tenggat.', tone: 'danger' as const, extra: 'Mendesak' }
  ];

  const admissions = [
    { title: 'Ahmad Reza', meta: 'Kelas 10 Sains', tone: 'success' as const, extra: 'Selesai' },
    { title: 'Siti Nurhaliza', meta: 'Kelas 12 Sosial', tone: 'warning' as const, extra: 'Dokumen tertunda' },
    { title: 'Dian Pelangi', meta: 'Kelas 11 Sains', tone: 'success' as const, extra: 'Selesai' }
  ];

  const branches = [
    { key: 'Jakarta Selatan', cells: [<span key="a">Jakarta Selatan</span>, <span key="b">91%</span>, <Badge key="c" tone="success">Sehat</Badge>] },
    { key: 'Bandung', cells: [<span key="a">Bandung</span>, <span key="b">76%</span>, <Badge key="c" tone="warning">Tinjau</Badge>] },
    { key: 'Surabaya', cells: [<span key="a">Surabaya</span>, <span key="b">88%</span>, <Badge key="c" tone="info">Stabil</Badge>] }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid">
        {metrics.map((metric) => (<MetricCard key={metric.label} {...metric} />))}
      </div>
      <div className="twoColLayout">
        <SectionCard title="Prioritas hari ini ⚡" lead="Tugas yang paling bernilai untuk diselesaikan terlebih dahulu.">
          <SimpleList items={priorities} />
        </SectionCard>
        <SectionCard title="Penerimaan terbaru 🎓" lead="Prospek yang sedang bergerak di alur tindak lanjut.">
          <SimpleList items={admissions} />
        </SectionCard>
      </div>
      <SectionCard title="Kesehatan cabang 🏢" lead="Ringkasan sadar cabang untuk pemantauan cepat.">
        <DataTable
          columns={[{ label: 'Cabang' }, { label: 'Okupansi' }, { label: 'Status', align: 'right' }]}
          rows={branches}
        />
      </SectionCard>
    </section>
  );
}
