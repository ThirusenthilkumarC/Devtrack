import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('devtrack_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('devtrack_token')),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.token) {
        localStorage.setItem('devtrack_token', res.token);
        set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, confirmPassword });
      if (res.token) {
        localStorage.setItem('devtrack_token', res.token);
        set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('devtrack_token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      localStorage.removeItem('devtrack_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('devtrack_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null })
}));
