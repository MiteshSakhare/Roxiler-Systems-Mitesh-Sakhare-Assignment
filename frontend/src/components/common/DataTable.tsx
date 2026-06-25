import React, { useState } from 'react';
import { UnfoldMore, ArrowUpward, ArrowDownward } from '@mui/icons-material';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

function DataTable<T extends Record<string, any>>({ columns, data, onSort }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);
    if (onSort) onSort(key, direction);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-light)]">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className="py-4 px-6 text-sm font-bold text-[var(--color-text-main)] cursor-pointer hover:bg-[var(--color-border)]/50 transition-colors tracking-wide border-b border-[var(--color-border)]"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center justify-between">
                  <span>{col.header}</span>
                  <span className="text-[var(--color-text-muted)] flex items-center ml-2">
                    {sortKey === col.key ? 
                      (sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) 
                      : <UnfoldMore fontSize="small" className="opacity-50 hover:opacity-100 transition-opacity" />}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-[var(--color-bg-light)] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-4 px-6 text-sm text-[var(--color-text-main)]">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-[var(--color-text-muted)] text-sm">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
