/**
 * Simple SPA Router using History API
 *
 * Security Note: This router loads trusted page templates from our own codebase.
 * It uses template elements to safely parse HTML. Do NOT pass user-generated content
 * directly to route handlers without sanitization.
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.beforeNavigateHooks = [];
    this.afterNavigateHooks = [];

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    // Intercept link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., '/dashboard', '/settings')
   * @param {Function} handler - Function that returns HTML content or loads page
   */
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Register multiple routes at once
   * @param {Object} routes - Object with path: handler pairs
   */
  addRoutes(routes) {
    Object.entries(routes).forEach(([path, handler]) => {
      this.addRoute(path, handler);
    });
  }

  /**
   * Navigate to a route
   * @param {string} path - Path to navigate to
   */
  async navigate(path) {
    // Run before-navigate hooks
    for (const hook of this.beforeNavigateHooks) {
      const result = await hook(path);
      if (result === false) return; // Hook cancelled navigation
    }

    window.history.pushState(null, null, path);
    await this.handleRoute(path);

    // Run after-navigate hooks
    for (const hook of this.afterNavigateHooks) {
      await hook(path);
    }
  }

  /**
   * Handle route rendering
   * @param {string} path - Path to render
   */
  async handleRoute(path) {
    // Normalize path
    let normalizedPath = path;

    // Handle index.html or empty path
    if (path === '/index.html' || path === '' || path === '/frontend/' || path === '/frontend/index.html') {
      normalizedPath = '/';
    }

    const route = this.routes[normalizedPath] || this.routes['/404'];

    if (!route) {
      console.error(`No route found for ${normalizedPath}`);
      // Fallback to home if no 404 route exists
      if (this.routes['/']) {
        await this.routes['/']();
      }
      return;
    }

    this.currentRoute = normalizedPath;

    try {
      const content = await route();
      const appContainer = document.getElementById('app');

      if (appContainer) {
        // Clear existing content
        appContainer.textContent = '';

        if (typeof content === 'string') {
          // Use template element to safely parse trusted HTML from our page files
          const template = document.createElement('template');
          template.innerHTML = content;
          appContainer.appendChild(template.content);
        } else if (content instanceof HTMLElement) {
          appContainer.appendChild(content);
        }
      }
    } catch (error) {
      console.error('Error rendering route:', error);
      if (this.routes['/error']) {
        const errorContent = await this.routes['/error'](error);
        const appContainer = document.getElementById('app');
        appContainer.textContent = '';
        const template = document.createElement('template');
        template.innerHTML = errorContent;
        appContainer.appendChild(template.content);
      }
    }
  }

  /**
   * Add a hook that runs before navigation
   * @param {Function} hook - Hook function (can return false to cancel navigation)
   */
  beforeNavigate(hook) {
    this.beforeNavigateHooks.push(hook);
  }

  /**
   * Add a hook that runs after navigation
   * @param {Function} hook - Hook function
   */
  afterNavigate(hook) {
    this.afterNavigateHooks.push(hook);
  }

  /**
   * Start the router
   */
  start() {
    this.handleRoute(window.location.pathname);
  }

  /**
   * Get current route path
   */
  getCurrentPath() {
    return this.currentRoute;
  }

  /**
   * Get query parameters from URL
   * @returns {Object} Query parameters as key-value pairs
   */
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }
}

// Create singleton instance
const router = new Router();

export default router;
