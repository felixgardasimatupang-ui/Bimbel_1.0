'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function ProgressPanel() {
  return (
    <CrudPanel
      title="Laporan Progres Belajar"
      lead="Pemetaan progres, performa, dan area yang perlu intervensi."
      eyebrow="Academic Delivery"
      apiPath="progress"
      emptyState="Belum ada data progres. Klik + Tambah untuk menambah."
      columns={[
        { key: 'studentName', label: 'Nama', render: (item) => <strong>{(item as Record<string, unknown>).studentName as string}</strong> },
        { key: 'subject', label: 'Mapel', render: (item) => <span>{(item as Record<string, unknown>).subject as string}</span> },
        { key: 'score', label: 'Skor', render: (item) => {
          const score = (item as Record<string, unknown>).score as number;
          return <Badge tone={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}>{score}%</Badge>;
        }},
        { key: 'grade', label: 'Kelas', align: 'right', render: (item) => <span>{(item as Record<string, unknown>).grade as string}</span> },
      ]}
      fields={[
        { key: 'studentName', label: 'Nama Siswa', type: 'text', required: true },
        { key: 'subject', label: 'Mata Pelajaran', type: 'text', required: true },
        { key: 'score', label: 'Skor (0-100)', type: 'number', required: true },
        { key: 'grade', label: 'Kelas', type: 'text', required: true },
      ]}
    />
  );
}
