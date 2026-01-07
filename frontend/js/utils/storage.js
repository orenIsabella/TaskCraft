/**
 * Storage Utility Functions
 * Wrapper for localStorage and sessionStorage with error handling and JSON support
 */

class StorageManager {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   */
  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);

      if (item === null) {
        return defaultValue;
      }

      // Try to parse as JSON
      try {
        return JSON.parse(item);
      } catch {
        // Return as string if not JSON
        return item;
      }
    } catch (error) {
      console.error(`Failed to get item "${key}" from storage:`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to set item "${key}" in storage:`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item "${key}" from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  /**
   * Check if key exists in storage
   * @param {string} key - Storage key
   */
  has(key) {
    return this.storage.getItem(key) !== null;
  }

  /**
   * Get all keys from storage
   */
  keys() {
    return Object.keys(this.storage);
  }

  /**
   * Get number of items in storage
   */
  size() {
    return this.storage.length;
  }

  /**
   * Set item with expiration time
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds
   */
  setWithExpiry(key, value, ttl) {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    return this.set(key, item);
  }

  /**
   * Get item with expiration check
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if expired or doesn't exist
   */
  getWithExpiry(key, defaultValue = null) {
    const item = this.get(key);

    if (!item) {
      return defaultValue;
    }

    if (item.expiry && Date.now() > item.expiry) {
      this.remove(key);
      return defaultValue;
    }

    return item.value !== undefined ? item.value : defaultValue;
  }

  /**
   * Update existing item (merge for objects)
   * @param {string} key - Storage key
   * @param {any} updates - Updates to merge
   */
  update(key, updates) {
    const existing = this.get(key);

    if (typeof existing === 'object' && typeof updates === 'object') {
      return this.set(key, { ...existing, ...updates });
    }

    return this.set(key, updates);
  }
}

// Create instances for localStorage and sessionStorage
const local = new StorageManager(localStorage);
const session = new StorageManager(sessionStorage);

export { local, session, StorageManager };
export default local;
