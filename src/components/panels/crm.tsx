'use client';

import { CrudPanel } from './crud';
import { Badge } from './shared';

export function CrmPanel() {
  return (
    <CrudPanel
      title="Manajemen Siswa CRM"
      lead="Pipeline prospek, profiling siswa, dan tindak lanjut admissions."
      eyebrow="Core Operations"
      apiPath="prospects"
      emptyState="Belum ada data prospek. Klik + Tambah untuk menambah prospek baru."
      columns={[
        { key: 'name', label: 'Nama', render: (item) => <strong>{item.name as string}</strong> },
        { key: 'phone', label: 'Telepon', render: (item) => <span>{item.phone as string}</span> },
        { key: 'source', label: 'Sumber', render: (item) => <span>{item.source as string}</span> },
        { key: 'tier', label: 'Tier', render: (item) => {
          const t = item.tier as string;
          return <Badge tone={t === 'high' ? 'danger' : t === 'medium' ? 'warning' : 'info'}>{t === 'high' ? 'High' : t === 'medium' ? 'Medium' : 'Low'}</Badge>;
        }},
        { key: 'status', label: 'Status', align: 'right', render: (item) => {
          const s = item.status as string;
          return <Badge tone={s === 'registered' ? 'success' : s === 'trial' ? 'warning' : s === 'contacted' ? 'info' : 'neutral'}>{s === 'registered' ? 'Terdaftar' : s === 'trial' ? 'Uji Coba' : s === 'contacted' ? 'Dihubungi' : 'Prospek'}</Badge>;
        }},
      ]}
      fields={[
        { key: 'name', label: 'Nama Lengkap', type: 'text', required: true },
        { key: 'phone', label: 'Nomor Telepon', type: 'text', required: true },
        { key: 'source', label: 'Sumber', type: 'select', required: true, options: [
          { label: 'Formulir Web', value: 'Formulir Web' },
          { label: 'Referral', value: 'Referral' },
          { label: 'Instagram', value: 'Instagram' },
          { label: 'Email Campaign', value: 'Email Campaign' },
          { label: 'Google Ads', value: 'Google Ads' },
          { label: 'WhatsApp', value: 'WhatsApp' },
        ]},
        { key: 'tier', label: 'Tier', type: 'select', required: true, options: [
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ]},
        { key: 'status', label: 'Status', type: 'select', required: true, options: [
          { label: 'Prospek', value: 'prospect' },
          { label: 'Dihubungi', value: 'contacted' },
          { label: 'Uji Coba', value: 'trial' },
          { label: 'Terdaftar', value: 'registered' },
        ]},
        { key: 'notes', label: 'Catatan', type: 'textarea' },
      ]}
    />
  );
}
