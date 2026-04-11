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

// Panels
export const fetchPanels = () => request('/panels');

export const createPanel = (data) =>
  request('/panels', { method: 'POST', body: JSON.stringify(data) });

export const updatePanel = (id, data) =>
  request(`/panels/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePanel = (id) =>
  request(`/panels/${id}`, { method: 'DELETE' });

export const reorderPanels = (ids) =>
  request('/panels/reorder', { method: 'POST', body: JSON.stringify({ ids }) });

// Cuts
export const fetchCuts = (panelId, { limit = 50, offset = 0, sort = 'recent', order = 'desc', status } = {}) => {
  const params = new URLSearchParams({ limit, offset, sort, order });
  if (panelId) params.set('panel_id', panelId);
  if (status) params.set('status', status);
  return request(`/cuts?${params}`);
};

export const fetchCut = (id) => request(`/cuts/${id}`);

export const deleteCut = (id) => request(`/cuts/${id}`, { method: 'DELETE' });

export const reReviewCut = (id) =>
  request(`/cuts/${id}/re-review`, { method: 'POST' });

export const bulkDeleteCuts = (ids) =>
  request('/cuts/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) });

export const bulkReReviewCuts = (ids) =>
  request('/cuts/bulk-re-review', { method: 'POST', body: JSON.stringify({ ids }) });

export const fetchPanelSummary = (panelId) =>
  request(`/panels/${panelId}/summary`);

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
