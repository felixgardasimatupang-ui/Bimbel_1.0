'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';
import { Badge } from './shared';

type ViewState = 'list' | 'create' | 'edit';
type PageState = 'loading' | 'error' | 'ready';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { label: string; value: string }[];
  disabled?: boolean;
};

export type ColumnDef = {
  key: string;
  label: string;
  render: (item: Record<string, unknown>) => ReactNode;
  align?: 'left' | 'right';
};

export function CrudPanel({
  title,
  lead,
  eyebrow,
  apiPath,
  columns,
  fields,
  emptyState,
  onTransformCreate,
  onTransformUpdate,
  onBeforeDelete,
}: {
  title: string;
  lead: string;
  eyebrow: string;
  apiPath: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  emptyState: string;
  onTransformCreate?: (data: Record<string, unknown>) => Record<string, unknown>;
  onTransformUpdate?: (data: Record<string, unknown>) => Record<string, unknown>;
  onBeforeDelete?: (item: Record<string, unknown>) => boolean;
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [view, setView] = useState<ViewState>('list');
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchItems = useCallback(async () => {
    setPageState('loading');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/v1/${apiPath}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data.items ?? json.data[apiPath] ?? []);
        setPageState('ready');
      } else {
        setErrorMessage(json.error?.message ?? `Gagal memuat data.`);
        setPageState('error');
      }
    } catch {
      setErrorMessage('Gagal terhubung ke server.');
      setPageState('error');
    }
  }, [apiPath]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() { setSelected(null); setView('create'); }
  function openEdit(item: Record<string, unknown>) { setSelected(item); setView('edit'); }
  function backToList() { setSelected(null); setView('list'); fetchItems(); }

  async function handleDelete(item: Record<string, unknown>) {
    if (onBeforeDelete && !onBeforeDelete(item)) return;
    if (!confirm(`Hapus item ini?`)) return;
    try {
      const res = await fetch(`/api/v1/${apiPath}/${item.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Berhasil dihapus.');
        fetchItems();
      } else {
        toast.error(json.error?.message ?? 'Gagal menghapus.');
      }
    } catch {
      toast.error('Gagal terhubung ke server.');
    }
  }

  if (pageState === 'loading') {
    return (
      <section className="screenPanel">
        <div className="featureHero">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="sectionTitle">{title}</h2>
            <p className="sectionLead">Memuat data...</p>
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
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="sectionTitle">{title}</h2>
            <p className="sectionLead" style={{ color: 'var(--color-danger)' }}>{errorMessage}</p>
          </div>
          <div className="heroActions">
            <button className="filterChip" onClick={fetchItems}>Coba Lagi</button>
          </div>
        </div>
      </section>
    );
  }

  if (view === 'create' || view === 'edit') {
    return (
      <CrudForm
        title={title}
        eyebrow={eyebrow}
        apiPath={apiPath}
        fields={fields}
        initial={view === 'edit' ? selected : null}
        onSave={backToList}
        onCancel={backToList}
        onTransformCreate={onTransformCreate}
        onTransformUpdate={onTransformUpdate}
      />
    );
  }

  return (
    <section className="screenPanel">
      <div className="featureHero">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="sectionTitle">{title}</h2>
          <p className="sectionLead">{lead}</p>
        </div>
        <div className="heroActions">
          <button className="primaryButton" onClick={openCreate}>+ Tambah</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="emptyCell">{emptyState}</div>
      ) : (
        <section className="panel">
          <div className="tableShell">
            <table className="dataTable">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} scope="col" className={col.align === 'right' ? 'alignRight' : ''}>
                      {col.label}
                    </th>
                  ))}
                  <th scope="col" className="alignRight">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={String(item.id)}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.align === 'right' ? 'alignRight' : ''}>
                        {col.render(item)}
                      </td>
                    ))}
                    <td className="alignRight">
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="filterChip" onClick={() => openEdit(item)}>Edit</button>
                        <button className="filterChip" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(item)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}

function CrudForm({
  title,
  eyebrow,
  apiPath,
  fields,
  initial,
  onSave,
  onCancel,
  onTransformCreate,
  onTransformUpdate,
}: {
  title: string;
  eyebrow: string;
  apiPath: string;
  fields: FieldDef[];
  initial: Record<string, unknown> | null;
  onSave: () => void;
  onCancel: () => void;
  onTransformCreate?: (data: Record<string, unknown>) => Record<string, unknown>;
  onTransformUpdate?: (data: Record<string, unknown>) => Record<string, unknown>;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    for (const field of fields) {
      initialData[field.key] = initial ? String((initial as Record<string, unknown>)[field.key] ?? '') : '';
    }
    return initialData;
  });
  const [saving, setSaving] = useState(false);

  function setValue(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const field of fields) {
      if (field.required && !formData[field.key]?.trim()) {
        toast.error(`${field.label} wajib diisi.`);
        return;
      }
    }

    setSaving(true);
    try {
      let payload: Record<string, unknown> = { ...formData };
      if (fields.some(f => f.type === 'number')) {
        for (const f of fields) {
          if (f.type === 'number') payload[f.key] = Number(payload[f.key]);
        }
      }
      if (initial && onTransformUpdate) payload = onTransformUpdate(payload);
      if (!initial && onTransformCreate) payload = onTransformCreate(payload);

      const url = initial ? `/api/v1/${apiPath}/${(initial as { id: string }).id}` : `/api/v1/${apiPath}`;
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(initial ? 'Berhasil diperbarui.' : 'Berhasil dibuat.');
        onSave();
      } else {
        toast.error(json.error?.message ?? 'Gagal menyimpan.');
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
          <p className="eyebrow">{initial ? `Edit ${eyebrow}` : `${eyebrow} Baru`}</p>
          <h2 className="sectionTitle">{initial ? `Edit: ${initial.name ?? title}` : `Tambah ${title}`}</h2>
          <p className="sectionLead">{initial ? 'Ubah data pada form di bawah.' : 'Isi data pada form di bawah.'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="screenPanel" style={{ gap: 20 }}>
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h3 className="panelTitle">Form Data</h3>
            </div>
          </div>
          <div className="panelBody" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map((field) => (
              <label key={field.key} className="field">
                <span>{field.label}{field.required ? ' *' : ''}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.label}
                    disabled={field.disabled}
                    aria-label={field.label}
                    rows={3}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', fontFamily: 'inherit' }}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    disabled={field.disabled}
                    aria-label={field.label}
                  >
                    <option value="">Pilih {field.label}...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={field.label}
                    disabled={field.disabled}
                    aria-label={field.label}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
        <div className="heroActions">
          <button type="submit" className="primaryButton" disabled={saving}>
            {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Buat'}
          </button>
          <button type="button" className="filterChip" onClick={onCancel} disabled={saving}>
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}
