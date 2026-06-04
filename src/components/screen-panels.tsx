import type { ReactNode } from 'react';

import type { ScreenSummary } from '@/lib/screens';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type MetricProps = {
  label: string;
  value: string;
  note: string;
  tone?: Tone;
};

type SectionCardProps = {
  title: string;
  lead?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

type TableColumn = {
  label: string;
  align?: 'left' | 'right';
};

type TableRow = {
  key: string;
  cells: ReactNode[];
};

type DataTableProps = {
  columns: TableColumn[];
  rows: TableRow[];
};

type ChatMessage = {
  author: string;
  role: 'agent' | 'customer';
  time: string;
  body: string;
};

function toneClass(tone: Tone = 'neutral') {
  switch (tone) {
    case 'success':
      return 'toneSuccess';
    case 'warning':
      return 'toneWarning';
    case 'danger':
      return 'toneDanger';
    case 'info':
      return 'toneInfo';
    default:
      return 'toneNeutral';
  }
}

function MetricCard({ label, value, note, tone = 'neutral' }: MetricProps) {
  return (
    <article className="metricCard">
      <span className="metricLabel">{label}</span>
      <strong className={`metricValue ${toneClass(tone)}`}>{value}</strong>
      <p className="metricNote">{note}</p>
    </article>
  );
}

function SectionCard({ title, lead, children, actions, className }: SectionCardProps) {
  return (
    <section className={`panel ${className ?? ''}`.trim()}>
      <div className="panelHeader">
        <div>
          <h3 className="panelTitle">{title}</h3>
          {lead ? <p className="panelLead">{lead}</p> : null}
        </div>
        {actions ? <div className="panelActions">{actions}</div> : null}
      </div>
      <div className="panelBody">{children}</div>
    </section>
  );
}

function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge ${toneClass(tone)}`.trim()}>{children}</span>;
}

function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="tableShell">
      <table className="dataTable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={column.align === 'right' ? 'alignRight' : undefined}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td key={`${row.key}-${index}`} className={columns[index]?.align === 'right' ? 'alignRight' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleList({
  items
}: {
  items: Array<{
    title: string;
    meta: string;
    tone?: Tone;
    extra?: string;
  }>;
}) {
  return (
    <ul className="simpleList">
      {items.map((item) => (
        <li key={`${item.title}-${item.meta}`} className="listRow">
          <div>
            <strong>{item.title}</strong>
            <p>{item.meta}</p>
          </div>
          <div className="listRowMeta">
            <span className={`toneDot ${toneClass(item.tone ?? 'neutral')}`} aria-hidden="true" />
            {item.extra ? <span>{item.extra}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProgressBars({
  items
}: {
  items: Array<{
    label: string;
    value: number;
    tone: Tone;
  }>;
}) {
  return (
    <div className="progressStack">
      {items.map((item) => (
        <div key={item.label} className="progressRow">
          <div className="progressHeading">
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="progressTrack" aria-hidden="true">
            <div className={`progressFill ${toneClass(item.tone)}`} style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline({
  items
}: {
  items: Array<{
    title: string;
    meta: string;
    time: string;
    tone?: Tone;
  }>;
}) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article key={`${item.title}-${item.time}`} className="timelineItem">
          <div className="timelineDot" />
          <div className="timelineBody">
            <div className="timelineHeader">
              <strong>{item.title}</strong>
              <Badge tone={item.tone ?? 'info'}>{item.time}</Badge>
            </div>
            <p>{item.meta}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function CardGrid({
  items,
  columns = 2
}: {
  items: Array<{
    title: string;
    meta: string;
    badge: string;
    tone?: Tone;
  }>;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className={`cardGrid cardGrid${columns}`}>
      {items.map((item) => (
        <article key={`${item.title}-${item.badge}`} className="miniCard">
          <Badge tone={item.tone ?? 'neutral'}>{item.badge}</Badge>
          <strong>{item.title}</strong>
          <p>{item.meta}</p>
        </article>
      ))}
    </div>
  );
}

function DashboardPanel() {
  const metrics = [
    { label: 'Pendapatan total', value: 'Rp 124,5M', note: '+12,5% dibanding bulan lalu', tone: 'success' as const },
    { label: 'Siswa aktif', value: '842', note: '+42 siswa baru pada periode ini', tone: 'info' as const },
    { label: 'Tingkat kehadiran', value: '94,2%', note: 'Turun 1,2% dari pekan lalu', tone: 'warning' as const },
    { label: 'Invoice tertunda', value: '34', note: 'Perlu tindak lanjut hari ini', tone: 'danger' as const }
  ];

  const priorities = [
    { title: 'Tinjau cabang Bandung', meta: 'Kesehatan cabang dan okupansi perlu validasi.', tone: 'info' as const, extra: 'Hari ini' },
    { title: 'Setujui batch payroll', meta: '22 instruksi pembayaran menunggu persetujuan.', tone: 'warning' as const, extra: 'Jatuh tempo 14:00' },
    { title: 'Tindak lanjuti invoice lewat jatuh tempo', meta: 'Sisa 12 invoice melewati tenggat.', tone: 'danger' as const, extra: 'Mendesak' }
  ];

  const admissions = [
    { title: 'Ahmad Reza', meta: 'Kelas 10 Sains', tone: 'success' as const, extra: 'Selesai' },
    { title: 'Siti Nurhaliza', meta: 'Kelas 12 Sosial', tone: 'warning' as const, extra: 'Dokumen tertunda' },
    { title: 'Dian Pelangi', meta: 'Kelas 11 Sains', tone: 'success' as const, extra: 'Selesai' }
  ];

  const branches = [
    {
      key: 'Jakarta Selatan',
      cells: [<span key="a">Jakarta Selatan</span>, <span key="b">91%</span>, <Badge key="c" tone="success">Sehat</Badge>]
    },
    {
      key: 'Bandung',
      cells: [<span key="a">Bandung</span>, <span key="b">76%</span>, <Badge key="c" tone="warning">Tinjau</Badge>]
    },
    {
      key: 'Surabaya',
      cells: [<span key="a">Surabaya</span>, <span key="b">88%</span>, <Badge key="c" tone="info">Stabil</Badge>]
    }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="twoColLayout">
        <SectionCard title="Prioritas hari ini" lead="Tugas yang paling bernilai untuk diselesaikan terlebih dahulu.">
          <SimpleList items={priorities} />
        </SectionCard>
        <SectionCard title="Penerimaan terbaru" lead="Prospek yang sedang bergerak di alur tindak lanjut.">
          <SimpleList items={admissions} />
        </SectionCard>
      </div>

      <SectionCard title="Kesehatan cabang" lead="Ringkasan sadar cabang untuk pemantauan cepat.">
        <DataTable
          columns={[
            { label: 'Cabang' },
            { label: 'Okupansi' },
            { label: 'Status', align: 'right' }
          ]}
          rows={branches}
        />
      </SectionCard>
    </section>
  );
}

function FinancePanel() {
  const metrics = [
    { label: 'Piutang tertunda', value: 'Rp 45.200.000', note: '12 invoice melewati jatuh tempo', tone: 'danger' as const },
    { label: 'Terkumpul bulan ini', value: 'Rp 128.500.000', note: '+15% dari bulan lalu', tone: 'success' as const },
    { label: 'Pendapatan mendatang', value: 'Rp 15.000.000', note: 'Masuk dalam 7 hari ke depan', tone: 'info' as const }
  ];

  const invoices = [
    {
      key: '#INV-2023-089',
      cells: [
        <span key="a">#INV-2023-089</span>,
        <span key="b">Budi Santoso</span>,
        <span key="c">Rp 2.500.000</span>,
        <Badge key="d" tone="danger">Lewat tempo</Badge>
      ]
    },
    {
      key: '#INV-2023-090',
      cells: [
        <span key="a">#INV-2023-090</span>,
        <span key="b">Siti Aminah</span>,
        <span key="c">Rp 1.800.000</span>,
        <Badge key="d" tone="warning">Sebagian</Badge>
      ]
    },
    {
      key: '#INV-2023-091',
      cells: [
        <span key="a">#INV-2023-091</span>,
        <span key="b">Agus Pratama</span>,
        <span key="c">Rp 2.200.000</span>,
        <Badge key="d" tone="success">Lunas</Badge>
      ]
    }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="twoColLayout">
        <SectionCard title="Invoice aktif" lead="Daftar invoice yang perlu ditinjau oleh finance team.">
          <DataTable
            columns={[
            { label: 'Invoice' },
            { label: 'Siswa' },
            { label: 'Nominal' },
            { label: 'Status', align: 'right' }
          ]}
          rows={invoices}
        />
      </SectionCard>

        <SectionCard title="Aksi penagihan" lead="Langkah cepat untuk menutup selisih pembayaran.">
          <SimpleList
            items={[
              { title: 'Kirim pengingat WhatsApp', meta: 'Otomatis untuk invoice yang lewat jatuh tempo.', tone: 'info' as const, extra: 'Siap' },
              { title: 'Ekspor rekonsiliasi', meta: 'Unduh data pembayaran untuk audit.', tone: 'success' as const, extra: 'CSV' },
              { title: 'Tinjau voucher diskon', meta: 'Validasi voucher yang dipakai pada batch ini.', tone: 'warning' as const, extra: 'Tinjau' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function SchedulePanel() {
  const schedule = [
    ['14:00', 'Matematika Kelas 10', 'Fisika Kelas 12', '', 'Biologi Kelas 11', ''],
    ['16:00', '', 'Kimia Kelas 12', 'Matematika Kelas 9', '', 'Bahasa Inggris Kelas 10'],
    ['18:00', 'Klub membaca', '', 'Klinik esai', 'Tinjauan mentor', '']
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Kelas hari ini" value="18" note="Slot aktif pada semua cabang" tone="info" />
        <MetricCard label="Bentrok ruang" value="0" note="Tidak ada bentrok jadwal yang aktif" tone="success" />
        <MetricCard label="Cakupan tutor" value="96%" note="Cakupan tutor untuk minggu ini" tone="warning" />
      </div>

      <SectionCard title="Jadwal kelas mingguan" lead="Tampilan ringkas untuk memeriksa slot, tutor, dan ruang.">
        <div className="scheduleGrid">
          <div className="scheduleHeadRow">
            <span />
            <span>Sen 12</span>
            <span className="isActive">Sel 13</span>
            <span>Rab 14</span>
            <span>Kam 15</span>
            <span>Jum 16</span>
          </div>
          {schedule.map((row) => (
            <div key={row[0]} className="scheduleRow">
              <span className="scheduleTime">{row[0]}</span>
              {row.slice(1).map((cell, index) => (
                <div key={`${row[0]}-${index}`} className={cell ? 'scheduleSlot scheduleSlotFilled' : 'scheduleSlot'}>
                  {cell ? <strong>{cell}</strong> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="twoColLayout">
        <SectionCard title="Kelas berikutnya" lead="Agenda berikutnya yang paling dekat.">
          <CardGrid
            columns={2}
            items={[
              { badge: '14:30', title: 'Fisika Kelas 12', meta: 'Ruang C, Ibu Siti', tone: 'info' },
              { badge: '15:45', title: 'Kimia Kelas 11', meta: 'Lab 1, Pak Yanto', tone: 'warning' },
              { badge: '17:00', title: 'Matematika Kelas 9', meta: 'Ruang D, Pak Budi', tone: 'success' },
              { badge: '18:30', title: 'Klinik Bahasa Inggris', meta: 'Ruang A, Bu Jane', tone: 'info' }
            ]}
          />
        </SectionCard>
        <SectionCard title="Alokasi ruangan" lead="Ketersediaan dan pemakaian ruangan.">
          <SimpleList
            items={[
              { title: 'Ruang A', meta: '2 kelas terjadwal', tone: 'success' as const, extra: 'Tersedia' },
              { title: 'Ruang B', meta: '1 kelas diblokir untuk perawatan', tone: 'warning' as const, extra: 'Perawatan' },
              { title: 'Lab 1', meta: 'Penuh untuk jalur sains', tone: 'danger' as const, extra: 'Penuh' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function PayrollPanel() {
  const batches = [
    {
      key: 'Batch A',
      cells: [<span key="a">Batch A</span>, <span key="b">18 tutor</span>, <span key="c">Rp 42.000.000</span>, <Badge key="d" tone="warning">Menunggu persetujuan</Badge>]
    },
    {
      key: 'Batch B',
      cells: [<span key="a">Batch B</span>, <span key="b">6 staf</span>, <span key="c">Rp 13.200.000</span>, <Badge key="d" tone="success">Siap</Badge>]
    },
    {
      key: 'Batch C',
      cells: [<span key="a">Batch C</span>, <span key="b">4 tutor</span>, <span key="c">Rp 8.400.000</span>, <Badge key="d" tone="info">Draf</Badge>]
    }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Jam mengajar" value="1.284" note="Total jam yang dihitung dalam periode berjalan" tone="info" />
        <MetricCard label="Persetujuan tertunda" value="3" note="Batch menunggu approval manajer cabang" tone="warning" />
        <MetricCard label="Potongan diterapkan" value="Rp 5.800.000" note="Potongan absensi dan koreksi lain" tone="danger" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Batch payroll" lead="Batch yang sedang diproses untuk periode ini.">
          <DataTable
            columns={[
              { label: 'Batch' },
              { label: 'Orang' },
              { label: 'Nominal' },
              { label: 'Status', align: 'right' }
            ]}
            rows={batches}
          />
        </SectionCard>

        <SectionCard title="Aturan persetujuan" lead="Aturan yang perlu dipenuhi sebelum payout dikirim.">
          <Timeline
            items={[
              { title: 'Validasi jam mengajar', meta: 'Bandingkan kehadiran dengan assignment jadwal.', time: 'Langkah 1', tone: 'info' },
              { title: 'Periksa potongan', meta: 'Pastikan koreksi absensi dan izin sudah sinkron.', time: 'Langkah 2', tone: 'warning' },
              { title: 'Setujui payout', meta: 'Hanya supervisor yang berhak mengeksekusi.', time: 'Langkah 3', tone: 'success' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function AttendancePanel() {
  const rows = [
    {
      key: 'Ahmad',
      cells: [<span key="a">Ahmad Reza</span>, <span key="b">08:02</span>, <Badge key="c" tone="success">Hadir</Badge>, <span key="d">QR + GPS</span>]
    },
    {
      key: 'Siti',
      cells: [<span key="a">Siti Aminah</span>, <span key="b">08:10</span>, <Badge key="c" tone="warning">Terlambat</Badge>, <span key="d">QR saja</span>]
    },
    {
      key: 'Budi',
      cells: [<span key="a">Budi Santoso</span>, <span key="b">--</span>, <Badge key="c" tone="danger">Tidak hadir</Badge>, <span key="d">Tanpa check-in</span>]
    }
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
          <DataTable
            columns={[
              { label: 'Nama' },
              { label: 'Waktu' },
              { label: 'Status' },
              { label: 'Metode', align: 'right' }
            ]}
            rows={rows}
          />
        </SectionCard>

        <SectionCard title="Kebijakan validasi" lead="Aturan yang dipakai untuk memverifikasi kehadiran.">
          <SimpleList
            items={[
              { title: 'Scan QR wajib', meta: 'Setiap check-in harus menghasilkan event QR.', tone: 'info' as const, extra: 'Aktif' },
              { title: 'Konfirmasi GPS', meta: 'Dipakai untuk cabang yang mengaktifkan lokasi.', tone: 'success' as const, extra: 'Aktif' },
              { title: 'Log pengecualian', meta: 'Absensi manual harus memiliki alasan.', tone: 'warning' as const, extra: 'Tinjau' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function LmsPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Kelas aktif" value="24" note="Kelas yang sedang menggunakan LMS" tone="info" />
        <MetricCard label="Pengumpulan tugas" value="86%" note="Penyelesaian tugas minggu ini" tone="success" />
        <MetricCard label="Siswa berisiko" value="9" note="Perlu perhatian dari tutor" tone="warning" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Pustaka materi" lead="Materi belajar yang dapat diakses oleh kelas dan siswa.">
          <CardGrid
            columns={2}
            items={[
              { badge: 'Matematika', title: 'Dasar aljabar', meta: 'Kelas 10 · 12 pelajaran', tone: 'info' },
              { badge: 'Sains', title: 'Dasar kimia', meta: 'Kelas 11 · 8 pelajaran', tone: 'warning' },
              { badge: 'Bahasa', title: 'Klinik esai', meta: 'Kelas 12 · 6 pelajaran', tone: 'success' },
              { badge: 'Persiapan ujian', title: 'Paket tryout', meta: 'Pilihan ganda + esai', tone: 'info' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Cuplikan progres" lead="Kelas yang perlu tindak lanjut dari tutor.">
          <ProgressBars
            items={[
              { label: 'Kelas 10 Sains', value: 92, tone: 'success' },
              { label: 'Kelas 11 Sosial', value: 74, tone: 'warning' },
              { label: 'Kelas 12 Bahasa', value: 61, tone: 'danger' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function MaterialPanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Detail modul</p>
          <h2 className="sectionTitle">Detail Materi Pembelajaran</h2>
          <p className="sectionLead">
            Detail modul dibuat sebagai halaman informasi yang memandu tutor dan siswa dalam satu tempat.
          </p>
        </div>
        <div className="heroActions">
          <Badge tone="success">Diterbitkan</Badge>
          <Badge tone="info">Versi 2.4</Badge>
        </div>
      </div>

      <div className="twoColLayout">
        <SectionCard title="Kerangka pelajaran" lead="Susunan isi untuk memudahkan navigasi materi.">
          <Timeline
            items={[
              { title: 'Pengantar', meta: 'Konsep inti dan tujuan pembelajaran.', time: '05 menit', tone: 'info' },
              { title: 'Contoh terarah', meta: 'Contoh soal dengan langkah penyelesaian.', time: '20 menit', tone: 'warning' },
              { title: 'Latihan mandiri', meta: 'Latihan mandiri untuk siswa.', time: '25 menit', tone: 'success' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Paket sumber daya" lead="File pendukung yang dapat diunduh oleh kelas.">
          <CardGrid
            columns={2}
            items={[
              { badge: 'PDF', title: 'Catatan pelajaran', meta: 'Ringkasan inti pembelajaran.', tone: 'info' },
              { badge: 'DOC', title: 'Panduan tutor', meta: 'Pedoman fasilitasi tutor.', tone: 'success' },
              { badge: 'ZIP', title: 'Bundel latihan', meta: 'Kumpulan latihan dan kunci jawaban.', tone: 'warning' },
              { badge: 'LINK', title: 'Video referensi', meta: 'Tautan belajar tambahan.', tone: 'info' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function CrmPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Prospek baru" value="48" note="Prospek baru minggu ini" tone="info" />
        <MetricCard label="Pemesanan uji coba" value="19" note="Jadwal uji coba yang sudah terkonfirmasi" tone="success" />
        <MetricCard label="Tingkat konversi" value="31%" note="Prospek yang berubah menjadi pendaftaran" tone="warning" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Alur prospek" lead="Pergerakan prospek dari pertanyaan awal hingga pendaftaran.">
          <CardGrid
            columns={4}
            items={[
              { badge: 'Prospek', title: '12', meta: 'Pertanyaan baru', tone: 'info' },
              { badge: 'Dihubungi', title: '15', meta: 'Tindak lanjut berjalan', tone: 'warning' },
              { badge: 'Uji coba', title: '11', meta: 'Pemesanan uji coba terkonfirmasi', tone: 'success' },
              { badge: 'Terdaftar', title: '10', meta: 'Pendaftaran selesai', tone: 'info' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Antrian tindak lanjut" lead="Prospek yang harus ditindaklanjuti hari ini.">
          <SimpleList
            items={[
              { title: 'Rani Putri', meta: 'Permintaan orang tua via formulir web', tone: 'warning' as const, extra: 'Telepon' },
              { title: 'Fahmi Akbar', meta: 'Pemesanan uji coba menunggu konfirmasi', tone: 'info' as const, extra: 'WhatsApp' },
              { title: 'Maya Lestari', meta: 'Menanyakan informasi beasiswa', tone: 'success' as const, extra: 'Email' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function ProgressPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Rata-rata progres" value="78%" note="Rata-rata progres semua kelas aktif" tone="success" />
        <MetricCard label="Perlu intervensi" value="9" note="Siswa yang butuh intervensi tutor" tone="warning" />
        <MetricCard label="Kohort teratas" value="Kelas 12" note="Kohort dengan performa paling stabil" tone="info" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Peringkat kohort" lead="Peringkat performa belajar per kelas.">
          <ProgressBars
            items={[
              { label: 'Kelas 12 Bahasa', value: 94, tone: 'success' },
              { label: 'Kelas 10 Sains', value: 82, tone: 'info' },
              { label: 'Kelas 11 Sosial', value: 68, tone: 'warning' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Wawasan" lead="Area yang perlu perhatian berdasarkan progres.">
          <Timeline
            items={[
              { title: 'Kecepatan membaca', meta: 'Masih lambat pada kelas 11 Sosial.', time: 'Wawasan 1', tone: 'warning' },
              { title: 'Penyelesaian tugas', meta: 'Stabil pada kelas 10 Sains.', time: 'Wawasan 2', tone: 'success' },
              { title: 'Kesiapan ujian', meta: 'Perlu tambahan simulasi pada kelas 12.', time: 'Wawasan 3', tone: 'info' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function HelpdeskPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Tiket terbuka" value="17" note="Tiket yang belum ditutup" tone="danger" />
        <MetricCard label="SLA at risk" value="4" note="Kasus mendekati batas penyelesaian" tone="warning" />
        <MetricCard label="Selesai hari ini" value="23" note="Tiket yang sudah selesai hari ini" tone="success" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Papan tiket" lead="Distribusi tiket berdasarkan status layanan.">
          <CardGrid
            columns={3}
            items={[
              { badge: 'Terbuka', title: '8', meta: 'Menunggu assignment', tone: 'danger' },
              { badge: 'Proses', title: '6', meta: 'Sedang ditangani agen', tone: 'warning' },
              { badge: 'Selesai', title: '23', meta: 'Ditutup dalam SLA', tone: 'success' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Daftar pantau SLA" lead="Tiket yang perlu dipantau lebih dekat.">
          <SimpleList
            items={[
              { title: 'Pertanyaan invoice', meta: 'Sisa 2 jam sebelum SLA lewat.', tone: 'warning' as const, extra: 'Prioritas' },
              { title: 'Akses masuk', meta: 'Menunggu konfirmasi cabang.', tone: 'info' as const, extra: 'Normal' },
              { title: 'Pengiriman WhatsApp', meta: 'Perlu investigasi pada pengiriman gagal.', tone: 'danger' as const, extra: 'Tinggi' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function TicketPanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Detail tiket</p>
          <h2 className="sectionTitle">Detail Tiket Helpdesk</h2>
          <p className="sectionLead">Riwayat percakapan, status penanganan, dan metadata tiket ditampilkan dalam satu layar.</p>
        </div>
        <div className="heroActions">
          <Badge tone="warning">Sedang diproses</Badge>
          <Badge tone="info">#TKT-2048</Badge>
        </div>
      </div>

      <div className="twoColLayout">
        <SectionCard title="Linimasa percakapan" lead="Percakapan antara agen dan pelanggan.">
          <Timeline
            items={[
              { title: 'Pesan pelanggan', meta: 'Tidak bisa mengakses portal kelas.', time: '09:12', tone: 'info' },
              { title: 'Respons agen', meta: 'Meminta cabang dan ID siswa.', time: '09:18', tone: 'warning' },
              { title: 'Balasan pelanggan', meta: 'Mengirim detail verifikasi dan screenshot.', time: '09:25', tone: 'success' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Metadata tiket" lead="Informasi operasional untuk penanganan cepat.">
          <SimpleList
            items={[
              { title: 'Kategori', meta: 'Akses dan autentikasi', tone: 'info' as const, extra: 'Dukungan' },
              { title: 'Penanggung jawab', meta: 'Dewi - Senior Agent', tone: 'success' as const, extra: 'Ditugaskan' },
              { title: 'Prioritas', meta: 'Tinggi karena kelas segera dimulai', tone: 'danger' as const, extra: 'Tinggi' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function ChatPanel() {
  const messages: ChatMessage[] = [
    {
      author: 'Mira',
      role: 'customer',
      time: '09:12',
      body: 'Halo, saya tidak bisa masuk ke portal kelas.'
    },
    {
      author: 'Ayu',
      role: 'agent',
      time: '09:13',
      body: 'Baik, saya cek dulu data cabang dan akun siswa Anda.'
    },
    {
      author: 'Mira',
      role: 'customer',
      time: '09:15',
      body: 'Saya sudah kirim nomor student ID dan screenshot error.'
    }
  ];

  return (
    <section className="screenPanel">
      <div className="twoColLayout chatLayout">
        <SectionCard title="Percakapan realtime" lead="Percakapan aktif dengan pelanggan atau orang tua.">
          <div className="chatThread">
            {messages.map((message) => (
              <article key={`${message.author}-${message.time}`} className={`chatBubble chatBubble${message.role === 'agent' ? 'Agent' : 'Customer'}`}>
                <div className="chatBubbleMeta">
                  <strong>{message.author}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.body}</p>
              </article>
            ))}
          </div>

          <div className="composer">
            <span>Tulis balasan...</span>
            <Badge tone="info">Terjemahan otomatis aktif</Badge>
          </div>
        </SectionCard>

        <SectionCard title="Panel kehadiran" lead="Tim yang sedang daring dan siap menanggapi.">
          <SimpleList
            items={[
              { title: 'Ayu Santika', meta: 'Agen senior · daring', tone: 'success' as const, extra: '2 chat' },
              { title: 'Rizky Pratama', meta: 'Agen dukungan · tidak aktif', tone: 'warning' as const, extra: '1 chat' },
              { title: 'Nadia Putri', meta: 'Supervisor · daring', tone: 'info' as const, extra: 'Tinjau' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function NotificationComposePanel() {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Penyusun notifikasi</p>
          <h2 className="sectionTitle">Buat Notifikasi Baru</h2>
          <p className="sectionLead">Menyusun pesan, memilih audiens, dan menyiapkan jadwal kirim tanpa mengorbankan keterbacaan.</p>
        </div>
        <div className="heroActions">
          <Badge tone="success">Draft tersimpan</Badge>
          <Badge tone="info">WhatsApp + Email</Badge>
        </div>
      </div>

      <div className="twoColLayout">
        <SectionCard title="Formulir penyusun" lead="Komponen input yang siap untuk kebutuhan produksi.">
          <CardGrid
            columns={2}
            items={[
              { badge: 'Audiens', title: 'Cabang: Jakarta Selatan', meta: 'Difilter berdasarkan enrollment aktif', tone: 'info' },
              { badge: 'Saluran', title: 'WhatsApp', meta: 'Fallback ke email jika dibutuhkan', tone: 'success' },
              { badge: 'Jadwal', title: 'Hari ini 14:00', meta: 'Masuk antrean pengiriman batch', tone: 'warning' },
              { badge: 'Prioritas', title: 'Tinggi', meta: 'Notifikasi perlu dikirim cepat', tone: 'danger' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Pratinjau pesan" lead="Pratinjau teks yang akan diterima penerima.">
          <Timeline
            items={[
              { title: 'Header', meta: 'Pengingat pembayaran bulan ini', time: 'Baris 1', tone: 'info' },
              { title: 'Isi pesan', meta: 'Invoice Anda telah jatuh tempo dan perlu tindak lanjut.', time: 'Baris 2', tone: 'warning' },
              { title: 'Footer', meta: 'Hubungi tim dukungan jika butuh bantuan.', time: 'Baris 3', tone: 'success' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function TemplatePanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Template" value="14" note="Template aktif di seluruh saluran" tone="info" />
        <MetricCard label="Disetujui" value="11" note="Template yang sudah lolos peninjauan" tone="success" />
        <MetricCard label="Perlu update" value="3" note="Versi lama yang perlu diperbarui" tone="warning" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Galeri template" lead="Pilihan template yang dapat dipakai ulang.">
          <CardGrid
            columns={2}
            items={[
              { badge: 'Keuangan', title: 'Pengingat pembayaran', meta: 'Nada hangat dengan CTA pembayaran', tone: 'danger' },
              { badge: 'Akademik', title: 'Pengumuman kelas', meta: 'Informatif dan ringkas', tone: 'info' },
              { badge: 'Dukungan', title: 'Pembaruan tiket', meta: 'Pembaruan status dengan detail SLA', tone: 'success' },
              { badge: 'Promosi', title: 'Undangan uji coba', meta: 'Singkat dan fokus konversi', tone: 'warning' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Template terpilih" lead="Rincian untuk peninjauan dan versi.">
          <SimpleList
            items={[
              { title: 'Nama template', meta: 'Pengingat pembayaran v2', tone: 'info' as const, extra: 'Aktif' },
              { title: 'Bahasa', meta: 'Bahasa Indonesia', tone: 'success' as const, extra: 'Terlokalisasi' },
              { title: 'Pembaruan terakhir', meta: '2 hari lalu oleh Admin', tone: 'warning' as const, extra: 'Baru' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function BroadcastPanel() {
  const campaigns = [
    {
      key: 'Campaign 1',
      cells: [<span key="a">Kampanye 1</span>, <span key="b">1.204 penerima</span>, <Badge key="c" tone="success">Terkirim</Badge>, <span key="d">98%</span>]
    },
    {
      key: 'Campaign 2',
      cells: [<span key="a">Kampanye 2</span>, <span key="b">842 penerima</span>, <Badge key="c" tone="warning">Diproses</Badge>, <span key="d">71%</span>]
    },
    {
      key: 'Campaign 3',
      cells: [<span key="a">Kampanye 3</span>, <span key="b">412 penerima</span>, <Badge key="c" tone="danger">Gagal</Badge>, <span key="d">0%</span>]
    }
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Terkirim hari ini" value="2.458" note="Notifikasi yang berhasil dikirim" tone="success" />
        <MetricCard label="Gagal kirim" value="12" note="Perlu coba ulang dan investigasi" tone="danger" />
        <MetricCard label="Tingkat buka" value="87%" note="Perkiraan keterbacaan broadcast" tone="info" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Dasbor kampanye" lead="Pantau status distribusi notifikasi massal.">
          <DataTable
            columns={[
              { label: 'Kampanye' },
              { label: 'Audiens' },
              { label: 'Status' },
              { label: 'Tingkat buka', align: 'right' }
            ]}
            rows={campaigns}
          />
        </SectionCard>

        <SectionCard title="Wawasan pengiriman" lead="Ringkasan performa saluran dan coba ulang.">
          <ProgressBars
            items={[
              { label: 'WhatsApp', value: 92, tone: 'success' },
              { label: 'Email', value: 81, tone: 'info' },
              { label: 'Push', value: 64, tone: 'warning' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

function WhatsAppPanel() {
  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Koneksi" value="Online" note="Gateway aktif dan siap mengirim" tone="success" />
        <MetricCard label="Kuota tersisa" value="1.840" note="Sisa pesan yang dapat dikirim" tone="info" />
        <MetricCard label="Kesehatan webhook" value="Stabil" note="Panggilan masuk tervalidasi" tone="warning" />
      </div>

      <div className="twoColLayout">
        <SectionCard title="Pengaturan gateway" lead="Parameter inti untuk integrasi WhatsApp.">
          <CardGrid
            columns={2}
            items={[
              { badge: 'Kunci API', title: 'Disimpan aman', meta: 'Hanya tampil sebagai status.', tone: 'success' },
              { badge: 'Pengirim', title: 'Dukungan Bimbel One', meta: 'Nama pengirim utama.', tone: 'info' },
              { badge: 'Webhook', title: 'Endpoint terverifikasi', meta: 'Sinkronisasi peristiwa pengiriman.', tone: 'warning' },
              { badge: 'Pembatas laju', title: 'Dilindungi', meta: 'Menghindari throttle dari penyedia.', tone: 'danger' }
            ]}
          />
        </SectionCard>

        <SectionCard title="Profil pengirim" lead="Identitas pengirim yang terlihat oleh penerima.">
          <SimpleList
            items={[
              { title: 'Nama tampil', meta: 'Dukungan Bimbel One', tone: 'info' as const, extra: 'Utama' },
              { title: 'Nomor telepon', meta: '+62 812-3456-7890', tone: 'success' as const, extra: 'Terverifikasi' },
              { title: 'Email cadangan', meta: 'support@bimbel.one', tone: 'warning' as const, extra: 'Cadangan' }
            ]}
          />
        </SectionCard>
      </div>
    </section>
  );
}

export function ScreenPanel({ screen }: { screen: ScreenSummary }) {
  switch (screen.kind) {
    case 'dashboard':
      return <DashboardPanel />;
    case 'finance':
      return <FinancePanel />;
    case 'schedule':
      return <SchedulePanel />;
    case 'payroll':
      return <PayrollPanel />;
    case 'attendance':
      return <AttendancePanel />;
    case 'lms':
      return <LmsPanel />;
    case 'material':
      return <MaterialPanel />;
    case 'crm':
      return <CrmPanel />;
    case 'progress':
      return <ProgressPanel />;
    case 'helpdesk':
      return <HelpdeskPanel />;
    case 'ticket':
      return <TicketPanel />;
    case 'chat':
      return <ChatPanel />;
    case 'notification-compose':
      return <NotificationComposePanel />;
    case 'notification-template':
      return <TemplatePanel />;
    case 'broadcast':
      return <BroadcastPanel />;
    case 'whatsapp':
      return <WhatsAppPanel />;
    default:
      return null;
  }
}
