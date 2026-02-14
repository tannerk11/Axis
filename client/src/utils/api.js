// In production, API is served from same origin (empty string)
// In development, use localhost:3001
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:3001');
