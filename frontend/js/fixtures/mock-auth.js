/**
 * Mock Authentication Data
 * Used for development testing without a backend
 *
 * IMPORTANT: This is for development only and should be removed when backend is ready
 */

export const mockUsers = [
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

export const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);

export const defaultMockUser = mockUsers[0];
