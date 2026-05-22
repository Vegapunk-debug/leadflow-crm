import React, { useMemo } from 'react';
import { isToday, isOverdue } from '../utils/time';

function UsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export default function KpiStrip({ leads }) {
  const stats = useMemo(() => {
    let total = 0;
    let today = 0;
    let overdue = 0;
    let won = 0;
    for (const l of leads) {
      total += 1;
      if (l.followUp && isToday(l.followUp)) today += 1;
      else if (l.followUp && isOverdue(l.followUp)) overdue += 1;
      if (l.status === 'Won') won += 1;
    }
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
    return { total, today, overdue, won, winRate };
  }, [leads]);

  return (
    <section className="kpi-strip" aria-label="Pipeline metrics">
      <div className="kpi-tile">
        <div className="kpi-header">
          <span className="kpi-label">Pipeline</span>
          <span className="kpi-icon"><UsersIcon /></span>
        </div>
        <div className="kpi-value">
          {String(stats.total).padStart(2, '0')}
          <span className="kpi-value-suffix">total leads</span>
        </div>
      </div>

      <div className="kpi-tile tone-warning">
        <div className="kpi-header">
          <span className="kpi-label">Today</span>
          <span className="kpi-icon"><BellIcon /></span>
        </div>
        <div className="kpi-value">
          {String(stats.today).padStart(2, '0')}
          <span className="kpi-value-suffix">follow-ups</span>
        </div>
      </div>

      <div className="kpi-tile tone-danger">
        <div className="kpi-header">
          <span className="kpi-label">Overdue</span>
          <span className="kpi-icon"><AlertIcon /></span>
        </div>
        <div className="kpi-value">
          {String(stats.overdue).padStart(2, '0')}
          <span className="kpi-value-suffix">need attention</span>
        </div>
      </div>

      <div className="kpi-tile tone-accent">
        <div className="kpi-header">
          <span className="kpi-label">Won</span>
          <span className="kpi-icon"><TrophyIcon /></span>
        </div>
        <div className="kpi-value">
          {String(stats.won).padStart(2, '0')}
          <span className="kpi-value-suffix">{stats.winRate}% rate</span>
        </div>
      </div>
    </section>
  );
}
