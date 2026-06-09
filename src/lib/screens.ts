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
  | 'chat'
  | 'role-management';

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
    slug: '09_chat_realtime_helpdesk',
    index: '09',
    title: 'Chat Realtime Helpdesk',
    subtitle: 'Percakapan langsung dengan peserta didik atau orang tua.',
    category: 'Support',
    kind: 'chat'
  },
  {
    slug: '10_dashboard_utama',
    index: '10',
    title: 'Dashboard Utama',
    subtitle: 'Ringkasan operasional lintas cabang untuk keputusan harian.',
    category: 'Foundation',
    kind: 'dashboard'
  },
  {
    slug: '11_manajemen_role',
    index: '11',
    title: 'Manajemen Role',
    subtitle: 'Kelola role pengguna, hak akses, dan batasan wewenang.',
    category: 'Foundation',
    kind: 'role-management'
  }
];

export const screenMap = new Map(screens.map((screen) => [screen.slug, screen]));

export const defaultScreenSlug = '10_dashboard_utama';
