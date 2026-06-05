import { MetricCard, SectionCard, DataTable, SimpleList, Badge } from './shared';

export function AttendancePanel() {
  const rows = [
    { key: 'Ahmad', cells: [<span key="a">Ahmad Reza</span>, <span key="b">08:02</span>, <Badge key="c" tone="success">Hadir</Badge>, <span key="d">QR + GPS</span>] },
    { key: 'Siti', cells: [<span key="a">Siti Aminah</span>, <span key="b">08:10</span>, <Badge key="c" tone="warning">Terlambat</Badge>, <span key="d">QR saja</span>] },
    { key: 'Budi', cells: [<span key="a">Budi Santoso</span>, <span key="b">--</span>, <Badge key="c" tone="danger">Tidak hadir</Badge>, <span key="d">Tanpa check-in</span>] }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Hadir hari ini" value="284" note="Siswa dan staf yang sudah check-in" tone="success" />
        <MetricCard label="Terlambat check-in" value="11" note="Perlu tindak lanjut via notifikasi" tone="warning" />
        <MetricCard label="Rekaman hilang" value="4" note="Data absensi masih menunggu validasi" tone="danger" />
      </div>
      <div className="twoColLayout">
        <SectionCard title="Log kehadiran" lead="Baris data terbaru dari sistem check-in.">
          <DataTable columns={[{ label: 'Nama' }, { label: 'Waktu' }, { label: 'Status' }, { label: 'Metode', align: 'right' }]} rows={rows} />
        </SectionCard>
        <SectionCard title="Kebijakan validasi" lead="Aturan yang dipakai untuk memverifikasi kehadiran.">
          <SimpleList items={[
            { title: 'Scan QR wajib', meta: 'Setiap check-in harus menghasilkan event QR.', tone: 'info' as const, extra: 'Aktif' },
            { title: 'Konfirmasi GPS', meta: 'Dipakai untuk cabang yang mengaktifkan lokasi.', tone: 'success' as const, extra: 'Aktif' },
            { title: 'Log pengecualian', meta: 'Absensi manual harus memiliki alasan.', tone: 'warning' as const, extra: 'Tinjau' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
