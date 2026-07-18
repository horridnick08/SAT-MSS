import { create } from 'zustand';
import type { IUser } from '@satmss/shared-types';

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  setCredentials: (token: string, user: IUser) => void;
  clearCredentials: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setCredentials: (token, user) => {
    localStorage.setItem('satmss_token', token);
    localStorage.setItem('satmss_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  clearCredentials: () => {
    localStorage.removeItem('satmss_token');
    localStorage.removeItem('satmss_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('satmss_token');
    const userJson = localStorage.getItem('satmss_user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as IUser;
        set({ token, user, isAuthenticated: true });
      } catch {
        // Corrupted localStorage item, purge it
        localStorage.removeItem('satmss_token');
        localStorage.removeItem('satmss_user');
      }
    }
  },
}));
