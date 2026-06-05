'use client';

import { useMemo, useState } from 'react';

type Column<T> = {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'right';
  sortable?: boolean;
};

type DataGridProps<T> = {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
};

export function DataGrid<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Cari...',
  onRowClick
}: DataGridProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize);

  return (
    <div>
      {searchable && (
        <div className="filterBar" style={{ marginBottom: '14px' }}>
          <input
            type="text"
            className="field"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            style={{
              minHeight: '42px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--text)',
              padding: '0 14px',
              outline: 'none',
              width: '100%',
              maxWidth: '340px'
            }}
          />
        </div>
      )}

      <div className="tableShell">
        <table className="dataTable">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.align === 'right' ? 'alignRight' : undefined} scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr
                  key={(item.id as string) ?? idx}
                  onClick={() => onRowClick?.(item)}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={col.align === 'right' ? 'alignRight' : undefined}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)} dari {filtered.length}
          </span>
          <div className="filterBar">
            <button
              type="button"
              className="filterChip"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Sebelumnya
            </button>
            <button
              type="button"
              className="filterChip"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
