'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function FinancePanel() {
  return (
    <CrudPanel
      title="Penagihan & Keuangan"
      lead="Kontrol invoice, pembayaran, dan posisi piutang secara ringkas."
      eyebrow="Monetization"
      apiPath="invoices"
      emptyState="Belum ada data invoice. Klik + Tambah untuk membuat invoice baru."
      columns={[
        { key: 'invoiceNo', label: 'Invoice', render: (item) => <strong>{item.invoiceNo as string}</strong> },
        { key: 'studentName', label: 'Siswa', render: (item) => <span>{item.studentName as string}</span> },
        { key: 'amount', label: 'Nominal', render: (item) => <span>Rp {(item.amount as number).toLocaleString('id-ID')}</span> },
        { key: 'status', label: 'Status', align: 'right', render: (item) => {
          const s = item.status as string;
          return <Badge tone={s === 'paid' ? 'success' : s === 'partial' ? 'warning' : 'danger'}>{s === 'paid' ? 'Lunas' : s === 'partial' ? 'Sebagian' : 'Tertunda'}</Badge>;
        }},
        { key: 'dueDate', label: 'Jatuh Tempo', align: 'right', render: (item) => <span>{item.dueDate as string}</span> },
      ]}
      fields={[
        { key: 'invoiceNo', label: 'Nomor Invoice', type: 'text', required: true },
        { key: 'studentName', label: 'Nama Siswa', type: 'text', required: true },
        { key: 'amount', label: 'Jumlah (Rp)', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', required: true, options: [
          { label: 'Tertunda', value: 'pending' },
          { label: 'Sebagian', value: 'partial' },
          { label: 'Lunas', value: 'paid' },
        ]},
        { key: 'dueDate', label: 'Jatuh Tempo', type: 'text', required: true },
      ]}
    />
  );
}
