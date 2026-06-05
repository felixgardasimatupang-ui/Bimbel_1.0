'use client';

import toast from 'react-hot-toast';

import { MetricCard, SectionCard, CardGrid, SimpleList, Badge } from './shared';
import { DataGrid } from '@/components/ui/data-grid';

const prospects = [
  { id: 'P-001', name: 'Rani Putri', source: 'Formulir Web', status: 'Dihubungi', phone: '+62 811 2222 111', tier: 'High' },
  { id: 'P-002', name: 'Fahmi Akbar', source: 'Referral', status: 'Uji Coba', phone: '+62 812 3333 222', tier: 'Medium' },
  { id: 'P-003', name: 'Maya Lestari', source: 'Instagram', status: 'Prospek', phone: '+62 813 4444 333', tier: 'Low' },
  { id: 'P-004', name: 'Budi Santoso', source: 'Email Campaign', status: 'Terdaftar', phone: '+62 814 5555 444', tier: 'High' },
  { id: 'P-005', name: 'Siti Aminah', source: 'WhatsApp', status: 'Dihubungi', phone: '+62 815 6666 555', tier: 'Medium' },
  { id: 'P-006', name: 'Agus Pratama', source: 'Formulir Web', status: 'Prospek', phone: '+62 816 7777 666', tier: 'Low' },
  { id: 'P-007', name: 'Dian Pelangi', source: 'Referral', status: 'Uji Coba', phone: '+62 817 8888 777', tier: 'High' },
  { id: 'P-008', name: 'Eko Wijaya', source: 'Google Ads', status: 'Terdaftar', phone: '+62 818 9999 888', tier: 'Medium' },
  { id: 'P-009', name: 'Fitri Handayani', source: 'Instagram', status: 'Dihubungi', phone: '+62 819 0000 999', tier: 'Medium' },
  { id: 'P-010', name: 'Gilang Ramadhan', source: 'Email Campaign', status: 'Prospek', phone: '+62 820 1111 000', tier: 'Low' },
  { id: 'P-011', name: 'Hana Safira', source: 'WhatsApp', status: 'Uji Coba', phone: '+62 821 2222 111', tier: 'High' },
  { id: 'P-012', name: 'Indra Lesmana', source: 'Referral', status: 'Terdaftar', phone: '+62 822 3333 222', tier: 'Medium' }
];

function statusBadge(status: string) {
  switch (status) {
    case 'Prospek': return <Badge tone="info">{status}</Badge>;
    case 'Dihubungi': return <Badge tone="warning">{status}</Badge>;
    case 'Uji Coba': return <Badge tone="success">{status}</Badge>;
    case 'Terdaftar': return <Badge tone="neutral">{status}</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export function CrmPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Prospek baru" value="48" note="Prospek baru minggu ini" tone="info" />
        <MetricCard label="Pemesanan uji coba" value="19" note="Jadwal uji coba yang sudah terkonfirmasi" tone="success" />
        <MetricCard label="Tingkat konversi" value="31%" note="Prospek yang berubah menjadi pendaftaran" tone="warning" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Alur prospek" lead="Pergerakan prospek dari pertanyaan awal hingga pendaftaran.">
          <CardGrid columns={4} items={[
            { badge: 'Prospek', title: '12', meta: 'Pertanyaan baru', tone: 'info' },
            { badge: 'Dihubungi', title: '15', meta: 'Tindak lanjut berjalan', tone: 'warning' },
            { badge: 'Uji coba', title: '11', meta: 'Pemesanan uji coba terkonfirmasi', tone: 'success' },
            { badge: 'Terdaftar', title: '10', meta: 'Pendaftaran selesai', tone: 'info' }
          ]} />
        </SectionCard>

        <SectionCard title="Antrian tindak lanjut" lead="Prospek yang harus ditindaklanjuti hari ini.">
          <SimpleList items={[
            { title: 'Rani Putri', meta: 'Permintaan orang tua via formulir web', tone: 'warning' as const, extra: 'Telepon' },
            { title: 'Fahmi Akbar', meta: 'Pemesanan uji coba menunggu konfirmasi', tone: 'info' as const, extra: 'WhatsApp' },
            { title: 'Maya Lestari', meta: 'Menanyakan informasi beasiswa', tone: 'success' as const, extra: 'Email' }
          ]} />
        </SectionCard>
      </div>

      <SectionCard title="Database prospek" lead="Semua prospek dengan pencarian dan pagination.">
        <DataGrid
          columns={[
            { key: 'name', label: 'Nama', render: (item) => <strong>{item.name as string}</strong> },
            { key: 'phone', label: 'Telepon', render: (item) => <span>{item.phone as string}</span> },
            { key: 'source', label: 'Sumber', render: (item) => <span>{item.source as string}</span> },
            { key: 'tier', label: 'Tier', render: (item) => <Badge tone={item.tier === 'High' ? 'danger' : item.tier === 'Medium' ? 'warning' : 'info'}>{item.tier as string}</Badge> },
            { key: 'status', label: 'Status', render: (item) => statusBadge(item.status as string), align: 'right' }
          ]}
          data={prospects}
          pageSize={5}
          searchable
          searchPlaceholder="Cari nama, sumber, atau status..."
          onRowClick={(item) => toast.success(`Memilih ${item.name as string}`)}
        />
      </SectionCard>
    </section>
  );
}
