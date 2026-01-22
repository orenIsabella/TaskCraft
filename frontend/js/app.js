/**
 * TaskCraft Main Application
 * Initializes router, authentication, and app state
 */

import router from './router.js';
import auth from './auth.js';
import api from './api.js';
import { loadHTML, createElement } from './utils/dom.js';
import { createThemeDropdown } from './components/theme-dropdown.js';
import { openSettingsModal } from './components/settings-modal.js';
import { openPrivacyModal, openTermsModal } from './components/legal-modals.js';

/**
 * Load and return page content
 * @param {string} pageName - Name of the page file
 */
async function loadPage(pageName) {
  try {
    const html = await loadHTML(`/pages/${pageName}`);
    return html;
  } catch (error) {
    console.error(`Failed to load page: ${pageName}`, error);
    return `<div class="error-message">Failed to load page. Please try again.</div>`;
  }
}

/**
 * Initialize dashboard page functionality
 */
function initDashboard() {
  const generateBtn = document.getElementById('generate-btn');
  const taskInput = document.getElementById('task-input');

  if (generateBtn && taskInput) {
    generateBtn.addEventListener('click', async () => {
      const taskText = taskInput.value.trim();

      if (!taskText) {
        alert('Please enter a task');
        return;
      }

      try {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        // Call API to generate calendar events from task
        const user = auth.getUser();
        const payload = {
          text: taskText,
          email: user ? user.email : null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jerusalem"
        };

        const response = await api.post('/tasks', payload);

        console.log('Generated task output:', response);

        // Clear input on success
        taskInput.value = '';

        // TODO: Refresh last processed list
      } catch (error) {
        console.error('Failed to generate tasks:', error);
        alert('Failed to generate tasks. Please try again.');
      } finally {
        generateBtn.disabled = false;

        // Rebuild button content safely
        generateBtn.textContent = '';
        const icon = createElement('span', { className: 'material-symbols-outlined icon-lg' }, 'auto_awesome');
        const text = createElement('span', {}, 'Generate');
        generateBtn.appendChild(icon);
        generateBtn.appendChild(text);
      }
    });

    // Handle Enter key
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateBtn.click();
      }
    });
  }
}

/**
 * Update user menu based on auth state
 */
function updateUserMenu() {
  const userMenu = document.getElementById('user-menu');

  if (!userMenu) return;

  // Clear existing content
  userMenu.textContent = '';

  if (auth.isAuthenticated()) {
    const user = auth.getUser();

    // Add mock mode indicator
    if (auth.isMockMode) {
      const mockBadge = createElement('span', {
        className: 'badge badge-warning',
        style: 'margin-right: 0.5rem;',
        title: 'Mock authentication active (dev mode)'
      }, 'DEMO');
      userMenu.appendChild(mockBadge);
    }

    // Create profile picture element safely
    const profilePic = createElement('div', {
      className: 'profile-picture',
      'data-alt': user.name || 'User'
    });

    // Set background image if available (sanitize URL)
    const avatarUrl = user.avatar || '/images/default-avatar.png';
    profilePic.style.backgroundImage = `url('${CSS.escape(avatarUrl)}')`;

    userMenu.appendChild(profilePic);
  } else {
    const loginLink = createElement('a', {
      href: '/login',
      'data-link': '',
      className: 'btn btn-sm btn-primary'
    }, 'Log In');

    userMenu.appendChild(loginLink);
  }
}

/**
 * Set up route definitions
 */
