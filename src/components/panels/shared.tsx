import type { ReactNode } from 'react';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function toneClass(tone: Tone = 'neutral') {
  switch (tone) {
    case 'success':
      return 'toneSuccess';
    case 'warning':
      return 'toneWarning';
    case 'danger':
      return 'toneDanger';
    case 'info':
      return 'toneInfo';
    default:
      return 'toneNeutral';
  }
}

export function MetricCard({ label, value, note, tone = 'neutral' }: { label: string; value: string; note: string; tone?: Tone }) {
  return (
    <article className="metricCard">
      <span className="metricLabel">{label}</span>
      <strong className={`metricValue ${toneClass(tone)}`}>{value}</strong>
      <p className="metricNote">{note}</p>
    </article>
  );
}

export function SectionCard({ title, lead, children, actions, className }: {
  title: string;
  lead?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className ?? ''}`.trim()}>
      <div className="panelHeader">
        <div>
          <h3 className="panelTitle">{title}</h3>
          {lead ? <p className="panelLead">{lead}</p> : null}
        </div>
        {actions ? <div className="panelActions">{actions}</div> : null}
      </div>
      <div className="panelBody">{children}</div>
    </section>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge ${toneClass(tone)}`.trim()}>{children}</span>;
}

export function DataTable({ columns, rows }: {
  columns: Array<{ label: string; align?: 'left' | 'right' }>;
  rows: Array<{ key: string; cells: ReactNode[] }>;
}) {
  return (
    <div className="tableShell">
      <table className="dataTable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={column.align === 'right' ? 'alignRight' : undefined}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td key={`${row.key}-${index}`} className={columns[index]?.align === 'right' ? 'alignRight' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SimpleList({ items }: {
  items: Array<{ title: string; meta: string; tone?: Tone; extra?: string }>;
}) {
  return (
    <ul className="simpleList">
      {items.map((item) => (
        <li key={`${item.title}-${item.meta}`} className="listRow">
          <div>
            <strong>{item.title}</strong>
            <p>{item.meta}</p>
          </div>
          <div className="listRowMeta">
            <span className={`toneDot ${toneClass(item.tone ?? 'neutral')}`} aria-hidden="true" />
            {item.extra ? <span>{item.extra}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProgressBars({ items }: {
  items: Array<{ label: string; value: number; tone: Tone }>;
}) {
  return (
    <div className="progressStack">
      {items.map((item) => (
        <div key={item.label} className="progressRow">
          <div className="progressHeading">
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="progressTrack" aria-hidden="true">
            <div className={`progressFill ${toneClass(item.tone)}`} style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ items }: {
  items: Array<{ title: string; meta: string; time: string; tone?: Tone }>;
}) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article key={`${item.title}-${item.time}`} className="timelineItem">
          <div className="timelineDot" />
          <div className="timelineBody">
            <div className="timelineHeader">
              <strong>{item.title}</strong>
              <Badge tone={item.tone ?? 'info'}>{item.time}</Badge>
            </div>
            <p>{item.meta}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CardGrid({ items, columns = 2 }: {
  items: Array<{ title: string; meta: string; badge: string; tone?: Tone }>;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className={`cardGrid cardGrid${columns}`}>
      {items.map((item) => (
        <article key={`${item.title}-${item.badge}`} className="miniCard">
          <Badge tone={item.tone ?? 'neutral'}>{item.badge}</Badge>
          <strong>{item.title}</strong>
          <p>{item.meta}</p>
        </article>
      ))}
    </div>
  );
}
