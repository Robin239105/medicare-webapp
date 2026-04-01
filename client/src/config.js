/**
 * API base URL for axios (includes /api path).
 * - Production on Vercel: leave VITE_API_URL unset → same-origin "/api"
 * - Local dev: set VITE_API_URL=http://127.0.0.1:5005/api in client/.env
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw != null && String(raw).trim() !== '') {
    return String(raw).replace(/\/$/, '');
  }
  return '/api';
}
