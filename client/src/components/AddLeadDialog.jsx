import React, { useEffect, useState } from 'react';
import { STATUSES } from '../utils/status';

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

export default function AddLeadDialog({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        status,
      });
    } catch (err) {
      setError(err.message || 'Could not create lead');
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-block">
            <h2 className="modal-title">Add new lead</h2>
            <div className="modal-subtitle">
              Capture the basics — you can log discussions later.
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="field">
              <label className="field-label" htmlFor="lead-name">
                Full name<span className="required">*</span>
              </label>
              <input
                id="lead-name"
                className="input"
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                disabled={saving}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="lead-company">
                  Company<span className="optional">(optional)</span>
                </label>
                <input
                  id="lead-company"
                  className="input"
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="lead-phone">
                  Phone<span className="optional">(optional)</span>
                </label>
                <input
                  id="lead-phone"
                  className="input"
                  type="tel"
                  placeholder="+1 555 0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="lead-status">
                Status
              </label>
              <select
                id="lead-status"
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {error ? <div className="form-error">{error}</div> : null}
          </div>

          <div className="modal-footer">
            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving || !name.trim()}
              >
                {saving ? 'Creating…' : 'Create lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
