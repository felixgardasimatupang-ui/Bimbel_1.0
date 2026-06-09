'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function dayColor(day: string) {
  const map: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'neutral'> = {
    Senin: 'info', Selasa: 'warning', Rabu: 'success', Kamis: 'danger', Jumat: 'neutral',
  };
  return map[day] ?? 'neutral';
}

export function SchedulePanel() {
  return (
    <CrudPanel
      title="Jadwal Akademik"
      lead="Ruang, tutor, dan slot waktu dalam tampilan terstruktur."
      eyebrow="Academic Delivery"
      apiPath="classes"
      emptyState="Belum ada jadwal kelas. Klik + Tambah untuk menambah jadwal baru."
      columns={[
        { key: 'day', label: 'Hari', render: (item) => <Badge tone={dayColor(item.day as string)}>{item.day as string}</Badge> },
        { key: 'time', label: 'Jam', render: (item) => <strong>{item.time as string}</strong> },
        { key: 'subject', label: 'Mata Pelajaran', render: (item) => <span>{item.subject as string}</span> },
        { key: 'className', label: 'Kelas', render: (item) => <span>{item.className as string}</span> },
        { key: 'room', label: 'Ruangan', render: (item) => <span>{item.room as string}</span> },
        { key: 'tutor', label: 'Tutor', align: 'right', render: (item) => <span>{item.tutor as string}</span> },
      ]}
      fields={[
        { key: 'subject', label: 'Mata Pelajaran', type: 'text', required: true },
        { key: 'className', label: 'Kelas', type: 'text', required: true },
        { key: 'day', label: 'Hari', type: 'select', required: true, options: DAYS.map(d => ({ label: d, value: d })) },
        { key: 'time', label: 'Jam (contoh: 14:00)', type: 'text', required: true },
        { key: 'room', label: 'Ruangan', type: 'text', required: true },
        { key: 'tutor', label: 'Nama Tutor', type: 'text', required: true },
      ]}
    />
  );
}
