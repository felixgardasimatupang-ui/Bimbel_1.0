-- ═══════════════════════════════════════════════════════════════
-- Bimbel One Platform — Initial Database Schema
-- Migration: 001_initial_schema
-- Description: Foundation tables for Phase A: Auth, RBAC, Branches
-- Reference: 03_Database_and_Security_Production_Guide.md
-- ═══════════════════════════════════════════════════════════════

-- ==============================================================
-- Identity and Access Domain
-- ==============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE branches (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    timezone    VARCHAR(50)  NOT NULL DEFAULT 'Asia/Jakarta',
    status      VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    address     TEXT,
    phone       VARCHAR(30),
    email       VARCHAR(255),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id     UUID REFERENCES branches(id),
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(30),
    password_hash TEXT         NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
    is_mfa_required BOOLEAN    NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(50)  NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key         VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id   UUID REFERENCES branches(id),
    expires_at  TIMESTAMPTZ  NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    revoked_at  TIMESTAMPTZ
);

CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor       VARCHAR(255) NOT NULL,
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(100) NOT NULL,
    branch_id   UUID REFERENCES branches(id),
    outcome     VARCHAR(20)  NOT NULL CHECK (outcome IN ('success', 'failure', 'info')),
    detail      TEXT,
    before_data JSONB,
    after_data  JSONB,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ==============================================================
-- Indexes
-- ==============================================================

CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_branch_id ON audit_logs(branch_id);

-- ==============================================================
-- Seed Data: Branches
-- ==============================================================

INSERT INTO branches (id, code, name, timezone, status, address, phone, email) VALUES
    ('branch-jkt-selatan', 'JKT-SLT', 'Bimbel One Jakarta Selatan', 'Asia/Jakarta', 'active', 'Jl. Melati No. 12, Jakarta Selatan', '+62 21 555 0101', 'jkt-selatan@bimbel.one'),
    ('branch-bandung',    'BDG-01',  'Bimbel One Bandung',        'Asia/Jakarta', 'active', 'Jl. Dago No. 8, Bandung',       '+62 22 555 0202', 'bandung@bimbel.one'),
    ('branch-surabaya',   'SBY-01',  'Bimbel One Surabaya',       'Asia/Jakarta', 'active', 'Jl. Darmo No. 23, Surabaya',     '+62 31 555 0303', 'surabaya@bimbel.one'),
    ('branch-pusat',      'HQ-01',   'Bimbel One Head Office',    'Asia/Jakarta', 'active', 'Gedung Pusat Operasional, Jakarta', '+62 21 555 0001', 'ops@bimbel.one');

-- ==============================================================
-- Seed Data: Roles & Permissions
-- ==============================================================

INSERT INTO roles (id, code, name) VALUES
    ('role-super-admin',   'super_admin',   'Super Admin'),
    ('role-branch-admin',  'branch_admin',  'Branch Admin'),
    ('role-finance',       'finance',       'Finance'),
    ('role-tutor',         'tutor',         'Tutor'),
    ('role-parent',        'parent',        'Parent'),
    ('role-support',       'support',       'Support');

INSERT INTO permissions (id, key) VALUES
    ('perm-auth-manage',           'auth:manage'),
    ('perm-auth-read',             'auth:read'),
    ('perm-branches-manage',       'branches:manage'),
    ('perm-branches-read',         'branches:read'),
    ('perm-students-manage',       'students:manage'),
    ('perm-students-read',         'students:read'),
    ('perm-attendance-manage',     'attendance:manage'),
    ('perm-attendance-create',     'attendance:create'),
    ('perm-scheduling-manage',     'scheduling:manage'),
    ('perm-scheduling-read',       'scheduling:read'),
    ('perm-billing-manage',        'billing:manage'),
    ('perm-billing-read',          'billing:read'),
    ('perm-payroll-manage',        'payroll:manage'),
    ('perm-payroll-read',          'payroll:read'),
    ('perm-notifications-manage',  'notifications:manage'),
    ('perm-notifications-read',    'notifications:read'),
    ('perm-helpdesk-manage',       'helpdesk:manage'),
    ('perm-helpdesk-create',       'helpdesk:create'),
    ('perm-inventory-manage',      'inventory:manage'),
    ('perm-integrations-manage',   'integrations:manage'),
    ('perm-audit-read',            'audit:read');

-- super_admin: all manage permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-super-admin', id FROM permissions;

-- branch_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-branch-admin', id FROM permissions WHERE key IN (
    'auth:read', 'branches:read', 'students:manage', 'attendance:manage',
    'scheduling:manage', 'billing:read', 'payroll:read',
    'notifications:manage', 'helpdesk:manage', 'inventory:manage', 'audit:read'
);

-- finance
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-finance', id FROM permissions WHERE key IN (
    'auth:read', 'branches:read', 'billing:manage', 'payroll:read',
    'notifications:read', 'audit:read'
);

-- tutor
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-tutor', id FROM permissions WHERE key IN (
    'auth:read', 'branches:read', 'students:read', 'attendance:create',
    'scheduling:read', 'notifications:read'
);

-- parent
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-parent', id FROM permissions WHERE key IN (
    'auth:read', 'branches:read', 'students:read', 'billing:read',
    'notifications:read', 'helpdesk:create'
);

-- support
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-support', id FROM permissions WHERE key IN (
    'auth:read', 'branches:read', 'students:read', 'helpdesk:manage',
    'notifications:manage', 'audit:read'
);
