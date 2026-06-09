import { randomUUID } from 'node:crypto';

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentName: string;
  amount: number;
  status: 'pending' | 'partial' | 'paid';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassEntry {
  id: string;
  subject: string;
  className: string;
  day: string;
  time: string;
  room: string;
  tutor: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayBatch {
  id: string;
  batchName: string;
  personCount: number;
  amount: number;
  status: 'draft' | 'ready' | 'pending_approval';
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  time: string;
  status: 'present' | 'late' | 'absent';
  method: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  grade: string;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  subject: string;
  type: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Prospect {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: 'prospect' | 'contacted' | 'trial' | 'registered';
  tier: 'high' | 'medium' | 'low';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressRecord {
  id: string;
  studentName: string;
  subject: string;
  score: number;
  grade: string;
  createdAt: string;
  updatedAt: string;
}

function now() { return new Date().toISOString(); }
function newId(prefix: string) { return `${prefix}-${randomUUID().slice(0, 8)}`; }

function seededInvoices(): Invoice[] {
  return [
    { id: 'inv-001', invoiceNo: '#INV-2023-089', studentName: 'Budi Santoso', amount: 2500000, status: 'pending', dueDate: '2026-06-15', createdAt: now(), updatedAt: now() },
    { id: 'inv-002', invoiceNo: '#INV-2023-090', studentName: 'Siti Aminah', amount: 1800000, status: 'partial', dueDate: '2026-06-20', createdAt: now(), updatedAt: now() },
    { id: 'inv-003', invoiceNo: '#INV-2023-091', studentName: 'Agus Pratama', amount: 2200000, status: 'paid', dueDate: '2026-06-10', createdAt: now(), updatedAt: now() },
  ];
}

function seededClasses(): ClassEntry[] {
  return [
    { id: 'cls-001', subject: 'Matematika', className: 'Kelas 10', day: 'Senin', time: '14:00', room: 'Ruang A', tutor: 'Pak Budi', createdAt: now(), updatedAt: now() },
    { id: 'cls-002', subject: 'Fisika', className: 'Kelas 12', day: 'Senin', time: '14:00', room: 'Ruang B', tutor: 'Bu Siti', createdAt: now(), updatedAt: now() },
    { id: 'cls-003', subject: 'Biologi', className: 'Kelas 11', day: 'Kamis', time: '14:00', room: 'Lab 1', tutor: 'Pak Yanto', createdAt: now(), updatedAt: now() },
    { id: 'cls-004', subject: 'Kimia', className: 'Kelas 12', day: 'Selasa', time: '16:00', room: 'Lab 1', tutor: 'Bu Dewi', createdAt: now(), updatedAt: now() },
    { id: 'cls-005', subject: 'Matematika', className: 'Kelas 9', day: 'Rabu', time: '16:00', room: 'Ruang D', tutor: 'Pak Budi', createdAt: now(), updatedAt: now() },
    { id: 'cls-006', subject: 'Bahasa Inggris', className: 'Kelas 10', day: 'Jumat', time: '16:00', room: 'Ruang A', tutor: 'Bu Jane', createdAt: now(), updatedAt: now() },
  ];
}

function seededBatches(): PayBatch[] {
  return [
    { id: 'pay-001', batchName: 'Batch A', personCount: 18, amount: 42000000, status: 'pending_approval', createdAt: now(), updatedAt: now() },
    { id: 'pay-002', batchName: 'Batch B', personCount: 6, amount: 13200000, status: 'ready', createdAt: now(), updatedAt: now() },
    { id: 'pay-003', batchName: 'Batch C', personCount: 4, amount: 8400000, status: 'draft', createdAt: now(), updatedAt: now() },
  ];
}

function seededAttendance(): AttendanceRecord[] {
  return [
    { id: 'att-001', studentName: 'Ahmad Reza', time: '08:02', status: 'present', method: 'QR + GPS', date: '2026-06-08', createdAt: now(), updatedAt: now() },
    { id: 'att-002', studentName: 'Siti Aminah', time: '08:10', status: 'late', method: 'QR saja', date: '2026-06-08', createdAt: now(), updatedAt: now() },
    { id: 'att-003', studentName: 'Budi Santoso', time: '--', status: 'absent', method: 'Tanpa check-in', date: '2026-06-08', createdAt: now(), updatedAt: now() },
  ];
}

function seededCourses(): Course[] {
  return [
    { id: 'crs-001', title: 'Dasar aljabar', subject: 'Matematika', grade: 'Kelas 10', lessonCount: 12, createdAt: now(), updatedAt: now() },
    { id: 'crs-002', title: 'Dasar kimia', subject: 'Sains', grade: 'Kelas 11', lessonCount: 8, createdAt: now(), updatedAt: now() },
    { id: 'crs-003', title: 'Klinik esai', subject: 'Bahasa', grade: 'Kelas 12', lessonCount: 6, createdAt: now(), updatedAt: now() },
    { id: 'crs-004', title: 'Paket tryout', subject: 'Persiapan ujian', grade: 'Kelas 12', lessonCount: 10, createdAt: now(), updatedAt: now() },
  ];
}

function seededModules(): Module[] {
  return [
    { id: 'mod-001', title: 'Catatan pelajaran', subject: 'Matematika', type: 'PDF', status: 'published', createdAt: now(), updatedAt: now() },
    { id: 'mod-002', title: 'Panduan tutor', subject: 'Fisika', type: 'DOC', status: 'published', createdAt: now(), updatedAt: now() },
    { id: 'mod-003', title: 'Bundel latihan', subject: 'Kimia', type: 'ZIP', status: 'draft', createdAt: now(), updatedAt: now() },
    { id: 'mod-004', title: 'Video referensi', subject: 'Bahasa Inggris', type: 'LINK', status: 'published', createdAt: now(), updatedAt: now() },
  ];
}

function seededProspects(): Prospect[] {
  return [
    { id: 'prs-001', name: 'Rani Putri', phone: '+62 811 2222 111', source: 'Formulir Web', status: 'contacted', tier: 'high', notes: 'Permintaan orang tua via formulir web', createdAt: now(), updatedAt: now() },
    { id: 'prs-002', name: 'Fahmi Akbar', phone: '+62 812 3333 222', source: 'Referral', status: 'trial', tier: 'medium', notes: 'Pemesanan uji coba menunggu konfirmasi', createdAt: now(), updatedAt: now() },
    { id: 'prs-003', name: 'Maya Lestari', phone: '+62 813 4444 333', source: 'Instagram', status: 'prospect', tier: 'low', notes: 'Menanyakan informasi beasiswa', createdAt: now(), updatedAt: now() },
    { id: 'prs-004', name: 'Budi Santoso', phone: '+62 814 5555 444', source: 'Email Campaign', status: 'registered', tier: 'high', notes: 'Pendaftaran selesai', createdAt: now(), updatedAt: now() },
  ];
}

function seededProgress(): ProgressRecord[] {
  return [
    { id: 'prg-001', studentName: 'Ahmad Reza', subject: 'Matematika', score: 92, grade: 'Kelas 12 Bahasa', createdAt: now(), updatedAt: now() },
    { id: 'prg-002', studentName: 'Siti Aminah', subject: 'Fisika', score: 78, grade: 'Kelas 10 Sains', createdAt: now(), updatedAt: now() },
    { id: 'prg-003', studentName: 'Budi Santoso', subject: 'Kimia', score: 65, grade: 'Kelas 11 Sosial', createdAt: now(), updatedAt: now() },
  ];
}

// Generic in-memory store factory
function createStore<T extends { id: string }>(seed: T[]) {
  let data: T[] | null = null;
  function get(): T[] {
    if (!data) data = seed.map(r => ({ ...r }));
    return data;
  }
  return {
    list: (): T[] => get().map(r => ({ ...r })),
    get: (id: string): T | undefined => { const f = get().find(r => r.id === id); return f ? { ...f } : undefined; },
    create: (input: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, prefix: string): T => {
      const store = get();
      const item = { ...input, id: newId(prefix), createdAt: now(), updatedAt: now() } as unknown as T;
      store.push(item);
      return { ...item };
    },
    update: (id: string, input: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): T | undefined => {
      const store = get();
      const idx = store.findIndex(r => r.id === id);
      if (idx === -1) return undefined;
      const updated = { ...store[idx], ...input, updatedAt: now() };
      store[idx] = updated;
      return { ...updated };
    },
    remove: (id: string): boolean => {
      const store = get();
      const idx = store.findIndex(r => r.id === id);
      if (idx === -1) return false;
      store.splice(idx, 1);
      return true;
    },
    reset: () => { data = null; },
  };
}

export const invoiceStore = createStore(seededInvoices());
export const classStore = createStore(seededClasses());
export const batchStore = createStore(seededBatches());
export const attendanceStore = createStore(seededAttendance());
export const courseStore = createStore(seededCourses());
export const moduleStore = createStore(seededModules());
export const prospectStore = createStore(seededProspects());
export const progressStore = createStore(seededProgress());
