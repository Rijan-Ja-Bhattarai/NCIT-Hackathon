const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getHeaders() {
  const token = localStorage.getItem('cc_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    const message = data?.error || data?.detail || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (payload) =>
    fetch(`${BASE_URL}/api/auth/signup/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  logout: () =>
    fetch(`${BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse),
};

// ─── Therapists ───────────────────────────────────────────────────────────────

export const therapistsApi = {
  list: () =>
    fetch(`${BASE_URL}/api/therapists/`, { headers: getHeaders() }).then(handleResponse),
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: () =>
    fetch(`${BASE_URL}/api/appointments/`, { headers: getHeaders() }).then(handleResponse),

  create: (payload) =>
    fetch(`${BASE_URL}/api/appointments/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).then(handleResponse),
};
