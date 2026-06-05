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
import { HelpdeskPanel } from './helpdesk';
import { TicketPanel } from './ticket';
import { ChatPanel } from './chat';
import { NotificationComposePanel } from './notification-compose';
import { TemplatePanel } from './template';
import { BroadcastPanel } from './broadcast';
import { WhatsAppPanel } from './whatsapp';

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
    case 'helpdesk':
      return <HelpdeskPanel />;
    case 'ticket':
      return <TicketPanel />;
    case 'chat':
      return <ChatPanel />;
    case 'notification-compose':
      return <NotificationComposePanel />;
    case 'notification-template':
      return <TemplatePanel />;
    case 'broadcast':
      return <BroadcastPanel />;
    case 'whatsapp':
      return <WhatsAppPanel />;
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
export { HelpdeskPanel } from './helpdesk';
export { TicketPanel } from './ticket';
export { ChatPanel } from './chat';
export { NotificationComposePanel } from './notification-compose';
export { TemplatePanel } from './template';
export { BroadcastPanel } from './broadcast';
export { WhatsAppPanel } from './whatsapp';

export type { Tone } from './shared';
export { MetricCard, SectionCard, Badge, DataTable, SimpleList, ProgressBars, Timeline, CardGrid } from './shared';
