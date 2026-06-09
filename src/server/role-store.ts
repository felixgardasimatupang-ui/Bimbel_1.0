import { randomUUID } from 'node:crypto';

export type PermissionKey =
  | 'auth:manage' | 'auth:read'
  | 'branches:manage' | 'branches:read'
  | 'students:manage' | 'students:read'
  | 'attendance:manage' | 'attendance:create' | 'attendance:read'
  | 'scheduling:manage' | 'scheduling:read'
  | 'billing:manage' | 'billing:read'
  | 'payroll:manage' | 'payroll:read'
  | 'notifications:manage' | 'notifications:read'
  | 'helpdesk:manage' | 'helpdesk:create' | 'helpdesk:read'
  | 'inventory:manage' | 'inventory:read'
  | 'integrations:manage'
  | 'audit:read'
  | 'roles:manage' | 'roles:read';

export interface ManagedRole {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const ALL_PERMISSIONS: { key: PermissionKey; label: string }[] = [
  { key: 'auth:manage', label: 'Kelola autentikasi & pengguna' },
  { key: 'auth:read', label: 'Lihat data autentikasi' },
  { key: 'branches:manage', label: 'Kelola cabang' },
  { key: 'branches:read', label: 'Lihat cabang' },
  { key: 'students:manage', label: 'Kelola data siswa' },
  { key: 'students:read', label: 'Lihat data siswa' },
  { key: 'attendance:manage', label: 'Kelola absensi' },
  { key: 'attendance:create', label: 'Isi absensi' },
  { key: 'attendance:read', label: 'Lihat absensi' },
  { key: 'scheduling:manage', label: 'Kelola jadwal' },
  { key: 'scheduling:read', label: 'Lihat jadwal' },
  { key: 'billing:manage', label: 'Kelola tagihan & pembayaran' },
  { key: 'billing:read', label: 'Lihat tagihan' },
  { key: 'payroll:manage', label: 'Kelola penggajian' },
  { key: 'payroll:read', label: 'Lihat penggajian' },
  { key: 'notifications:manage', label: 'Kelola notifikasi' },
  { key: 'notifications:read', label: 'Lihat notifikasi' },
  { key: 'helpdesk:manage', label: 'Kelola tiket helpdesk' },
  { key: 'helpdesk:create', label: 'Buat tiket helpdesk' },
  { key: 'helpdesk:read', label: 'Lihat tiket helpdesk' },
  { key: 'inventory:manage', label: 'Kelola inventaris' },
  { key: 'inventory:read', label: 'Lihat inventaris' },
  { key: 'integrations:manage', label: 'Kelola integrasi' },
  { key: 'audit:read', label: 'Lihat log audit' },
  { key: 'roles:manage', label: 'Kelola role & hak akses' },
  { key: 'roles:read', label: 'Lihat role & hak akses' },
];

const SEED_ROLES: ManagedRole[] = [
  {
    id: 'role-admin',
    code: 'admin',
    name: 'Admin',
    description: 'Akses penuh ke seluruh fitur platform. Dapat mengelola pengguna, cabang, keuangan, dan pengaturan sistem.',
    permissions: [
      'auth:manage', 'branches:manage', 'students:manage', 'attendance:manage',
      'scheduling:manage', 'billing:manage', 'payroll:manage', 'notifications:manage',
      'helpdesk:manage', 'inventory:manage', 'integrations:manage', 'audit:read',
      'roles:manage'
    ],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'role-manager',
    code: 'manager',
    name: 'Manager',
    description: 'Mengelola operasional cabang: siswa, jadwal, absensi, tagihan, dan staf.',
    permissions: [
      'auth:read', 'branches:read', 'students:manage', 'attendance:manage',
      'scheduling:manage', 'billing:read', 'payroll:read', 'notifications:manage',
      'helpdesk:manage', 'inventory:manage', 'audit:read', 'roles:read'
    ],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'role-tentor',
    code: 'tentor',
    name: 'Tentor',
    description: 'Akses terbatas untuk pengajaran: absensi, jadwal, materi ajar, dan laporan progres siswa.',
    permissions: [
      'auth:read', 'branches:read', 'students:read', 'attendance:create',
      'scheduling:read', 'notifications:read', 'helpdesk:create'
    ],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
];

let _roles: ManagedRole[] | null = null;

function getStore(): ManagedRole[] {
  if (!_roles) {
    _roles = SEED_ROLES.map((r) => ({ ...r }));
  }
  return _roles;
}

export function resetStore(): void {
  _roles = null;
}

export function listRoles(): ManagedRole[] {
  return getStore().map((r) => ({ ...r }));
}

export function getRole(id: string): ManagedRole | undefined {
  const found = getStore().find((r) => r.id === id);
  return found ? { ...found } : undefined;
}

export function createRole(input: {
  code: string;
  name: string;
  description: string;
  permissions: string[];
}): ManagedRole {
  const store = getStore();
  const now = new Date().toISOString();
  const role: ManagedRole = {
    id: `role-${randomUUID().slice(0, 8)}`,
    code: input.code,
    name: input.name,
    description: input.description,
    permissions: [...input.permissions],
    createdAt: now,
    updatedAt: now,
  };
  store.push(role);
  return { ...role };
}

export function updateRole(id: string, input: {
  code?: string;
  name?: string;
  description?: string;
  permissions?: string[];
}): ManagedRole | undefined {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const now = new Date().toISOString();
  const existing = store[idx];
  const updated: ManagedRole = {
    ...existing,
    code: input.code ?? existing.code,
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    permissions: input.permissions ? [...input.permissions] : existing.permissions,
    updatedAt: now,
  };
  store[idx] = updated;
  return { ...updated };
}

export function deleteRole(id: string): boolean {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export { ALL_PERMISSIONS };
export type { ManagedRole as ManagedRoleType };