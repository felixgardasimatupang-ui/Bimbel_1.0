'use client';

import { useMemo, useState } from 'react';

import type { BranchDirectoryEntry } from '@/lib/branch-directory';

type BranchBrowserProps = {
  branches: BranchDirectoryEntry[];
};

const filters = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'inactive', label: 'Nonaktif' }
] as const;

export function BranchBrowser({ branches }: BranchBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]['key']>('all');
  const [activeBranchCode, setActiveBranchCode] = useState(branches[0]?.code ?? '');

  const visibleBranches = useMemo(() => {
    if (activeFilter === 'all') {
      return branches;
    }

    return branches.filter((branch) => branch.status === activeFilter);
  }, [activeFilter, branches]);

  const activeBranch = visibleBranches.find((branch) => branch.code === activeBranchCode) ?? visibleBranches[0];

  return (
    <div className="branchBrowser">
      <div className="filterBar" role="tablist" aria-label="Filter cabang">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={filter.key === activeFilter ? 'filterChip isActive' : 'filterChip'}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="branchLayout">
        <div className="branchList">
          {visibleBranches.map((branch) => (
            <button
              key={branch.id}
              type="button"
              className={branch.code === activeBranch?.code ? 'branchCard isActive' : 'branchCard'}
              onClick={() => setActiveBranchCode(branch.code)}
            >
              <div className="branchCardHead">
                <strong>{branch.name}</strong>
                <span className={branch.status === 'active' ? 'statusPill statusActive' : 'statusPill statusInactive'}>
                  {branch.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p>{branch.address}</p>
              <span>{branch.code} · {branch.timezone}</span>
            </button>
          ))}
        </div>

        <aside className="branchDetail">
          <p className="eyebrow">Cabang terpilih</p>
          <h3 className="panelTitle">{activeBranch?.name ?? 'Tidak ada cabang'}</h3>
          <p className="sectionLead">
            {activeBranch
              ? 'Detail cabang ini bisa dipakai untuk memahami scope data dan isolasi tenant.'
              : 'Pilih cabang untuk melihat detail.'}
          </p>

          {activeBranch ? (
            <dl className="detailList">
              <div>
                <dt>Kode</dt>
                <dd>{activeBranch.code}</dd>
              </div>
              <div>
                <dt>Zona waktu</dt>
                <dd>{activeBranch.timezone}</dd>
              </div>
              <div>
                <dt>Kontak</dt>
                <dd>{activeBranch.phone}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{activeBranch.email}</dd>
              </div>
            </dl>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
