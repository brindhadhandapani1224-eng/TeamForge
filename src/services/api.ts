/**
 * TeamForge API Service
 * Encapsulates HTTP client interactions with the backend REST endpoints.
 */

const BASE_URL = '/api';

export const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('teamforge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  },

  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  },

  put: async (endpoint: string, body: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  },
};
