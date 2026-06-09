'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function MaterialPanel() {
  return (
    <CrudPanel
      title="Detail Materi Pembelajaran"
      lead="Detail modul, outline pembelajaran, dan sumber belajar pendukung."
      eyebrow="Academic Delivery"
      apiPath="modules"
      emptyState="Belum ada modul. Klik + Tambah untuk membuat modul baru."
      columns={[
        { key: 'title', label: 'Judul', render: (item) => <strong>{item.title as string}</strong> },
        { key: 'subject', label: 'Mapel', render: (item) => <span>{item.subject as string}</span> },
        { key: 'type', label: 'Tipe', render: (item) => <Badge tone="info">{(item.type as string).toUpperCase()}</Badge> },
        { key: 'status', label: 'Status', align: 'right', render: (item) => {
          const s = item.status as string;
          return <Badge tone={s === 'published' ? 'success' : 'warning'}>{s === 'published' ? 'Terbit' : 'Draf'}</Badge>;
        }},
      ]}
      fields={[
        { key: 'title', label: 'Judul Modul', type: 'text', required: true },
        { key: 'subject', label: 'Mata Pelajaran', type: 'text', required: true },
        { key: 'type', label: 'Tipe File', type: 'select', required: true, options: [
          { label: 'PDF', value: 'PDF' },
          { label: 'DOC', value: 'DOC' },
          { label: 'ZIP', value: 'ZIP' },
          { label: 'LINK', value: 'LINK' },
        ]},
        { key: 'status', label: 'Status', type: 'select', required: true, options: [
          { label: 'Draf', value: 'draft' },
          { label: 'Terbit', value: 'published' },
        ]},
      ]}
    />
  );
}
