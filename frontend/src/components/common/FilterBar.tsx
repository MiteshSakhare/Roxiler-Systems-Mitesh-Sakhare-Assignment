import React from 'react';

interface FilterField {
  key: string;
  label: string;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function FilterBar({ fields, values, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {fields.map((field) => (
        <div key={field.key} className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-surface-700 mb-1">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="">All</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={`Filter by ${field.label.toLowerCase()}...`}
              className="input-field text-sm py-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}
