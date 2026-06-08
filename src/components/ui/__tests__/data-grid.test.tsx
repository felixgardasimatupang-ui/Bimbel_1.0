// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DataGrid } from '@/components/ui/data-grid';

afterEach(() => {
  cleanup();
});

interface TestItem extends Record<string, unknown> {
  id: string;
  name: string;
  age: number;
}

const testColumns = [
  { key: 'name', label: 'Nama', render: (item: TestItem) => item.name },
  { key: 'age', label: 'Umur', render: (item: TestItem) => String(item.age), align: 'right' as const }
];

const testData: TestItem[] = [
  { id: '1', name: 'Alice', age: 25 },
  { id: '2', name: 'Bob', age: 30 },
  { id: '3', name: 'Charlie', age: 35 }
];

describe('DataGrid', () => {
  it('renders column headers', () => {
    render(<DataGrid columns={testColumns} data={testData} />);
    expect(screen.getByText('Nama')).toBeInTheDocument();
    expect(screen.getByText('Umur')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<DataGrid columns={testColumns} data={testData} />);
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<DataGrid columns={testColumns} data={[]} />);
    expect(screen.getByText('Tidak ada data ditemukan.')).toBeInTheDocument();
  });

  it('renders search input when searchable is true', () => {
    render(<DataGrid columns={testColumns} data={testData} searchable={true} />);
    expect(screen.getByPlaceholderText('Cari...')).toBeInTheDocument();
  });

  it('hides search input when searchable is false', () => {
    render(<DataGrid columns={testColumns} data={testData} searchable={false} />);
    expect(screen.queryByPlaceholderText('Cari...')).not.toBeInTheDocument();
  });

  it('shows pagination when data exceeds page size', () => {
    const manyItems: TestItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + i
    }));
    render(<DataGrid columns={testColumns} data={manyItems} pageSize={10} />);
    expect(screen.getByText('1–10 dari 15')).toBeInTheDocument();
    expect(screen.getByText('Berikutnya')).toBeInTheDocument();
  });
});
