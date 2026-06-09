import Link from 'next/link';
import type { ReactNode } from 'react';

import { joinClasses } from '@/lib/join-classes';
import { screens, type ScreenSummary } from '@/lib/screens';

type AppShellProps = {
  activeSlug?: string;
  title: string;
  description: string;
  children: ReactNode;
  currentScreen?: ScreenSummary;
};

export function AppShell({ activeSlug, title, description, children, currentScreen }: AppShellProps) {
  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Navigasi layar">
        <div className="brandBlock">
          <div className="brandMark" aria-hidden="true">
            B1
          </div>
          <div>
            <p className="brandKicker">Bimbel One Platform</p>
            <h1 className="brandTitle">Bimbel One Platform</h1>
            <p className="brandText">Solusi manajemen bimbel yang lengkap dan terintegrasi.</p>
          </div>
        </div>

        <div className="sidebarSection">
          <p className="sidebarLabel">Layar</p>
          <nav className="navList">
            {screens.map((screen) => (
              <Link
                key={screen.slug}
                href={`/screens/${screen.slug}`}
                className={joinClasses('navItem', screen.slug === activeSlug && 'navItemActive')}
                aria-current={screen.slug === activeSlug ? 'page' : undefined}
              >
                <span className="navText">
                  <strong>{screen.title}</strong>
                  <span>{screen.category}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Bimbel One Platform</p>
            <h2 className="pageTitle">{title}</h2>
            <p className="pageLead">{description}</p>
          </div>

          <div className="topbarMeta">
            <Link className="metaPill" href="/login">
              Masuk
            </Link>
            <Link className="metaPill" href="/branches">
              Cabang
            </Link>
            <Link className="metaPill" href="/production">
              Produksi
            </Link>
            <span className="metaPill">Multi-cabang</span>
            <span className="metaPill">Platform terpadu</span>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
