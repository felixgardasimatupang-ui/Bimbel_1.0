// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MetricCard, SectionCard, Badge, DataTable } from '@/components/panels/shared';

afterEach(() => {
  cleanup();
});

describe('shared panel components', () => {
  describe('MetricCard', () => {
    it('renders label, value, and note', () => {
      render(<MetricCard label="Revenue" value="Rp 100M" note="+10% growth" />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Rp 100M')).toBeInTheDocument();
      expect(screen.getByText('+10% growth')).toBeInTheDocument();
    });
  });

  describe('SectionCard', () => {
    it('renders title and children', () => {
      render(<SectionCard title="Test Section"><p>Content</p></SectionCard>);
      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders lead text when provided', () => {
      render(<SectionCard title="Test" lead="Lead text"><p>Content</p></SectionCard>);
      expect(screen.getByText('Lead text')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders children', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('DataTable', () => {
    it('renders columns and rows', () => {
      const columns = [{ label: 'Name' }, { label: 'Age', align: 'right' as const }];
      const rows = [
        { key: '1', cells: ['Alice', '25'] },
        { key: '2', cells: ['Bob', '30'] }
      ];
      render(<DataTable columns={columns} rows={rows} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });
});
