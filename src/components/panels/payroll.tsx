import { MetricCard, SectionCard, DataTable, Timeline, Badge } from './shared';

export function PayrollPanel() {
  const batches = [
    { key: 'Batch A', cells: [<span key="a">Batch A</span>, <span key="b">18 tutor</span>, <span key="c">Rp 42.000.000</span>, <Badge key="d" tone="warning">Menunggu persetujuan</Badge>] },
    { key: 'Batch B', cells: [<span key="a">Batch B</span>, <span key="b">6 staf</span>, <span key="c">Rp 13.200.000</span>, <Badge key="d" tone="success">Siap</Badge>] },
    { key: 'Batch C', cells: [<span key="a">Batch C</span>, <span key="b">4 tutor</span>, <span key="c">Rp 8.400.000</span>, <Badge key="d" tone="info">Draf</Badge>] }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Jam mengajar" value="1.284" note="Total jam yang dihitung dalam periode berjalan" tone="info" />
        <MetricCard label="Persetujuan tertunda" value="3" note="Batch menunggu approval manajer cabang" tone="warning" />
        <MetricCard label="Potongan diterapkan" value="Rp 5.800.000" note="Potongan absensi dan koreksi lain" tone="danger" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Batch payroll" lead="Batch yang sedang diproses untuk periode ini.">
          <DataTable columns={[{ label: 'Batch' }, { label: 'Orang' }, { label: 'Nominal' }, { label: 'Status', align: 'right' }]} rows={batches} />
        </SectionCard>
        <SectionCard title="Aturan persetujuan" lead="Aturan yang perlu dipenuhi sebelum payout dikirim.">
          <Timeline items={[
            { title: 'Validasi jam mengajar', meta: 'Bandingkan kehadiran dengan assignment jadwal.', time: 'Langkah 1', tone: 'info' },
            { title: 'Periksa potongan', meta: 'Pastikan koreksi absensi dan izin sudah sinkron.', time: 'Langkah 2', tone: 'warning' },
            { title: 'Setujui payout', meta: 'Hanya supervisor yang berhak mengeksekusi.', time: 'Langkah 3', tone: 'success' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
