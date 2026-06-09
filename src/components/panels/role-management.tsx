"use client";

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type PermissionDef = { key: string; label: string };
type ManagedRole = {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

type ViewState = 'list' | 'detail' | 'create' | 'edit';
type PageState = 'loading' | 'error' | 'ready';

export function RoleManagementPanel() {
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionDef[]>([]);
  const [view, setView] = useState<ViewState>('list');
  const [selected, setSelected] = useState<ManagedRole | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRoles = useCallback(async () => {
    setPageState('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/v1/roles');
      const json = await res.json();
      if (json.success) {
        setRoles(json.data.roles);
        setAllPermissions(json.data.allPermissions);
        setPageState('ready');
      } else {
        const msg = json.error?.message ?? 'Gagal memuat data role.';
        setErrorMessage(msg);
        setPageState('error');
      }
    } catch {
      setErrorMessage('Gagal terhubung ke server.');
      setPageState('error');
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  function openDetail(role: ManagedRole) {
    setSelected(role);
    setView('detail');
  }

  function openCreate() {
    setSelected(null);
    setView('create');
  }

  function openEdit(role: ManagedRole) {
    setSelected(role);
    setView('edit');
  }

  function backToList() {
    setSelected(null);
    setView('list');
    fetchRoles();
  }

  if (pageState === 'loading') {
    return (
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Foundation</p>
            <h2 className="sectionTitle">Manajemen Role</h2>
            <p className="sectionLead">Memuat data role...</p>
          </div>
        </div>
      </section>
    );
  }

  if (pageState === 'error') {
    return (
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">Foundation</p>
            <h2 className="sectionTitle">Manajemen Role</h2>
            <p className="sectionLead" style={{ color: 'var(--color-danger)' }}>{errorMessage}</p>
            <p className="sectionLead">Pastikan Anda sudah masuk dengan akun Admin.</p>
          </div>
          <div className="heroActions">
            <a className="primaryButton" href="/login">Masuk sebagai Admin</a>
            <button className="filterChip" onClick={fetchRoles}>Coba Lagi</button>
          </div>
        </div>
      </section>
    );
  }

  if (view === 'create') {
    return (
      <RoleForm
        allPermissions={allPermissions}
        onSave={() => backToList()}
        onCancel={() => backToList()}
      />
    );
  }

  if (view === 'edit' && selected) {
    return (
      <RoleForm
        initial={selected}
        allPermissions={allPermissions}
        onSave={() => backToList()}
        onCancel={() => backToList()}
      />
    );
  }

  if (view === 'detail' && selected) {
    return (
      <RoleDetail
        role={selected}
        allPermissions={allPermissions}
        onEdit={() => openEdit(selected)}
        onBack={() => backToList()}
      />
    );
  }

  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">Foundation</p>
          <h2 className="sectionTitle">Manajemen Role</h2>
          <p className="sectionLead">
            Kelola role pengguna, hak akses, dan batasan wewenang untuk Admin, Manager, dan Tentor.
          </p>
        </div>
        <div className="heroActions">
          <button className="primaryButton" onClick={openCreate} aria-label="Buat role baru">
            + Buat Role
          </button>
        </div>
      </div>

      <div className="cardGrid cardGrid3">
        {roles.map((role) => (
          <div key={role.id} className="miniCard routeCard" onClick={() => openDetail(role)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge toneInfo">{role.code}</span>
              <strong>{role.name}</strong>
            </div>
            <p>{role.description}</p>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {role.permissions.slice(0, 4).map((p) => {
                const def = allPermissions.find((ap) => ap.key === p);
                return (
                  <span key={p} className="metaPill" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {def?.label ?? p}
                  </span>
                );
              })}
              {role.permissions.length > 4 && (
                <span className="metaPill" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  +{role.permissions.length - 4} lagi
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleDetail({
  role,
  allPermissions,
  onEdit,
  onBack,
}: {
  role: ManagedRole;
  allPermissions: PermissionDef[];
  onEdit: () => void;
  onBack: () => void;
}) {
  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">{role.code}</p>
          <h2 className="sectionTitle">{role.name}</h2>
          <p className="sectionLead">{role.description}</p>
        </div>
        <div className="heroActions">
          <button className="filterChip" onClick={onBack}>Kembali</button>
          <button className="primaryButton" onClick={onEdit}>Edit Role</button>
        </div>
      </div>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h3 className="panelTitle">Hak Akses ({role.permissions.length})</h3>
            <p className="panelLead">Daftar izin yang dimiliki role ini.</p>
          </div>
        </div>
        <div className="panelBody">
          <div className="simpleList">
            {allPermissions.map((perm) => {
              const granted = role.permissions.includes(perm.key);
              return (
                <div key={perm.key} className="listRow">
                  <div>
                    <strong>{perm.label}</strong>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{perm.key}</p>
                  </div>
                  <div className="listRowMeta">
                    {granted ? (
                      <span className="badge toneSuccess">Aktif</span>
                    ) : (
                      <span className="badge toneNeutral">Nonaktif</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}

function RoleForm({
  initial,
  allPermissions,
  onSave,
  onCancel,
}: {
  initial?: ManagedRole;
  allPermissions: PermissionDef[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);
  const [saving, setSaving] = useState(false);

  function togglePermission(key: string) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !description.trim()) {
      toast.error('Semua field wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const url = initial ? `/api/v1/roles/${initial.id}` : '/api/v1/roles';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name, description, permissions }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(initial ? 'Role berhasil diperbarui.' : 'Role berhasil dibuat.');
        onSave();
      } else {
        toast.error(json.error?.message ?? 'Gagal menyimpan role.');
      }
    } catch {
      toast.error('Gagal terhubung ke server.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">{initial ? 'Edit Role' : 'Role Baru'}</p>
          <h2 className="sectionTitle">{initial ? `Edit: ${initial.name}` : 'Buat Role Baru'}</h2>
          <p className="sectionLead">
            {initial ? 'Ubah informasi dan hak akses role.' : 'Tentukan nama, deskripsi, dan hak akses role baru.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="screenPanel" style={{ gap: 20 }}>
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h3 className="panelTitle">Informasi Role</h3>
            </div>
          </div>
          <div className="panelBody" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label className="field">
              <span>Kode Role</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="contoh: admin, manager, tentor"
                disabled={!!initial}
                aria-label="Kode role"
              />
            </label>
            <label className="field">
              <span>Nama Role</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama role"
                aria-label="Nama role"
              />
            </label>
            <label className="field">
              <span>Deskripsi</span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi role"
                aria-label="Deskripsi role"
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h3 className="panelTitle">Hak Akses</h3>
              <p className="panelLead">Centang izin yang dimiliki role ini. ({permissions.length} dipilih)</p>
            </div>
          </div>
          <div className="panelBody">
            <div className="simpleList">
              {allPermissions.map((perm) => {
                const granted = permissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className="listRow"
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="checkbox"
                        checked={granted}
                        onChange={() => togglePermission(perm.key)}
                        style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <strong>{perm.label}</strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{perm.key}</p>
                      </div>
                    </div>
                    {granted && <span className="badge toneSuccess">Aktif</span>}
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <div className="heroActions">
          <button type="submit" className="primaryButton" disabled={saving}>
            {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat Role'}
          </button>
          <button type="button" className="filterChip" onClick={onCancel} disabled={saving}>
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
