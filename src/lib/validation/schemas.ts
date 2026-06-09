import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string({ message: 'Identitas wajib diisi.' })
    .min(1, 'Identitas wajib diisi.')
    .max(255, 'Identitas terlalu panjang.'),
  password: z
    .string({ message: 'Kata sandi wajib diisi.' })
    .min(1, 'Kata sandi wajib diisi.')
    .max(128, 'Kata sandi terlalu panjang.'),
  branchCode: z.string().min(1, 'Kode cabang wajib diisi.').max(20, 'Kode cabang terlalu panjang.').optional()
});

export const branchQuerySchema = z.object({
  status: z.enum(['active', 'inactive', 'all']).optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BranchQuery = z.infer<typeof branchQuerySchema>;
