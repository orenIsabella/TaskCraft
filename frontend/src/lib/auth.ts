import { createStore } from 'solid-js/store';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isMockMode: boolean;
}

const mockUsers: User[] = [
  {
    id: 'demo-user-1',
    email: 'demo@taskcraft.dev',
    name: 'Demo User',
    avatar: null,
    preferences: {
      theme: 'light',
      notifications: true
    }
  }
];

const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);
const defaultMockUser = mockUsers[0];

function isMockEnvironment(): boolean {
  const hostname = window.location.hostname;
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname.startsWith('192.168.') ||
         hostname.endsWith('.local');
}

function loadAuthState(): AuthState {
  const savedToken = localStorage.getItem('auth_token');
  const savedUser = localStorage.getItem('auth_user');
  const isMockMode = localStorage.getItem('auth_mock_mode') === 'true';

  if (savedToken && savedUser) {
    try {
      const user = JSON.parse(savedUser);
      api.setAuthToken(savedToken);
      return { token: savedToken, user, isMockMode };
    } catch (error) {
      console.error('Failed to load auth state:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_mock_mode');
    }
  }

  return { user: null, token: null, isMockMode: false };
}

const [authState, setAuthState] = createStore<AuthState>(loadAuthState());

function saveAuthState() {
  if (authState.token && authState.user) {
    localStorage.setItem('auth_token', authState.token);
    localStorage.setItem('auth_user', JSON.stringify(authState.user));
  }
}

function clearAuthState() {
  setAuthState({ token: null, user: null, isMockMode: false });
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_mock_mode');
  api.setAuthToken(null);
}

export const auth = {
  get state() {
    return authState;
  },

  isAuthenticated(): boolean {
    return !!authState.token && !!authState.user;
  },

  getUser(): User | null {
    return authState.user;
  },

  getToken(): string | null {
    return authState.token;
  },

  async register(userData: any) {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.token && response.user) {
        setAuthState({ token: response.token, user: response.user, isMockMode: false });
        saveAuthState();
        api.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.token && response.user) {
        setAuthState({ token: response.token, user: response.user, isMockMode: false });
        saveAuthState();
        api.setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async loginAsMock(mockUser: User | null = null) {
    const user = mockUser || defaultMockUser;

    setAuthState({ token: mockToken, user, isMockMode: true });
    localStorage.setItem('auth_mock_mode', 'true');
    saveAuthState();
    api.setAuthToken(mockToken);

    console.warn('[MOCK AUTH] Logged in as:', user.email);
    return { token: mockToken, user };
  },

  async logout() {
    try {
      if (authState.token) {
        await api.post('/auth/logout').catch(() => {
          // Ignore errors
        });
      }
    } finally {
      clearAuthState();
    }
  },

  async updateProfile(userData: any) {
    try {
      const response = await api.patch('/auth/profile', userData);

      if (response.user) {
        setAuthState('user', (prev) => ({ ...prev!, ...response.user }));
        saveAuthState();
      }

      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      return response;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  },

  async requestPasswordReset(email: string) {
    try {
      const response = await api.post('/auth/password-reset-request', { email });
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await api.post('/auth/password-reset', {
        token,
        new_password: newPassword,
      });

      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },

  isMockEnvironment,
};
