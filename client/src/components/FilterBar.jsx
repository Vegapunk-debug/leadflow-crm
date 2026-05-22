import React from 'react';
import { STATUS_FILTERS } from '../utils/status';

export default function FilterBar({ active, onChange, counts }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Filter leads by status">
      {STATUS_FILTERS.map((status) => {
        const count = counts[status] ?? 0;
        const isActive = active === status;
        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-chip${isActive ? ' active' : ''}`}
            onClick={() => onChange(status)}
          >
            {status}
            <span className="filter-chip-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
