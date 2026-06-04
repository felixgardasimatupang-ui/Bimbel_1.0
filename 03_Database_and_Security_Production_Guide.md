# Database and Security Production Guide
## Bimbel One Platform

**Document Type:** Technical Production Specification  
**Scope:** Database Architecture, Security Architecture, Operational Hardening  
**Status:** Draft for Engineering Implementation  
**Audience:** CTO, Tech Lead, Backend Engineer, DevOps, QA, Security Reviewer  
**Last Updated:** 2026-06-04

---

# 1. Purpose

Dokumen ini mendefinisikan rancangan **database** dan **security** untuk Bimbel One Platform agar sistem siap diproduksi, diamankan, dan dioperasikan pada lingkungan nyata.

Tujuan utama dokumen ini adalah:

1. Menetapkan standar struktur data yang konsisten dan scalable.
2. Menjamin isolasi data antar cabang dan antar peran.
3. Menerapkan kontrol keamanan yang memadai untuk aplikasi web, mobile, dan API.
4. Menyediakan fondasi untuk backup, recovery, auditability, dan high availability.
5. Mencegah implementasi fitur yang berisiko terhadap integritas, kerahasiaan, dan ketersediaan data.

---

# 2. Design Principles

## 2.1 Database Principles

- **Single Source of Truth**: setiap entitas memiliki satu sumber data utama.
- **Strong Referential Integrity**: gunakan foreign key, unique constraint, check constraint, dan transaction boundary.
- **Tenant-Aware by Default**: setiap data bisnis harus terkait dengan `branch_id` atau `tenant_id` sesuai kebutuhan.
- **Soft Delete for Business Data**: data operasional tidak dihapus permanen kecuali data teknis tertentu.
- **Auditability First**: setiap perubahan penting harus tercatat.
- **Schema Stability**: hindari perubahan struktur agresif tanpa migration yang terkontrol.
- **Performance by Design**: indeks dibuat berdasarkan pola query nyata, bukan asumsi.
- **Security by Default**: akses database dibatasi dari level role, policy, dan jaringan.

## 2.2 Security Principles

- **Least Privilege**: pengguna, service account, dan database role hanya memiliki hak minimum.
- **Defense in Depth**: keamanan diterapkan berlapis di aplikasi, database, jaringan, dan operasi.
- **Default Deny**: akses ditolak kecuali secara eksplisit diizinkan.
- **Zero Trust Internal Access**: koneksi internal tetap diautentikasi dan dienkripsi.
- **Traceability**: semua aksi sensitif dapat ditelusuri.
- **Secure by Lifecycle**: keamanan tidak hanya saat login, tetapi juga pada session, token, file, API, dan backup.
- **Recoverability**: insiden harus dapat dipulihkan melalui backup dan prosedur pemulihan yang jelas.

---

# 3. Recommended Platform Choices

## 3.1 Database Engine

**Primary Database:** PostgreSQL

Alasan:
- mendukung transaksi ACID,
- mendukung row-level security,
- mendukung replication, WAL, backup, dan point-in-time recovery,
- memiliki privilege model yang matang,
- cocok untuk aplikasi multi-cabang dan data relasional kompleks. PostgreSQL mendokumentasikan Row-Level Security, privileges, SSL/TLS, WAL, backup, dan high availability sebagai fitur inti platform. citeturn822836search0turn822836search1turn998359search2turn998359search3turn822836search17

## 3.2 Supporting Components

- **Redis** untuk cache, rate limit counter, session support, and job coordination.
- **Object Storage** seperti S3-compatible storage untuk file materi, bukti bayar, foto, dokumen, dan lampiran.
- **Queue / Broker** untuk proses asynchronous seperti notifikasi, invoice generation, export laporan, dan retry job.

---

# 4. Tenancy and Data Isolation Model

## 4.1 Recommended Model

Untuk platform bimbel multi-cabang, model yang direkomendasikan adalah:

### Option A — Single Database, Shared Schema, Tenant Column
Setiap tabel bisnis memiliki `branch_id` atau `tenant_id`.

