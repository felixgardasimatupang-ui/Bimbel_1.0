export type BranchStatus = 'active' | 'inactive';

export interface BranchDirectoryEntry {
  id: string;
  code: string;
  name: string;
  timezone: string;
  status: BranchStatus;
  address: string;
  phone: string;
  email: string;
}

export const branchDirectory: BranchDirectoryEntry[] = [
  {
    id: 'branch-jkt-selatan',
    code: 'JKT-SLT',
    name: 'Bimbel One Jakarta Selatan',
    timezone: 'Asia/Jakarta',
    status: 'active',
    address: 'Jl. Melati No. 12, Jakarta Selatan',
    phone: '+62 21 555 0101',
    email: 'jkt-selatan@bimbel.one'
  },
  {
    id: 'branch-bandung',
    code: 'BDG-01',
    name: 'Bimbel One Bandung',
    timezone: 'Asia/Jakarta',
    status: 'active',
    address: 'Jl. Dago No. 8, Bandung',
    phone: '+62 22 555 0202',
    email: 'bandung@bimbel.one'
  },
  {
    id: 'branch-surabaya',
    code: 'SBY-01',
    name: 'Bimbel One Surabaya',
    timezone: 'Asia/Jakarta',
    status: 'active',
    address: 'Jl. Darmo No. 23, Surabaya',
    phone: '+62 31 555 0303',
    email: 'surabaya@bimbel.one'
  },
  {
    id: 'branch-pusat',
    code: 'HQ-01',
    name: 'Bimbel One Head Office',
    timezone: 'Asia/Jakarta',
    status: 'active',
    address: 'Gedung Pusat Operasional, Jakarta',
    phone: '+62 21 555 0001',
    email: 'ops@bimbel.one'
  }
];
