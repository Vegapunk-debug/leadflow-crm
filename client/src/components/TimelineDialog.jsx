import React, { useEffect, useRef, useState } from 'react';
import { STATUSES, statusClass } from '../utils/status';
import {
  formatTimestamp,
  timeAgo,
  formatFollowUp,
  toDatetimeLocalValue,
} from '../utils/time';

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12"></path>
    </svg>
  );
}

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"></path>
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

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18"></path>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

function defaultFollowUpValue() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return toDatetimeLocalValue(d);
}

export default function TimelineDialog({
  lead,
  onClose,
  onStatusChange,
  onAddDiscussion,
  onDeleteLead,
}) {
  const [note, setNote] = useState('');
  const [hasFollowUp, setHasFollowUp] = useState(false);
  const [followUpValue, setFollowUpValue] = useState(defaultFollowUpValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!lead) return null;

  const discussions = lead.discussions || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) {
      setError('Please write a note before saving.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAddDiscussion({
        note: trimmed,
        followUp: hasFollowUp && followUpValue ? new Date(followUpValue).toISOString() : null,
      });
      setNote('');
      setHasFollowUp(false);
      setFollowUpValue(defaultFollowUpValue());
      textareaRef.current?.focus();
    } catch (err) {
      setError(err.message || 'Could not save discussion');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!onDeleteLead) return;
    const ok = window.confirm(`Delete lead "${lead.name}"? This removes all discussion history.`);
    if (ok) onDeleteLead(lead);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 className="modal-title">
              {lead.name}
              {lead.company ? (
                <span className="modal-title-company">{lead.company}</span>
              ) : null}
            </h2>
            <div className="modal-subtitle">
              {lead.phone ? (
                <span className="lead-meta-item">
                  <PhoneIcon /> {lead.phone}
                </span>
              ) : null}
              <span className="status-select-wrap">
                <select
                  className={`status-select ${statusClass(lead.status)}`}
                  value={lead.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  aria-label="Update status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </span>
              {lead.followUp ? (
                <span className="lead-followup">
                  <BellIcon />
                  {formatFollowUp(lead.followUp)}
                </span>
              ) : null}
            </div>
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          {discussions.length === 0 ? (
            <div className="timeline-empty">
              No discussions yet — log the first one below.
            </div>
          ) : (
            <div className="timeline">
              {discussions.map((d) => (
                <div className="timeline-item" key={d._id}>
                  <span className="timeline-dot" />
                  <div className="timeline-meta">
                    <span className="timeline-meta-time">
                      {formatTimestamp(d.createdAt)}
                    </span>
                    <span>·</span>
                    <span>{timeAgo(d.createdAt)}</span>
                  </div>
                  <div className="timeline-note">{d.note}</div>
                  {d.followUp ? (
                    <span className="timeline-followup">
                      <BellIcon /> Follow-up: {formatFollowUp(d.followUp)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="modal-footer" onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 10 }}>
            <textarea
              ref={textareaRef}
              className="textarea"
              placeholder="Log a new discussion…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              disabled={saving}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={hasFollowUp}
                onChange={(e) => setHasFollowUp(e.target.checked)}
                disabled={saving}
              />
              Set follow-up
              {hasFollowUp ? (
                <input
                  type="datetime-local"
                  className="input"
                  style={{ width: 'auto', padding: '6px 10px', marginLeft: 6 }}
                  value={followUpValue}
                  onChange={(e) => setFollowUpValue(e.target.value)}
                  disabled={saving}
                />
              ) : null}
            </label>

            <div className="form-actions">
              {onDeleteLead ? (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={saving}
                  title="Delete lead"
                >
                  <TrashIcon /> Delete
                </button>
              ) : null}
              <button
                type="submit"
                className="btn-primary"
                disabled={saving || !note.trim()}
              >
                {saving ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>
          {error ? <div className="form-error">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
