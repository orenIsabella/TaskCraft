/**
 * Theme Management Utility
 * Handles dynamic theme switching and persistence
 */

import { local } from './storage.js';

const THEME_STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'default'; // No data attribute = default theme

class ThemeManager {
  constructor() {
    this.currentTheme = DEFAULT_THEME;
    this.listeners = [];

    // Available themes (dark themes first, then light themes)
    this.themes = {
      default: 'Golden Hour',
      ocean: 'Ocean Blue',
      forest: 'Forest Green',
      midnight: 'Midnight Purple',
      sunset: 'Sunset Orange',
      rose: 'Rose Pink',
      daylight: 'Daylight',
      cloud: 'Cloud',
      meadow: 'Meadow',
    };

    // Load saved theme
    this.loadTheme();
  }

  /**
   * Get list of available themes
   */
  getAvailableThemes() {
    return Object.entries(this.themes).map(([id, name]) => ({
      id,
      name,
      isCurrent: id === this.currentTheme,
    }));
  }

  /**
   * Load saved theme from storage
   */
  loadTheme() {
    const savedTheme = local.get(THEME_STORAGE_KEY, DEFAULT_THEME);
    this.setTheme(savedTheme, false); // Don't notify on initial load
  }

  /**
   * Set the current theme
   * @param {string} themeId - Theme identifier
   * @param {boolean} notify - Whether to notify listeners
   */
  setTheme(themeId, notify = true) {
    // Validate theme exists
    if (!this.themes[themeId]) {
      console.warn(`Theme "${themeId}" not found, falling back to default`);
      themeId = DEFAULT_THEME;
    }

    this.currentTheme = themeId;

    // Apply theme to document
    if (themeId === DEFAULT_THEME) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }

    // Save to storage
    local.set(THEME_STORAGE_KEY, themeId);

    // Notify listeners
    if (notify) {
      this.notifyListeners(themeId);
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return {
      id: this.currentTheme,
      name: this.themes[this.currentTheme],
    };
  }

  /**
   * Subscribe to theme changes
   * @param {Function} listener - Callback function (themeId) => void
   */
  subscribe(listener) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of theme change
   * @param {string} themeId - New theme ID
   */
  notifyListeners(themeId) {
    this.listeners.forEach(listener => {
      try {
        listener(themeId);
      } catch (error) {
        console.error('Theme listener error:', error);
      }
    });
  }

  /**
   * Cycle to next theme (useful for theme toggle button)
   */
  nextTheme() {
    const themeIds = Object.keys(this.themes);
    const currentIndex = themeIds.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    this.setTheme(themeIds[nextIndex]);
  }
}

// Create singleton instance
const theme = new ThemeManager();

export default theme;
export { ThemeManager };