function setupRoutes() {
  router.addRoutes({
    '/': async () => {
      const html = await loadPage('dashboard');
      // Run dashboard init after DOM is updated
      setTimeout(initDashboard, 0);
      return html;
    },

    '/index.html': async () => {
      router.navigate('/'); // Redirect to home
      return '';
    },

    '/dashboard': async () => {
      router.navigate('/'); // Redirect to home
      return '';
    },

    '/settings': async () => {
      // Settings are handled by special click handler (opens modal)
      // This route exists for completeness but shouldn't be reached
      return '';
    },

    '/profile': async () => {
      return await loadPage('profile');
    },

    '/history': async () => {
      const html = await loadPage('history');
      // Run history page init after DOM is updated
      setTimeout(async () => {
        const { initHistoryPage } = await import('./pages/history.js');
        initHistoryPage();
      }, 0);
      return html;
    },

    '/help': async () => {
      return await loadPage('help');
    },

    '/about': async () => {
      return await loadPage('about');
    },

    '/login': async () => {
      if (auth.isAuthenticated()) {
        router.navigate('/');
        return '';
      }
      const html = await loadPage('login');
      // Initialize login page after DOM update
      setTimeout(async () => {
        const { initLoginPage } = await import('./pages/login.js');
        initLoginPage();
      }, 0);
      return html;
    },

    '/register': async () => {
      if (auth.isAuthenticated()) {
        router.navigate('/');
        return '';
      }
      return await loadPage('register');
    },

    '/404': () => {
      return `
        <div class="flex-col gap-6" style="text-align: center; padding: 4rem 1rem;">
          <h1 class="heading-hero" style="font-size: 6rem;">404</h1>
          <p class="subtitle">Page not found</p>
          <div>
            <a href="/" data-link class="btn btn-md btn-primary">Go Home</a>
          </div>
        </div>
      `;
    },
  });
}

/**
 * Set up auth state listeners
 */
function setupAuthListeners() {
  auth.subscribe((event, data) => {
    console.log('Auth event:', event, data);

    if (event === 'login') {
      updateUserMenu();
      router.navigate('/');
    } else if (event === 'logout') {
      updateUserMenu();
      router.navigate('/login');
    }
  });
}

/**
 * Set up router hooks
 */
function setupRouterHooks() {
  // Before navigation - check auth for protected routes
  router.beforeNavigate((path) => {
    const protectedRoutes = ['/settings', '/profile', '/history'];

    if (protectedRoutes.includes(path) && !auth.isAuthenticated()) {
      router.navigate('/login');
      return false; // Cancel navigation
    }

    return true;
  });

  // After navigation - update page title and scroll to top
  router.afterNavigate((path) => {
    const pageTitles = {
      '/': 'Dashboard',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/history': 'History',
      '/help': 'Help',
      '/about': 'About',
      '/login': 'Log In',
      '/register': 'Sign Up',
    };

    const pageTitle = pageTitles[path] || 'TaskCraft';
    document.title = `${pageTitle} | TaskCraft`;

    // Scroll to top
    window.scrollTo(0, 0);

    // Update user menu
    updateUserMenu();
  });
}

/**
 * [MOCK AUTH] Check for mock authentication parameter
 */
async function checkMockAuth() {
  const params = router.getQueryParams();

  // Only allow mock auth in development environments
  if (params.mock === 'true' && auth.constructor.isMockEnvironment()) {
    if (!auth.isAuthenticated()) {
      console.log('[MOCK AUTH] Enabling mock authentication...');
      await auth.loginAsMock();

      // Clean URL (remove ?mock=true)
      const cleanPath = window.location.pathname;
      window.history.replaceState(null, null, cleanPath);
    }
  }
}

/**
 * Set up special link handlers
 */
function setupSpecialHandlers() {
  // Intercept settings links to open modal instead of navigating
  document.addEventListener('click', (e) => {
    const settingsLink = e.target.closest('a[href="/settings"]');
    if (settingsLink && settingsLink.hasAttribute('data-link')) {
      e.preventDefault();
      e.stopPropagation();
      openSettingsModal();
      return;
    }

    // Handle privacy policy link
    const privacyLink = e.target.closest('#privacy-link');
    if (privacyLink) {
      e.preventDefault();
      e.stopPropagation();
      openPrivacyModal();
      return;
    }

    // Handle terms of service link
    const termsLink = e.target.closest('#terms-link');
    if (termsLink) {
      e.preventDefault();
      e.stopPropagation();
      openTermsModal();
      return;
    }
  });
}

/**
 * Initialize the application
 */
async function init() {
  console.log('Initializing TaskCraft...');

  // Set up routes
  setupRoutes();

  // Set up router hooks
  setupRouterHooks();

  // Set up auth listeners
  setupAuthListeners();

  // Set up special handlers (settings modal, etc.)
  setupSpecialHandlers();

  // Update user menu with current auth state
  updateUserMenu();

  // Add theme dropdown to header
  const headerButtons = document.getElementById('auth-buttons');
  if (headerButtons) {
    createThemeDropdown(headerButtons);
  }

  // Check for mock authentication parameter
  await checkMockAuth();

  // Start router
  router.start();

  console.log('TaskCraft initialized');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
