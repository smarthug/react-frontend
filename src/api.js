const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

// Cuts
export const fetchCuts = (limit = 50, offset = 0) =>
  request(`/cuts?limit=${limit}&offset=${offset}`);

export const fetchCut = (id) => request(`/cuts/${id}`);

export const deleteCut = (id) => request(`/cuts/${id}`, { method: 'DELETE' });

// Templates
export const fetchTemplates = () => request('/templates');

export const createTemplate = (data) =>
  request('/templates', { method: 'POST', body: JSON.stringify(data) });

export const updateTemplate = (id, data) =>
  request(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTemplate = (id) =>
  request(`/templates/${id}`, { method: 'DELETE' });

// Settings
export const fetchSettings = () => request('/settings');

export const updateSettings = (data) =>
  request('/settings', { method: 'PUT', body: JSON.stringify(data) });