### Option B — Single Database, Schema per Tenant
Lebih kompleks, cocok jika isolasi sangat ketat diperlukan.

### Recommended Choice
**Single database + shared schema + tenant column + Row-Level Security (RLS)**

Alasan:
- paling efisien untuk startup dan skala menengah,
- mudah dioperasikan,
- tetap dapat diisolasi dengan policy yang benar,
- kompatibel dengan analitik pusat.

PostgreSQL mendukung Row-Level Security yang membatasi baris yang bisa dibaca, ditulis, diubah, atau dihapus per pengguna, dan policy harus diaktifkan secara eksplisit pada tabel. citeturn822836search0turn822836search4turn822836search12

## 4.2 Tenant Boundary Rules

- Semua data operasional harus memiliki `branch_id`.
- Data pusat dapat memiliki `branch_id = NULL` atau `scope = global`.
- Query aplikasi tidak boleh bergantung pada filter manual saja; policy database harus ikut menegakkan isolasi.
- Akses super admin harus tetap tercatat dalam audit log.
- Data antar cabang tidak boleh bisa diakses langsung tanpa policy yang valid.

## 4.3 Recommended Branch Strategy

- `branches` menjadi entitas utama.
- Setiap cabang memiliki timezone, jam operasional, kontak, dan konfigurasi keamanan sendiri.
- Data siswa, jadwal, absensi, invoice, payroll, inventaris, dan notifikasi minimal membawa `branch_id`.
- Laporan pusat menggunakan agregasi lintas cabang dengan akses tersupervisi.

---

# 5. Database Standards

## 5.1 Naming Convention

- Table: `snake_case`, jamak, contoh `students`, `attendance_records`
- Column: `snake_case`, contoh `branch_id`, `created_at`
- Primary key: `id`
- Foreign key: `<referenced_table>_id`
- Timestamp fields: `created_at`, `updated_at`, `deleted_at`
- Audit fields: `created_by`, `updated_by`, `deleted_by`
- Boolean fields: `is_active`, `is_archived`, `is_verified`

## 5.2 Primary Key Strategy

Rekomendasi:
- gunakan `UUID` untuk seluruh tabel utama agar aman untuk distributed generation dan sulit ditebak,
- gunakan generator konsisten di aplikasi atau database,
- hindari integer auto-increment untuk entitas yang terekspos ke publik.

## 5.3 Timestamps and Timezones

- Simpan semua timestamp di **UTC**.
- Cabang menyimpan timezone sebagai konfigurasi tampilan.
- UI menampilkan waktu sesuai timezone cabang/pengguna.
- Jangan campur timestamp lokal di database.

## 5.4 Soft Delete Policy

- Data bisnis: soft delete menggunakan `deleted_at`, `deleted_by`.
- Data sensitif atau log: tetap dipertahankan sesuai kebijakan retensi.
- Hard delete hanya untuk data teknis, sandbox, atau data yang secara hukum wajib dihapus.

## 5.5 Audit Columns Minimum

