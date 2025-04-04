import { create } from 'zustand';
import { User } from '../mocks/users';
import * as authAPI from '../api/auth';
import * as userAPI from '../api/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.login(username, password);
      const user = await userAPI.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
      return false;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await authAPI.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      set({ isLoading: false });
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const isAuth = await authAPI.isAuthenticated();
      if (isAuth) {
        const user = await userAPI.getCurrentUser();
        set({ user, isAuthenticated: true });
        return true;
      } else {
        set({ user: null, isAuthenticated: false });
        return false;
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));