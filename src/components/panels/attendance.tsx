'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function AttendancePanel() {
  return (
    <CrudPanel
      title="Sistem Absensi"
      lead="Status kehadiran siswa dan staf dengan validasi yang jelas."
      eyebrow="Operations"
      apiPath="attendance"
      emptyState="Belum ada data absensi. Klik + Tambah untuk mencatat kehadiran."
      columns={[
        { key: 'studentName', label: 'Nama', render: (item) => <strong>{item.studentName as string}</strong> },
        { key: 'date', label: 'Tanggal', render: (item) => <span>{item.date as string}</span> },
        { key: 'time', label: 'Waktu', render: (item) => <span>{item.time as string}</span> },
        { key: 'status', label: 'Status', render: (item) => {
          const s = item.status as string;
          return <Badge tone={s === 'present' ? 'success' : s === 'late' ? 'warning' : 'danger'}>{s === 'present' ? 'Hadir' : s === 'late' ? 'Terlambat' : 'Tidak hadir'}</Badge>;
        }},
        { key: 'method', label: 'Metode', align: 'right', render: (item) => <span>{item.method as string}</span> },
      ]}
      fields={[
        { key: 'studentName', label: 'Nama Siswa/Staf', type: 'text', required: true },
        { key: 'time', label: 'Waktu (contoh: 08:00)', type: 'text', required: true },
        { key: 'status', label: 'Status', type: 'select', required: true, options: [
          { label: 'Hadir', value: 'present' },
          { label: 'Terlambat', value: 'late' },
          { label: 'Tidak hadir', value: 'absent' },
        ]},
        { key: 'method', label: 'Metode Check-in', type: 'text', required: true },
        { key: 'date', label: 'Tanggal (YYYY-MM-DD)', type: 'text', required: true },
      ]}
    />
  );
}
