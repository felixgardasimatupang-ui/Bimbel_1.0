'use client';

import { CrudPanel } from './crud';

export function LmsPanel() {
  return (
    <CrudPanel
      title="LMS & Materi Pembelajaran"
      lead="Daftar materi, progres kelas, dan akses belajar yang terstruktur."
      eyebrow="Academic Delivery"
      apiPath="courses"
      emptyState="Belum ada kursus. Klik + Tambah untuk membuat kursus baru."
      columns={[
        { key: 'title', label: 'Judul', render: (item) => <strong>{item.title as string}</strong> },
        { key: 'subject', label: 'Mapel', render: (item) => <span>{item.subject as string}</span> },
        { key: 'grade', label: 'Kelas', render: (item) => <span>{item.grade as string}</span> },
        { key: 'lessonCount', label: 'Pelajaran', align: 'right', render: (item) => <span>{item.lessonCount as number} pelajaran</span> },
      ]}
      fields={[
        { key: 'title', label: 'Judul Kursus', type: 'text', required: true },
        { key: 'subject', label: 'Mata Pelajaran', type: 'text', required: true },
        { key: 'grade', label: 'Kelas', type: 'text', required: true },
        { key: 'lessonCount', label: 'Jumlah Pelajaran', type: 'number', required: true },
      ]}
    />
  );
}