Setiap tabel bisnis penting minimal memiliki:
- `id`
- `branch_id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `deleted_at`
- `deleted_by`
- `is_active`

## 5.6 Constraint Policy

- `NOT NULL` untuk field wajib.
- `UNIQUE` untuk identifier bisnis.
- `CHECK` untuk nilai domain terbatas.
- `FOREIGN KEY` untuk relasi wajib.
- `ON DELETE` harus dipilih dengan sangat hati-hati.
- Hindari cascade delete pada entitas utama seperti siswa, invoice, payment, payroll, dan attendance.

---

# 6. Core Database Domains

## 6.1 Identity and Access Domain

### Tables
- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `sessions`
- `refresh_tokens`
- `mfa_factors`
- `audit_logs`

### Notes
- `users` hanya menyimpan identitas akun.
- Detail peran bisnis diletakkan pada tabel domain terkait seperti `students`, `parents`, `employees`, `tutors`.
- PostgreSQL memperlakukan roles sebagai entitas yang dapat berperan sebagai user atau group, sehingga privilege model dapat diatur sangat granular. citeturn998359search11turn998359search15turn998359search7

## 6.2 Academic Domain

### Tables
- `students`
- `parents`
- `student_parents`
- `programs`
- `classes`
- `class_sessions`
- `schedules`
- `enrollments`
- `materials`
- `assignments`
- `submissions`

## 6.3 Attendance Domain

### Tables
- `attendance_logs`
- `attendance_rules`
- `attendance_devices`
- `attendance_exceptions`

## 6.4 Exam Domain

### Tables
- `question_bank`
- `question_tags`
- `exams`
- `exam_questions`
- `exam_attempts`
- `exam_attempt_answers`
- `exam_results`
- `exam_analytics`

## 6.5 Finance Domain

### Tables
- `invoices`
- `invoice_items`
- `payments`
- `payment_transactions`
- `discounts`
- `refunds`
- `cash_movements`
- `expense_categories`
- `expenses`

## 6.6 Payroll Domain

### Tables
- `employees`
- `tutors`
- `salary_components`
- `payroll_runs`
- `payroll_items`
- `salary_slips`
- `leave_requests`
- `overtime_records`

## 6.7 Communication Domain

### Tables
- `notifications`
- `notification_templates`
- `notification_logs`
- `message_queue_logs`

## 6.8 Inventory Domain

### Tables
- `assets`
- `inventory_items`
- `stock_movements`
- `asset_maintenance`

## 6.9 Support Domain

### Tables
- `tickets`
- `ticket_messages`
- `ticket_attachments`
- `ticket_categories`

## 6.10 Configuration Domain

### Tables
- `branches`
- `system_settings`
- `calendar_holidays`
- `document_sequences`
- `feature_flags`
- `integration_settings`

---

# 7. Proposed Minimum Schema

## 7.1 branches

Fields:
- `id`
- `code`
- `name`
- `timezone`
- `address`
- `phone`
- `email`
- `status`
- `created_at`
- `updated_at`

Rules:
- `code` unique
- timezone mandatory
- status limited to active/inactive

## 7.2 users

Fields:
- `id`
- `branch_id`
- `full_name`
- `email`
- `phone`
- `password_hash`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`
- `deleted_at`

Rules:
- one user may have many roles through `user_roles`
- email/phone uniqueness rules must consider tenant scope if required
- password never stored in plain text

## 7.3 students

Fields:
- `id`
- `branch_id`
- `user_id`
- `student_code`
- `full_name`
- `birth_date`
- `gender`
- `school_name`
- `grade_level`
- `status`
- `enrolled_at`
- `created_at`
- `updated_at`
- `deleted_at`

## 7.4 invoices

Fields:
- `id`
- `branch_id`
- `student_id`
- `invoice_number`
- `issue_date`
- `due_date`
- `subtotal`
- `discount_total`
- `tax_total`
- `grand_total`
- `paid_total`
- `status`
- `created_at`
- `updated_at`

## 7.5 attendance_logs

Fields:
- `id`
- `branch_id`
- `user_id`
- `attendance_type`
- `source`
- `check_in_at`
- `check_out_at`
- `latitude`
- `longitude`
- `device_id`
- `status`
- `created_at`
- `updated_at`

## 7.6 payroll_runs

Fields:
- `id`
- `branch_id`
- `period_start`
- `period_end`
- `status`
- `approved_by`
- `approved_at`
- `created_at`
- `updated_at`

---

# 8. Relationship and Integrity Rules

## 8.1 Mandatory Relationships

- `students` must belong to a branch.
- `classes` must belong to a branch.
- `class_sessions` must belong to a class.
- `invoices` must belong to a student and branch.
- `payments` must reference invoice or payment group.
- `payroll_items` must reference payroll run and employee/tutor.
- `attendance_logs` must reference a user and branch.

## 8.2 Data Integrity Rules

