# Bimbel One Platform

> Platform manajemen bimbingan belajar (bimbel) berbasis Next.js — monolit modular dengan App Router, React 19, dan TypeScript.

## Daftar Isi

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Memulai](#memulai)
- [Scripts](#scripts)
- [Testing](#testing)
- [API Routes](#api-routes)
- [Arsitektur](#arsitektur)
- [Dokumentasi](#dokumentasi)
- [Lisensi](#lisensi)

---

## Overview

Bimbel One Platform adalah aplikasi web untuk mengelola operasional bimbingan belajar, mencakup:

- **Dashboard** — Ringkasan operasional lintas cabang
- **Penagihan & Keuangan** — Invoice, pembayaran, piutang
- **Jadwal Akademik** — Ruang, tutor, slot waktu
- **Absensi** — Kehadiran siswa dan staf
- **LMS & Materi** — Modul pembelajaran terstruktur
- **CRM** — Pipeline prospek dan profiling siswa
- **Helpdesk** — Tiket, chat, SLA monitoring
- **Notifikasi** — Broadcast, template, WhatsApp gateway
- **Payroll** — Penggajian tutor dan staf

---

## Tech Stack

| Komponen | Versi | Keterangan |
|----------|-------|------------|
| Next.js | 16.0.0 | App Router, SSR, SSG |
| React | 19.2.0 | UI library |
| TypeScript | 5.7.0 | Type safety |
| Zod | 4.4.3 | Schema validation |
| Zustand | 5.0.14 | Client state management |
| Vitest | 4.1.8 | Test runner |
| ESLint | 9.0.0 | Linting |

---

## Struktur Proyek

```
Bimbel_1.0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/v1/             # API endpoints
│   │   │   ├── audit-logs/     # GET — Audit trail
│   │   │   ├── auth/login/     # POST — Login
│   │   │   ├── branches/       # GET — Daftar cabang
│   │   │   ├── health/         # GET — Health check
│   │   │   ├── permissions/    # GET — Daftar permission
│   │   │   ├── roles/          # GET — Daftar role
│   │   │   └── screens/        # GET — Daftar screen
│   │   ├── branches/           # Halaman cabang
│   │   ├── login/              # Halaman login
│   │   ├── production/         # Halaman produksi
│   │   └── screens/            # Halaman screens
│   │       ├── [slug]/         # Detail screen (dinamis)
│   │       └── page.tsx        # Daftar screen
│   ├── components/
│   │   ├── app-shell.tsx       # Layout utama (sidebar + workspace)
│   │   ├── branch-browser.tsx   # Browser cabang
│   │   ├── login-form.tsx      # Form login
│   │   ├── screen-panels.tsx   # Panel screen
│   │   ├── panels/             # 16 panel komponen
│   │   └── ui/                 # UI primitives
│   ├── lib/
│   │   ├── branch-directory.ts # Data cabang
│   │   ├── join-classes.ts     # CSS utility
│   │   ├── rate-limiter.ts     # Rate limiting
│   │   ├── screens.ts          # Data screen
│   │   ├── stores/auth-store.ts # Zustand auth store
│   │   └── validation/         # Zod schemas + middleware
│   └── server/
│       ├── api.ts              # API envelope helpers
│       ├── audit-store.ts      # Audit log store
│       ├── auth.ts             # Authentication logic
│       ├── catalog.ts          # Data seed (users, roles, branches)
│       ├── password.ts         # Password hashing (scrypt)
│       └── rbac.ts             # Role-based access control
├── .hermes/plans/              # Implementation plans
├── AUDIT.md                    # Security & code audit report
├── TESTING.md                  # Testing documentation
├── DEBUGGING-REPORT.md         # Debugging session report
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── next.config.ts
└── eslint.config.mjs
```

---

## Memulai

### Prerequisites

- Node.js 18+
- npm atau yarn

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd Bimbel_1.0

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local dengan nilai yang sesuai
```

### Development

```bash
# Jalankan development server
npm run dev
# Buka http://localhost:3000
```

### Production

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

---

## Scripts

| Script | Perintah | Keterangan |
|--------|----------|------------|
| `npm run dev` | `next dev` | Development server dengan hot reload |
| `npm run build` | `next build` | Production build |
| `npm start` | `next start` | Production server |
| `npm run lint` | `eslint .` | Lint semua file |
| `npm run typecheck` | `tsc --noEmit` | Type check tanpa compile |
| `npm test` | `vitest run` | Jalankan semua test |
| `npm run test:watch` | `vitest` | Test watch mode |

---

## Testing

Test suite menggunakan **Vitest** dengan 51 tests di 7 file:

```
Test Files  7 passed (7)
     Tests  51 passed ( 51)
  Duration  ~386ms
```

### Test Coverage

| Area | Tests | File |
|------|-------|------|
| API Envelope | 5 | `src/server/__tests__/api.test.ts` |
| Authentication | 12 | `src/server/__tests__/auth.test.ts` |
| Password Hashing | 6 | `src/server/__tests__/password.test.ts` |
| RBAC | 10 | `src/server/__tests__/rbac.test.ts` |
| Rate Limiter | 4 | `src/lib/__tests__/rate-limiter.test.ts` |
| Validation Schemas | 10 | `src/lib/__tests__/validation.test.ts` |
| Join Classes | 4 | `src/lib/__tests__/join-classes.test.ts` |

Lihat [TESTING.md](./TESTING.md) untuk dokumentasi lengkap testing.

---

## API Routes

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/v1/auth/login` | Login dengan identifier + password |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/branches` | Daftar cabang (filter: `?status=active`) |
| GET | `/api/v1/roles` | Daftar role |
| GET | `/api/v1/permissions` | Daftar permission |
| GET | `/api/v1/screens` | Daftar screen |
| GET | `/api/v1/audit-logs` | Audit log (filter: `?branchId=xxx`) |

### Contoh Request

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@bimbel.one","password":"Admin123!"}'

# Health check
curl http://localhost:3000/api/v1/health

# Daftar cabang
curl http://localhost:3000/api/v1/branches

# Audit log per cabang
curl http://localhost:3000/api/v1/audit-logs?branchId=branch-pusat
```

### Demo Users

| Role | Email | Password | Cabang |
|------|-------|----------|--------|
| Super Admin | admin@bimbel.one | Admin123! | HQ-01 |
| Finance | finance@bimbel.one | Finance123! | HQ-01 |
| Tutor | ayu@bimbel.one | Tutor123! | BDG-01 |
| Branch Admin | budi@bimbel.one | Branch123! | JKT-SLT |
| Support | support@bimbel.one | Support123! | SBY-01 |

---

## Arsitektur

### Authentication Flow

```
Client -> POST /api/v1/auth/login
  -> validateBody(loginSchema)     -- Zod validation
  -> findUserByIdentifier()        -- Cari user by email/phone
  -> findBranchByCode()            -- Cari cabang
  -> isCrossBranchLogin()          -- Validasi cabang
  -> verifyPasswordAsync()         -- Verifikasi password (scrypt)
  -> getPermissionsForRoleCodes()  -- Ambil permissions
  -> Set cookies (session_id, branch_id)
  -> Return { user, branch, session }
```

### RBAC Model

```
User -> roleCodes[] -> Role -> permissions[] -> PermissionKey

PermissionKey = `${resource}:${action}`
  Resource: auth, branches, students, attendance, scheduling,
            billing, payroll, notifications, helpdesk,
            inventory, integrations, audit
  Action: read, create, update, delete, approve, export, manage
```

### Roles & Permissions

| Role | Key Permissions |
|------|----------------|
| super_admin | Full manage access on all resources |
| branch_admin | Manage students, attendance, scheduling, notifications, helpdesk, inventory |
| finance | Manage billing, read payroll |
| tutor | Read students, create attendance, read scheduling |
| parent | Read students, billing; create helpdesk tickets |
| support | Manage helpdesk, read students, manage notifications |

### Data Store

Saat ini menggunakan **in-memory data store** (module-level arrays):

- `src/server/catalog.ts` — Users, roles, branches, permissions
- `src/server/audit-store.ts` — Audit events
- `src/lib/rate-limiter.ts` — Rate limit counters

> **Catatan:** Data hilang saat server restart. Production membutuhkan database (PostgreSQL).

---

## Dokumentasi

| File | Keterangan |
|------|------------|
| [AUDIT.md](./AUDIT.md) | Security & code audit report — findings, fixes, recommendations |
| [TESTING.md](./TESTING.md) | Testing documentation — test suites, coverage, conventions |
| [DEBUGGING-REPORT.md](./DEBUGGING-REPORT.md) | Debugging session report — timeline, bug reports, lessons learned |
| [.hermes/plans/](./.hermes/plans/) | Implementation plans |

### Audit Summary

| Severity | Finding | Status |
|----------|---------|--------|
| HIGH | Missing getClientIp export (build break) | FIXED |
| MEDIUM | Rate limiter memory leak | FIXED |
| MEDIUM | Audit log query schema rejects valid branch IDs | FIXED |
| LOW | Phone identifier normalization inconsistent | FIXED |
| LOW | Empty string passes as valid branchCode | FIXED |

---

## Environment Variables

Lihat `.env.example` untuk daftar lengkap:

| Variable | Keterangan | Required |
|----------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No (demo uses in-memory) |
| `SESSION_SECRET` | Session encryption key | Recommended |
| `NEXT_PUBLIC_APP_NAME` | Nama aplikasi | No |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi | No |
| `REDIS_URL` | Redis connection (rate limiting) | No |
| `STORAGE_*` | S3-compatible object storage | No |
| `WA_*` | WhatsApp gateway | No |
| `SMTP_*` | Email SMTP | No |
| `PAYMENT_*` | Payment gateway | No |

---

## Lisensi

Private — ZOO Company
