const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!res.ok) {
    const message = (payload && payload.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return payload;
}

export const api = {
  listLeads: ({ status, search } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (search && search.trim()) params.set('search', search.trim());
    const qs = params.toString();
    return request(`/leads${qs ? `?${qs}` : ''}`);
  },

  createLead: (payload) =>
    request('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateLead: (id, payload) =>
    request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteLead: (id) =>
    request(`/leads/${id}`, {
      method: 'DELETE',
    }),

  createDiscussion: (leadId, payload) =>
    request(`/discussions/${leadId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