- Tidak boleh ada pembayaran tanpa invoice referensi yang valid.
- Tidak boleh ada jadwal kelas yang bentrok untuk tentor yang sama.
- Tidak boleh ada presensi yang lolos jika device/geo validation gagal, kecuali manual override yang tercatat.
- Tidak boleh ada invoice yang diubah setelah payment final tanpa mekanisme adjustment/refund.
- Tidak boleh ada payroll yang diubah tanpa approval trail.

---

# 9. Indexing and Performance Strategy

## 9.1 Indexing Principles

- Index pada foreign key.
- Index pada kolom filter utama: `branch_id`, `status`, `created_at`, `issue_date`, `due_date`, `period_start`.
- Composite index untuk query yang sering dipakai bersama.
- Unique index untuk nomor dokumen bisnis.
- Partial index untuk data aktif jika pola query dominan pada data aktif.

## 9.2 Query Patterns to Optimize

- dashboard cabang per hari,
- daftar siswa aktif,
- invoice overdue,
- absensi per periode,
- payroll per cabang,
- schedule by tutor,
- exam result by class and branch.

## 9.3 Performance Guardrails

- Hindari N+1 query.
- Hindari select `*` pada endpoint besar.
- Gunakan pagination default.
- Gunakan caching untuk dashboard agregat.
- Gunakan queue untuk proses berat seperti laporan dan notifikasi.

---

# 10. Partitioning and Archiving Strategy

## 10.1 When to Partition

Pertimbangkan partitioning jika:
- tabel mencapai volume sangat besar,
- query berdasarkan tanggal mendominasi,
- data historis jarang diakses tetapi harus tetap tersedia.

## 10.2 Candidate Tables for Partitioning

- `attendance_logs`
- `audit_logs`
- `notification_logs`
- `payment_transactions`
- `exam_attempts`

## 10.3 Archiving Policy

- Data historis lama dipindahkan ke archive schema atau cold storage jika diperlukan.
- Data yang tetap wajib diakses tetap berada di primary database tetapi bisa diindeks secara berbeda.
- Kebijakan retensi harus disetujui product owner dan legal/compliance.

---

# 11. Backup, Recovery, and High Availability

## 11.1 Backup Standard

- Backup full harian.
- WAL archiving aktif untuk point-in-time recovery.
- Simpan backup terpisah dari primary server.
- Uji restore secara berkala.

PostgreSQL mendokumentasikan bahwa WAL memungkinkan online backup dan point-in-time recovery, dan `pg_basebackup` dapat dipakai untuk backup dasar dari cluster yang berjalan. citeturn822836search13turn822836search1turn822836search9turn822836search5

## 11.2 Recovery Objective

Rekomendasi target awal:
- **RPO**: maksimal 15 menit
- **RTO**: maksimal 2 jam

## 11.3 High Availability

- Primary-standby replication.
- Read replica untuk laporan jika dibutuhkan.
- Failover plan terdokumentasi.
- Monitoring lag replikasi.

PostgreSQL mendukung high availability, load balancing, log shipping standby, dan streaming replication sebagai bagian dari arsitektur resminya. citeturn822836search17turn822836search21

## 11.4 Restore Drill

Wajib dilakukan:
- restore bulanan untuk verifikasi backup,
- simulasi failover minimal per kuartal,
- pencatatan hasil uji pemulihan.

---

# 12. Database Security Controls

## 12.1 Role Model

Gunakan PostgreSQL roles secara eksplisit. PostgreSQL menjelaskan bahwa role dapat berperan sebagai user, group, atau keduanya, dan privilege diberikan melalui GRANT/REVOKE pada objek database. citeturn998359search11turn998359search3turn998359search7

### Database Roles Minimum
- `app_readonly`
- `app_readwrite`
- `app_migrations`
- `app_background_jobs`
- `app_audit_writer`
- `db_admin`
- `db_backup`
- `db_analytics_readonly`

### Rules
- Aplikasi tidak boleh memakai superuser database.
- Service account berbeda untuk web, worker, migrator, dan backup.
- Kredensial dibatasi per lingkungan: dev, staging, production.

## 12.2 Row-Level Security

