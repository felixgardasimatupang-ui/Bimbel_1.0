// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DashboardPanel } from '@/components/panels/dashboard';

function bySubstr(text: string) {
  return (content: string) => content.includes(text);
}

afterEach(() => {
  cleanup();
});

describe('DashboardPanel', () => {
  it('renders section title', () => {
    render(<DashboardPanel />);
    expect(screen.getByText(bySubstr('Prioritas hari ini'))).toBeInTheDocument();
  });

  it('renders metric cards with values', () => {
    render(<DashboardPanel />);
    expect(screen.getByText(bySubstr('Pendapatan total'))).toBeInTheDocument();
    expect(screen.getByText('Rp 124,5M')).toBeInTheDocument();
    expect(screen.getByText(bySubstr('Siswa aktif'))).toBeInTheDocument();
    expect(screen.getByText('842')).toBeInTheDocument();
  });

  it('renders priority list items', () => {
    render(<DashboardPanel />);
    expect(screen.getByText('Tinjau cabang Bandung')).toBeInTheDocument();
    expect(screen.getByText('Setujui batch payroll')).toBeInTheDocument();
  });

  it('renders branch health section', () => {
    render(<DashboardPanel />);
    expect(screen.getAllByText(bySubstr('Kesehatan cabang')).length).toBeGreaterThan(0);
    expect(screen.getByText('Jakarta Selatan')).toBeInTheDocument();
    expect(screen.getAllByText(bySubstr('Bandung')).length).toBeGreaterThan(0);
    expect(screen.getByText('Surabaya')).toBeInTheDocument();
  });
});
