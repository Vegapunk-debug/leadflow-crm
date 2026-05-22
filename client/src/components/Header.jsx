import React from 'react';

function SearchIcon() {

  return (
    <svg
      className="search-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m20 20-3.5-3.5"></path>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14"></path>
    </svg>
  );
}

export default function Header({ search, onSearchChange, onAddLead }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">L</span>
        <span className="brand-name">LeadFlow</span>
        <span className="brand-suffix">Pipeline</span>
      </div>

      <div className="search-wrap">
        <SearchIcon />
        <input
          className="search-input"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads…"
          aria-label="Search leads"
        />
      </div>

      <button className="btn-primary" onClick={onAddLead} type="button">
        <PlusIcon />
        New lead
      </button>
    </header>
  );
}