Aktifkan RLS pada tabel tenant-aware seperti:
- students
- classes
- invoices
- attendance_logs
- payroll_items
- tickets

Contoh kebijakan konseptual:
- pengguna cabang A hanya melihat data cabang A,
- pengguna pusat dapat melihat semua cabang jika role mengizinkan,
- update dan delete mengikuti policy yang sama.

PostgreSQL menegaskan bahwa row-level security harus diaktifkan pada tabel agar policy diterapkan. citeturn822836search4turn822836search0turn822836search12

## 12.3 Default Deny Privileges

- REVOKE akses publik pada schema sensitif.
- GRANT hanya pada role yang diperlukan.
- Batasi akses DDL hanya untuk migrator.
- Batasi akses SELECT pada tabel sensitif seperti tokens, audit logs, dan data identitas.

## 12.4 Separate Schema Strategy

Gunakan schema terpisah bila diperlukan:
- `public`
- `auth`
- `academic`
- `finance`
- `payroll`
- `audit`
- `reporting`

Gunakan hanya bila organisasi tim dan query pattern memang membutuhkannya. Untuk fase awal, shared schema lebih sederhana.

## 12.5 Secrets at Database Level

- Tidak ada secret aplikasi disimpan di tabel biasa.
- Token integrasi dienkripsi atau disimpan di secret manager.
- Data sensitif seperti refresh token disimpan dengan hashing atau encryption sesuai kebutuhan kasus.

OWASP menekankan praktik pengelolaan secrets yang benar dan pencegahan kebocoran secret di source code maupun storage yang tidak aman. citeturn822836search23

---

# 13. Application Security Architecture

## 13.1 Authentication

### Minimum Requirements
- email/phone login,
- password hashing kuat,
- optional MFA,
- login attempt throttling,
- device/session tracking.

NIST SP 800-63B menyatakan password untuk single-factor authentication harus minimal 15 karakter, sementara untuk bagian dari MFA minimal 8 karakter, dan tidak boleh memaksa aturan komposisi karakter yang berlebihan. citeturn998359search0turn998359search16

### Password Policy Recommendation
- minimum 12–15 karakter untuk pengguna umum,
- minimum 15 karakter untuk akun admin,
- tidak mewajibkan pola simbol kompleks yang kaku,
- dukung password manager,
- larang password yang sangat umum atau masuk daftar bocor.

### Password Storage
Gunakan hashing adaptif seperti Argon2id atau bcrypt dengan cost yang sesuai kemampuan server. OWASP merekomendasikan penyimpanan password yang aman agar tetap terlindungi walaupun database bocor. citeturn822836search11

## 13.2 Session Management

- akses web memakai session atau JWT yang terkontrol,
- refresh token diputar secara aman,
- token harus memiliki expiry,
- logout harus dapat mencabut session,
- session ID harus aman dan tidak mudah ditebak.

OWASP menjelaskan bahwa session ID atau token mengikat kredensial autentikasi ke traffic pengguna dan harus dikelola dengan aman. citeturn822836search3turn822836search19

## 13.3 Multi-Factor Authentication

Wajib untuk:
- super admin,
- owner,
- finance,
- DB/admin panel,
- akses sensitif dan operasi berisiko tinggi.

Channel MFA:
- TOTP authenticator,
- email OTP,
- WhatsApp OTP hanya bila dipandang sebagai fallback dan dikontrol ketat.

## 13.4 Authorization

- RBAC sebagai lapisan utama.
- ABAC/policy-based rules untuk kasus cabang, kelas, program, atau status.
- Semua endpoint sensitif wajib memverifikasi ownership dan scope.

## 13.5 Rate Limiting and Abuse Protection

- rate limit pada login, OTP, reset password, payment callback, dan endpoint publik,
- anti brute-force,
- anti enumeration pada endpoint pencarian user,
- captcha atau challenge bila diperlukan pada form publik.

## 13.6 Input Validation

