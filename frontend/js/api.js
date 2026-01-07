/**
 * API Client for TaskCraft Backend
 * Centralized fetch wrapper with authentication and error handling
 */

class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   * @param {string} token - JWT or session token
   */
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Get full URL with base path
   * @param {string} endpoint - API endpoint
   */
  getURL(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const error = new Error('API request failed');
      error.status = response.status;
      error.statusText = response.statusText;

      if (isJSON) {
        error.data = await response.json();
      } else {
        error.data = await response.text();
      }

      throw error;
    }

    return isJSON ? await response.json() : await response.text();
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   */
  async get(endpoint, options = {}) {
    const response = await fetch(this.getURL(endpoint), {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   */
  async post(endpoint, data = null, options = {}) {
    const response = await fetch(this.getURL(endpoint), {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   */
  async put(endpoint, data = null, options = {}) {
    const response = await fetch(this.getURL(endpoint), {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   */
  async patch(endpoint, data = null, options = {}) {
    const response = await fetch(this.getURL(endpoint), {
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...options.headers },
      body: data ? JSON.stringify(data) : null,
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   */
  async delete(endpoint, options = {}) {
    const response = await fetch(this.getURL(endpoint), {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    });

    return this.handleResponse(response);
  }

  /**
   * Upload files via multipart/form-data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData object with files
   * @param {Object} options - Additional fetch options
   */
  async upload(endpoint, formData, options = {}) {
    // Don't set Content-Type for multipart/form-data - browser will set it with boundary
    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type'];

    const response = await fetch(this.getURL(endpoint), {
      method: 'POST',
      headers: { ...headers, ...options.headers },
      body: formData,
      ...options,
    });

    return this.handleResponse(response);
  }
}

// Create singleton instance
const api = new ApiClient();

export default api;
