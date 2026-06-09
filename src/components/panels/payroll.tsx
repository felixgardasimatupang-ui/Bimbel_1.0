'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function PayrollPanel() {
  return (
    <CrudPanel
      title="Manajemen Penggajian"
      lead="Ringkasan jam mengajar, approval, dan status pembayaran payroll."
      eyebrow="Operations"
      apiPath="batches"
      emptyState="Belum ada batch payroll. Klik + Tambah untuk membuat batch baru."
      columns={[
        { key: 'batchName', label: 'Batch', render: (item) => <strong>{item.batchName as string}</strong> },
        { key: 'personCount', label: 'Orang', render: (item) => <span>{item.personCount as number} orang</span> },
        { key: 'amount', label: 'Nominal', render: (item) => <span>Rp {(item.amount as number).toLocaleString('id-ID')}</span> },
        { key: 'status', label: 'Status', align: 'right', render: (item) => {
          const s = item.status as string;
          return <Badge tone={s === 'ready' ? 'success' : s === 'pending_approval' ? 'warning' : 'info'}>{s === 'ready' ? 'Siap' : s === 'pending_approval' ? 'Menunggu' : 'Draf'}</Badge>;
        }},
      ]}
      fields={[
        { key: 'batchName', label: 'Nama Batch', type: 'text', required: true },
        { key: 'personCount', label: 'Jumlah Orang', type: 'number', required: true },
        { key: 'amount', label: 'Jumlah (Rp)', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', required: true, options: [
          { label: 'Draf', value: 'draft' },
          { label: 'Siap', value: 'ready' },
          { label: 'Menunggu Persetujuan', value: 'pending_approval' },
        ]},
      ]}
    />
  );
}