- validation di edge layer dan service layer,
- whitelist format email, phone, ID, dan amount,
- sanitize file name dan metadata,
- blok payload berbahaya,
- parameterized query wajib.

## 13.7 File Security

- semua file disimpan di object storage,
- file di-scan sebelum diproses bila berisiko,
- ekstensi dan MIME type diverifikasi,
- URL download bertanda tangan sementara,
- file sensitif dibatasi aksesnya.

---

# 14. Transport, Encryption, and Key Management

## 14.1 Transport Security

PostgreSQL mendukung koneksi terenkripsi menggunakan TLS/SSL, dan server dapat disetel untuk mewajibkan SSL untuk koneksi tertentu atau seluruh koneksi. citeturn998359search2turn998359search6turn998359search14

### Rules
- Semua koneksi aplikasi ke API harus HTTPS.
- Semua koneksi service-to-service harus mTLS atau TLS internal yang tervalidasi.
- Koneksi database harus TLS.
- Tidak boleh ada secret dikirim lewat plaintext HTTP.

## 14.2 Data at Rest

- encryption at rest pada disk, volume, backup, dan object storage,
- backup file juga harus terenkripsi,
- key rotation dijadwalkan,
- akses ke key dibatasi.

## 14.3 Secret Management

Gunakan secret manager, bukan `.env` untuk production final.

### Secret yang harus dikelola aman
- DB password
- JWT signing key
- refresh token secret
- payment gateway secret
- WA gateway secret
- email SMTP credentials
- storage access key
- encryption key

OWASP menekankan penggunaan secret management yang aman untuk mencegah paparan secret pada source code, logs, atau artifact build. citeturn822836search23turn822836search19

---

# 15. Logging, Monitoring, and Audit

## 15.1 Audit Log

NIST mendefinisikan audit log sebagai catatan kronologis aktivitas sistem, termasuk akses dan operasi yang dilakukan dalam periode tertentu. citeturn998359search13turn998359search9

### Audit Event Minimum
- login sukses/gagal
- perubahan role/permission
- create/update/delete data penting
- invoice adjustment
- refund
- payroll approval
- manual attendance override
- export data
- configuration change
- token revoke
- failed access to restricted resource

### Audit Log Rules
- immutable by application user,
- searchable by admin terbatas,
- memiliki timestamp, actor, action, object, before/after snapshot,
- retention policy jelas.

## 15.2 Operational Logging

- application log terstruktur JSON,
- correlation ID per request,
- request ID dibawa lintas service,
- mask data sensitif pada log,
- jangan log password, OTP, secret, atau full token.

## 15.3 Security Monitoring

- alert untuk login anomali,
- alert untuk perubahan role,
- alert untuk percobaan akses cabang lain,
- alert untuk lonjakan error callback payment,
- alert untuk kegagalan backup.

## 15.4 Dashboard Monitoring

Pantau:
- CPU, RAM, disk, I/O,
- query latency,
- connection pool,
- replication lag,
- job queue backlog,
- failed login rate,
- API error rate,
- backup status.

---

# 16. API Security Standards

## 16.1 API Versioning

- semua endpoint production melalui `/api/v1/`
- breaking change harus pindah versi
- jangan ubah response contract tanpa migrasi versi

## 16.2 API Authentication

- Bearer token atau session token terkontrol,
- peran dan scope diperiksa pada setiap request sensitif,
- webhook memakai signature verification.

## 16.3 API Authorization

- cek ownership,
- cek branch scope,
- cek role,
- cek action permissions,
- cek object-level permission untuk akses data spesifik.

## 16.4 Webhook Security

- signature HMAC,
- timestamp tolerance,
- replay protection,
- idempotency key,
- allowlist IP bila memungkinkan.

## 16.5 Idempotency

Wajib untuk:
- pembayaran,
- callback,
- pembuatan invoice,
- retry notifikasi,
- pembentukan payroll run.

---

# 17. Compliance and Privacy Controls

## 17.1 Data Classification

- Public
- Internal
- Confidential
- Restricted

## 17.2 Sensitive Data

