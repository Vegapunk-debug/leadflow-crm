import React from 'react';
import LeadCard from './LeadCard';

function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 17v5"></path>
      <path d="M9 10.76V6l-2-1V3h10v2l-2 1v4.76a4 4 0 0 0 1.5 3.12l1 .8a1 1 0 0 1 .5.87V16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-.45a1 1 0 0 1 .5-.87l1-.8a4 4 0 0 0 1.5-3.12Z"></path>
    </svg>
  );
}

export default function LeadList({ pinned, all, loading, onSelect }) {
  if (loading) {
    return (
      <div className="lead-list">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  if (!pinned.length && !all.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No leads match</div>
        <div className="empty-state-body">
          Clear the filter or add a new lead to get started.
        </div>
      </div>
    );
  }

  return (
    <>
      {pinned.length > 0 ? (
        <>
          <div className="section-head pinned">
            <PinIcon />
            Today's follow-ups
            <span className="section-head-count">[{String(pinned.length).padStart(2, '0')}]</span>
            <span className="section-head-divider" />
          </div>
          <div className="lead-list" style={{ marginBottom: 6 }}>
            {pinned.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onClick={onSelect}
                pinned
              />
            ))}
          </div>
        </>
      ) : null}

      {all.length > 0 ? (
        <>
          <div className="section-head">
            All leads
            <span className="section-head-count">[{String(all.length).padStart(2, '0')}]</span>
            <span className="section-head-divider" />
          </div>
          <div className="lead-list">
            {all.map((lead) => (
              <LeadCard key={lead._id} lead={lead} onClick={onSelect} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
