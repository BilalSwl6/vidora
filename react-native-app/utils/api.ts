// Centralized API URL management for FastAPI backend

export const API_BASE_URL = 'https://musical-cod-p959qqgwr6p3659p-8000.app.github.dev';

export const API_ENDPOINTS = {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/register`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    me: `${API_BASE_URL}/auth/me`,
    // Add other endpoints as needed
};
