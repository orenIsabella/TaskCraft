/**
 * Authentication Manager
 * Handles user authentication state, token storage, and auth-related operations
 */

import api from './api.js';

class AuthManager {
  constructor() {
    this.user = null;
    this.token = null;
    this.listeners = [];
    this.isMockMode = localStorage.getItem('auth_mock_mode') === 'true';

    // Load saved auth state from localStorage
    this.loadAuthState();
  }

  /**
   * Load authentication state from localStorage
   */
  loadAuthState() {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
        api.setAuthToken(this.token);
      } catch (error) {
        console.error('Failed to load auth state:', error);
        this.clearAuthState();
      }
    }
  }

  /**
   * Save authentication state to localStorage
   */
  saveAuthState() {
    if (this.token && this.user) {
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('auth_user', JSON.stringify(this.user));
    }
  }

  /**
   * Clear authentication state from localStorage
   */
  clearAuthState() {
    this.token = null;
    this.user = null;
    this.isMockMode = false;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_mock_mode');
    api.setAuthToken(null);
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.token && response.user) {
        this.token = response.token;
        this.user = response.user;
        this.saveAuthState();
        api.setAuthToken(this.token);
        this.notifyListeners('login', this.user);
      }

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.token && response.user) {
        this.token = response.token;
        this.user = response.user;
        this.saveAuthState();
        api.setAuthToken(this.token);
        this.notifyListeners('login', this.user);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * [MOCK AUTH] Log in with mock credentials (development only)
   * @param {Object} mockUser - Optional custom mock user (uses default if not provided)
   */
  async loginAsMock(mockUser = null) {
    const { defaultMockUser, mockToken } = await import('./fixtures/mock-auth.js');
    const user = mockUser || defaultMockUser;

    this.token = mockToken;
    this.user = user;
    this.isMockMode = true;

    localStorage.setItem('auth_mock_mode', 'true');
    this.saveAuthState();
    api.setAuthToken(this.token);
    this.notifyListeners('login', this.user);

    console.warn('[MOCK AUTH] Logged in as:', user.email);
    return { token: mockToken, user };
  }

  /**
   * Log out the current user
   */
  async logout() {
    try {
      // Optionally call backend logout endpoint
      if (this.token) {
        await api.post('/auth/logout').catch(() => {
          // Ignore errors - logout locally anyway
        });
      }
    } finally {
      const wasLoggedIn = this.isAuthenticated();
      this.clearAuthState();

      if (wasLoggedIn) {
        this.notifyListeners('logout');
      }
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current token
   * @returns {string|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await api.patch('/auth/profile', userData);

      if (response.user) {
        this.user = { ...this.user, ...response.user };
        this.saveAuthState();
        this.notifyListeners('profile_update', this.user);
      }

      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(currentPassword, newPassword) {
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
  }

  /**
   * Request password reset
   * @param {string} email - User email
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/password-reset-request', { email });
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   */
  async resetPassword(token, newPassword) {
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
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} listener - Callback function (event, data) => void
   */
  subscribe(listener) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of auth state change
   * @param {string} event - Event type ('login', 'logout', 'profile_update')
   * @param {any} data - Event data
   */
  notifyListeners(event, data = null) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  /**
   * [MOCK AUTH] Check if running in a development environment
   * @returns {boolean} True if running on localhost or local network
   */
  static isMockEnvironment() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname.startsWith('192.168.') ||
           hostname.endsWith('.local');
  }
}

// Create singleton instance
const auth = new AuthManager();

export default auth;