Contoh:
- identitas siswa,
- identitas orang tua,
- rekening,
- slip gaji,
- data pembayaran,
- token akses,
- dokumen legal.

## 17.3 Retention

- audit log: sesuai kebutuhan investigasi dan kebijakan internal,
- invoice/payment: sesuai kewajiban bisnis dan pajak,
- session/token: sesuai masa berlaku,
- file: sesuai siklus hidup dokumen.

## 17.4 Privacy

- data siswa dan orang tua harus dibatasi berdasarkan role,
- ekspor data hanya untuk role yang berwenang,
- data sensitif harus disensor pada tampilan tertentu.

---

# 18. Disaster Recovery Plan

## 18.1 Incident Scenarios

- database corruption,
- accidental delete,
- credential leak,
- ransomware,
- storage failure,
- payment provider outage,
- region outage.

## 18.2 Recovery Actions

- isolate affected service,
- rotate secrets,
- restore from last consistent backup,
- replay WAL jika diperlukan,
- verifikasi integritas data,
- rekonsiliasi data transaksi.

## 18.3 DR Readiness Checklist

- backup verified,
- restore test passed,
- runbook tersedia,
- access ownership jelas,
- on-call contact jelas,
- escalation path jelas.

---

# 19. Production Launch Readiness Checklist

## Database

- schema final disetujui,
- migration script tervalidasi,
- index utama sudah dibuat,
- RLS aktif pada tabel tenant-aware,
- backup harian aktif,
- restore test sudah dilakukan,
- monitoring DB sudah aktif.

## Security

- HTTPS aktif,
- TLS database aktif,
- password policy diterapkan,
- MFA aktif untuk role sensitif,
- role/permission matrix selesai,
- audit log aktif,
- secret manager digunakan,
- rate limiting aktif,
- webhook signature aktif,
- vulnerability scan sudah dilakukan.

## Application

- build production sukses,
- test lulus,
- error handling konsisten,
- logging terstruktur,
- endpoint publik dibatasi,
- file upload aman.

---

# 20. Recommended Implementation Order

## Phase 1 — Foundation
- branches
- users
- roles
- permissions
- RBAC
- audit logs
- secret management
- DB migrations

## Phase 2 — Tenant Safety
- RLS
- branch filters
- access policies
- service account separation

## Phase 3 — Business Core
- students
- parents
- classes
- attendance
- invoices
- payments
- payroll

## Phase 4 — Hardening
- backup & PITR
- monitoring
- alerts
- restore drills
- security review

## Phase 5 — Launch
- final testing
- load test
- UAT
- launch checklist
- go-live monitoring

---

# 21. Final Recommendation

Untuk siap launching, sistem ini harus berjalan dengan 4 lapis proteksi utama:

1. **Data layer protection** melalui constraint, RLS, role, dan audit.
2. **Transport security** melalui TLS/HTTPS.
3. **Application security** melalui authentication, authorization, validation, rate limit, dan session control.
4. **Operational security** melalui backup, recovery, monitoring, dan incident response.

Jika empat lapis ini diterapkan dengan disiplin, Bimbel One Platform akan jauh lebih siap untuk produksi, aman untuk skala multi-cabang, dan lebih tahan terhadap error operasional maupun insiden keamanan.

---

# 22. Reference Basis

Rancangan ini disusun dengan mengacu pada:
- PostgreSQL Row-Level Security documentation. citeturn822836search0turn822836search4turn822836search12
- PostgreSQL backup, WAL archiving, replication, SSL/TLS, privileges, and roles documentation. citeturn822836search1turn822836search5turn822836search9turn822836search13turn822836search17turn822836search21turn998359search2turn998359search3turn998359search7turn998359search11turn998359search15turn998359search18turn998359search19
- OWASP ASVS, Authentication, Session Management, Password Storage, and Secrets Management guidance. citeturn822836search2turn822836search3turn822836search7turn822836search11turn822836search19turn822836search23
- NIST SP 800-63B and related NIST logging/security control references. citeturn998359search0turn998359search13turn998359search9turn998359search5
