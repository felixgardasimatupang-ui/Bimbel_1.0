export type ScreenKind =
  | 'dashboard'
  | 'finance'
  | 'schedule'
  | 'payroll'
  | 'attendance'
  | 'lms'
  | 'material'
  | 'crm'
  | 'progress'
  | 'helpdesk'
  | 'ticket'
  | 'chat'
  | 'notification-compose'
  | 'notification-template'
  | 'broadcast'
  | 'whatsapp';

export type ScreenSummary = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  kind: ScreenKind;
};

export const screens: ScreenSummary[] = [
  {
    slug: '01_penagihan_dan_keuangan',
    index: '01',
    title: 'Penagihan & Keuangan',
    subtitle: 'Kontrol invoice, pembayaran, dan posisi piutang secara ringkas.',
    category: 'Monetization',
    kind: 'finance'
  },
  {
    slug: '02_jadwal_akademik',
    index: '02',
    title: 'Jadwal Akademik',
    subtitle: 'Ruang, tutor, dan slot waktu dalam tampilan kalender yang rapi.',
    category: 'Academic Delivery',
    kind: 'schedule'
  },
  {
    slug: '03_manajemen_penggajian_payroll',
    index: '03',
    title: 'Manajemen Penggajian',
    subtitle: 'Ringkasan jam mengajar, approval, dan status pembayaran payroll.',
    category: 'Operations',
    kind: 'payroll'
  },
  {
    slug: '04_sistem_absensi',
    index: '04',
    title: 'Sistem Absensi',
    subtitle: 'Status kehadiran siswa dan staf dengan validasi yang jelas.',
    category: 'Operations',
    kind: 'attendance'
  },
  {
    slug: '05_lms_dan_materi_pembelajaran',
    index: '05',
    title: 'LMS & Materi Pembelajaran',
    subtitle: 'Daftar materi, progres kelas, dan akses belajar yang terstruktur.',
    category: 'Academic Delivery',
    kind: 'lms'
  },
  {
    slug: '06_detail_materi_pembelajaran',
    index: '06',
    title: 'Detail Materi Pembelajaran',
    subtitle: 'Detail modul, outline pembelajaran, dan sumber belajar pendukung.',
    category: 'Academic Delivery',
    kind: 'material'
  },
  {
    slug: '07_manajemen_siswa_crm',
    index: '07',
    title: 'Manajemen Siswa CRM',
    subtitle: 'Pipeline prospek, profiling siswa, dan tindak lanjut admissions.',
    category: 'Core Operations',
    kind: 'crm'
  },
  {
    slug: '08_laporan_progres_belajar_lms',
    index: '08',
    title: 'Laporan Progres Belajar',
    subtitle: 'Pemetaan progres, performa, dan area yang perlu intervensi.',
    category: 'Academic Delivery',
    kind: 'progress'
  },
  {
    slug: '09_dashboard_helpdesk_ticketing',
    index: '09',
    title: 'Dashboard Helpdesk',
    subtitle: 'Pantau SLA, antrian tiket, dan status penyelesaian layanan.',
    category: 'Support',
    kind: 'helpdesk'
  },
  {
    slug: '10_detail_tiket_helpdesk',
    index: '10',
    title: 'Detail Tiket Helpdesk',
    subtitle: 'Riwayat percakapan, metadata tiket, dan tindakan penanganan.',
    category: 'Support',
    kind: 'ticket'
  },
  {
    slug: '11_chat_realtime_helpdesk',
    index: '11',
    title: 'Chat Realtime Helpdesk',
    subtitle: 'Percakapan langsung dengan peserta didik atau orang tua.',
    category: 'Support',
    kind: 'chat'
  },
  {
    slug: '12_buat_notifikasi_baru',
    index: '12',
    title: 'Buat Notifikasi Baru',
    subtitle: 'Komposisi pesan, segmentasi penerima, dan jadwal pengiriman.',
    category: 'Automation',
    kind: 'notification-compose'
  },
  {
    slug: '13_template_notifikasi',
    index: '13',
    title: 'Template Notifikasi',
    subtitle: 'Koleksi template yang dapat dipakai ulang dan dikelola versioned.',
    category: 'Automation',
    kind: 'notification-template'
  },
  {
    slug: '14_dashboard_notifikasi_massal',
    index: '14',
    title: 'Dashboard Notifikasi Massal',
    subtitle: 'Status kampanye notifikasi, delivery, dan insight pengiriman.',
    category: 'Automation',
    kind: 'broadcast'
  },
  {
    slug: '15_detail_pengaturan_whatsapp',
    index: '15',
    title: 'Detail Pengaturan WhatsApp',
    subtitle: 'Konfigurasi gateway, koneksi perangkat, dan profil pengirim.',
    category: 'Automation',
    kind: 'whatsapp'
  },
  {
    slug: '16_dashboard_utama',
    index: '16',
    title: 'Dashboard Utama',
    subtitle: 'Ringkasan operasional lintas cabang untuk keputusan harian.',
    category: 'Foundation',
    kind: 'dashboard'
  }
];

export const screenMap = new Map(screens.map((screen) => [screen.slug, screen]));

export const defaultScreenSlug = '16_dashboard_utama';
