import { hashPassword } from '@/server/password';
import { branchDirectory, type BranchDirectoryEntry } from '@/lib/branch-directory';

export type UserStatus = 'active' | 'locked';
export type RoleCode = 'super_admin' | 'branch_admin' | 'finance' | 'tutor' | 'parent' | 'support';
export type PermissionResource =
  | 'auth'
  | 'branches'
  | 'students'
  | 'attendance'
  | 'scheduling'
  | 'billing'
  | 'payroll'
  | 'notifications'
  | 'helpdesk'
  | 'inventory'
  | 'integrations'
  | 'audit';
export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'approve' | 'export' | 'manage';
export type PermissionKey = `${PermissionResource}:${PermissionAction}`;

export type BranchRecord = BranchDirectoryEntry;

export interface RoleRecord {
  code: RoleCode;
  name: string;
  permissions: PermissionKey[];
}

export interface UserRecord {
  id: string;
  branchId: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  status: UserStatus;
  roleCodes: RoleCode[];
  isMfaRequired: boolean;
}

export const branches: BranchRecord[] = branchDirectory;

export const roles: RoleRecord[] = [
  {
    code: 'super_admin',
    name: 'Super Admin',
    permissions: [
      'auth:manage',
      'branches:manage',
      'students:manage',
      'attendance:manage',
      'scheduling:manage',
      'billing:manage',
      'payroll:manage',
      'notifications:manage',
      'helpdesk:manage',
      'inventory:manage',
      'integrations:manage',
      'audit:read'
    ]
  },
  {
    code: 'branch_admin',
    name: 'Branch Admin',
    permissions: [
      'auth:read',
      'branches:read',
      'students:manage',
      'attendance:manage',
      'scheduling:manage',
      'billing:read',
      'payroll:read',
      'notifications:manage',
      'helpdesk:manage',
      'inventory:manage',
      'audit:read'
    ]
  },
  {
    code: 'finance',
    name: 'Finance',
    permissions: ['auth:read', 'branches:read', 'billing:manage', 'payroll:read', 'notifications:read', 'audit:read']
  },
  {
    code: 'tutor',
    name: 'Tutor',
    permissions: ['auth:read', 'branches:read', 'students:read', 'attendance:create', 'scheduling:read', 'notifications:read']
  },
  {
    code: 'parent',
    name: 'Parent',
    permissions: ['auth:read', 'branches:read', 'students:read', 'billing:read', 'notifications:read', 'helpdesk:create']
  },
  {
    code: 'support',
    name: 'Support',
    permissions: ['auth:read', 'branches:read', 'students:read', 'helpdesk:manage', 'notifications:manage', 'audit:read']
  }
];

export const users: UserRecord[] = [
  {
    id: 'user-admin',
    branchId: 'branch-pusat',
    fullName: 'Nadia Putri',
    email: 'admin@bimbel.one',
    phone: '+62 811 1111 111',
    passwordHash: hashPassword('Admin123!'),
    status: 'active',
    roleCodes: ['super_admin'],
    isMfaRequired: true
  },
  {
    id: 'user-finance',
    branchId: 'branch-pusat',
    fullName: 'Rizky Pratama',
    email: 'finance@bimbel.one',
    phone: '+62 812 2222 222',
    passwordHash: hashPassword('Finance123!'),
    status: 'active',
    roleCodes: ['finance'],
    isMfaRequired: true
  },
  {
    id: 'user-tutor',
    branchId: 'branch-bandung',
    fullName: 'Ayu Santika',
    email: 'ayu@bimbel.one',
    phone: '+62 813 3333 333',
    passwordHash: hashPassword('Tutor123!'),
    status: 'active',
    roleCodes: ['tutor'],
    isMfaRequired: false
  },
  {
    id: 'user-branch-admin',
    branchId: 'branch-jkt-selatan',
    fullName: 'Budi Wicaksono',
    email: 'budi@bimbel.one',
    phone: '+62 814 4444 444',
    passwordHash: hashPassword('Branch123!'),
    status: 'active',
    roleCodes: ['branch_admin'],
    isMfaRequired: true
  },
  {
    id: 'user-support',
    branchId: 'branch-surabaya',
    fullName: 'Siti Aminah',
    email: 'support@bimbel.one',
    phone: '+62 815 5555 555',
    passwordHash: hashPassword('Support123!'),
    status: 'active',
    roleCodes: ['support'],
    isMfaRequired: false
  }
];

export const permissionCatalog = Array.from(
  new Set(
    roles.flatMap((role) => role.permissions)
  )
).sort();
