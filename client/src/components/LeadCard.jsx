import React from 'react';
import { statusClass } from '../utils/status';
import {
  timeAgo,
  formatFollowUp,
  isToday,
  isOverdue,
} from '../utils/time';

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    </svg>
  );
}

function getInitials(name) {
  if (!name) return '·';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarTone(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return (h % 6) + 1;
}

export default function LeadCard({ lead, onClick, pinned = false }) {
  const lastDiscussion = lead.discussions?.[0];
  const lastNote = lastDiscussion?.note;
  const lastTime = lastDiscussion?.createdAt || lead.updatedAt;

  const overdue = isOverdue(lead.followUp);
  const today = isToday(lead.followUp);

  let followClass = 'lead-followup';
  if (overdue) followClass += ' overdue';
  else if (today) followClass += ' today';

  let cardClass = 'lead-card';
  if (pinned) cardClass += ' pinned';
  else if (overdue) cardClass += ' overdue';

  return (
    <button
      type="button"
      className={cardClass}
      onClick={() => onClick(lead)}
      aria-label={`Open ${lead.name}'s timeline`}
    >
      <span
        className={`lead-avatar tone-${avatarTone(lead.name)}`}
        aria-hidden="true"
      >
        {getInitials(lead.name)}
      </span>

      <div className="lead-card-main">
        <div className="lead-card-row">
          <span className="lead-name">{lead.name}</span>
          {lead.company ? (
            <span className="lead-company">{lead.company}</span>
          ) : null}
        </div>

        <div className="lead-note">
          {lastNote ? lastNote : <span className="lead-note-empty">— no discussions yet</span>}
        </div>

        <div className="lead-meta">
          {lastTime ? (
            <span className="lead-meta-item">
              <ClockIcon />
              {timeAgo(lastTime)}
            </span>
          ) : null}
          {lead.followUp ? (
            <span className={followClass}>
              <BellIcon />
              {overdue ? 'Overdue · ' : ''}
              {formatFollowUp(lead.followUp)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="lead-card-side">
        <span className={`status-badge ${statusClass(lead.status)}`}>
          {lead.status}
        </span>
      </div>
    </button>
  );
}
