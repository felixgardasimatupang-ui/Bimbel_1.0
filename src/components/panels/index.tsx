import type { ScreenSummary } from '@/lib/screens';
import { DashboardPanel } from './dashboard';
import { FinancePanel } from './finance';
import { SchedulePanel } from './schedule';
import { PayrollPanel } from './payroll';
import { AttendancePanel } from './attendance';
import { LmsPanel } from './lms';
import { MaterialPanel } from './material';
import { CrmPanel } from './crm';
import { ProgressPanel } from './progress';
import { ChatPanel } from './chat';
import { RoleManagementPanel } from './role-management';

export function ScreenPanel({ screen }: { screen: ScreenSummary }) {
  switch (screen.kind) {
    case 'dashboard':
      return <DashboardPanel />;
    case 'finance':
      return <FinancePanel />;
    case 'schedule':
      return <SchedulePanel />;
    case 'payroll':
      return <PayrollPanel />;
    case 'attendance':
      return <AttendancePanel />;
    case 'lms':
      return <LmsPanel />;
    case 'material':
      return <MaterialPanel />;
    case 'crm':
      return <CrmPanel />;
    case 'progress':
      return <ProgressPanel />;
    case 'chat':
      return <ChatPanel />;
    case 'role-management':
      return <RoleManagementPanel />;
    default:
      return null;
  }
}

export { DashboardPanel } from './dashboard';
export { FinancePanel } from './finance';
export { SchedulePanel } from './schedule';
export { PayrollPanel } from './payroll';
export { AttendancePanel } from './attendance';
export { LmsPanel } from './lms';
export { MaterialPanel } from './material';
export { CrmPanel } from './crm';
export { ProgressPanel } from './progress';
export { ChatPanel } from './chat';
export { RoleManagementPanel } from './role-management';

export { CrudPanel } from './crud';
export type { FieldDef } from './crud';
export type { Tone } from './shared';
export { MetricCard, SectionCard, Badge, DataTable, SimpleList, ProgressBars, Timeline, CardGrid } from './shared';
