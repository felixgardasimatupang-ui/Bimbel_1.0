// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { FinancePanel } from '@/components/panels/finance';
import { SchedulePanel } from '@/components/panels/schedule';
import { PayrollPanel } from '@/components/panels/payroll';
import { AttendancePanel } from '@/components/panels/attendance';
import { LmsPanel } from '@/components/panels/lms';
import { MaterialPanel } from '@/components/panels/material';
import { CrmPanel } from '@/components/panels/crm';
import { ProgressPanel } from '@/components/panels/progress';
import { ChatPanel } from '@/components/panels/chat';
import { RoleManagementPanel } from '@/components/panels/role-management';
import { ScreenPanel } from '@/components/panels/index';
import type { ScreenSummary } from '@/lib/screens';

function bySubstr(text: string) {
  return (content: string) => content.includes(text);
}

beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve(new Response(JSON.stringify({ success: true, data: { items: [] } }), { status: 200 }))
  ) as unknown as typeof global.fetch;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('FinancePanel', () => {
  it('renders section title', async () => {
    render(<FinancePanel />);
    await waitFor(() => expect(screen.getByText('Penagihan & Keuangan')).toBeInTheDocument());
  });
});

describe('SchedulePanel', () => {
  it('renders schedule header', async () => {
    render(<SchedulePanel />);
    await waitFor(() => expect(screen.getByText('Jadwal Akademik')).toBeInTheDocument());
  });
});

describe('PayrollPanel', () => {
  it('renders payroll header', async () => {
    render(<PayrollPanel />);
    await waitFor(() => expect(screen.getByText('Manajemen Penggajian')).toBeInTheDocument());
  });
});

describe('AttendancePanel', () => {
  it('renders attendance header', async () => {
    render(<AttendancePanel />);
    await waitFor(() => expect(screen.getByText('Sistem Absensi')).toBeInTheDocument());
  });
});

describe('LmsPanel', () => {
  it('renders lms header', async () => {
    render(<LmsPanel />);
    await waitFor(() => expect(screen.getByText('LMS & Materi Pembelajaran')).toBeInTheDocument());
  });
});

describe('MaterialPanel', () => {
  it('renders material header', async () => {
    render(<MaterialPanel />);
    await waitFor(() => expect(screen.getByText('Detail Materi Pembelajaran')).toBeInTheDocument());
  });
});

describe('CrmPanel', () => {
  it('renders CRM header', async () => {
    render(<CrmPanel />);
    await waitFor(() => expect(screen.getByText('Manajemen Siswa CRM')).toBeInTheDocument());
  });
});

describe('ProgressPanel', () => {
  it('renders progress header', async () => {
    render(<ProgressPanel />);
    await waitFor(() => expect(screen.getByText('Laporan Progres Belajar')).toBeInTheDocument());
  });
});

describe('ChatPanel', () => {
  it('renders chat messages and presence', () => {
    render(<ChatPanel />);
    expect(screen.getByText(bySubstr('Percakapan realtime'))).toBeInTheDocument();
    expect(screen.getByText(bySubstr('Panel kehadiran'))).toBeInTheDocument();
    expect(screen.getByText(bySubstr('Tulis balasan'))).toBeInTheDocument();
  });
});

describe('RoleManagementPanel', () => {
  it('renders role management header', async () => {
    render(<RoleManagementPanel />);
    // RoleManagementPanel doesn't use CrudPanel, it will try to fetch
    await waitFor(() => {
      expect(screen.getByText('Manajemen Role')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('ScreenPanel (index.tsx)', () => {
  const mockScreen = (kind: string): ScreenSummary => ({
    slug: kind,
    index: '0',
    title: kind,
    subtitle: '',
    category: 'Operasional',
    kind: kind as ScreenSummary['kind'],
  });

  it('renders DashboardPanel for dashboard kind', () => {
    render(<ScreenPanel screen={mockScreen('dashboard')} />);
    expect(screen.getByText(bySubstr('Prioritas hari ini'))).toBeInTheDocument();
  });

  it('renders FinancePanel for finance kind', async () => {
    render(<ScreenPanel screen={mockScreen('finance')} />);
    await waitFor(() => expect(screen.getByText(bySubstr('Penagihan & Keuangan'))).toBeInTheDocument());
  });

  it('renders SchedulePanel for schedule kind', async () => {
    render(<ScreenPanel screen={mockScreen('schedule')} />);
    await waitFor(() => expect(screen.getByText(bySubstr('Jadwal Akademik'))).toBeInTheDocument());
  });

  it('renders null for unknown kind', () => {
    const { container } = render(<ScreenPanel screen={mockScreen('unknown') as unknown as ScreenSummary} />);
    expect(container.innerHTML).toBe('');
  });
});
