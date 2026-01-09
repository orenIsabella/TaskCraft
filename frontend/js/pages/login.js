/**
 * Login Page Logic
 * Handles user authentication and mock login for development
 */

import auth from '../auth.js';
import api from '../api.js';
import router from '../router.js';
import { createElement } from '../utils/dom.js';

export function initLoginPage() {
  // Show demo login button only in dev environments
  const mockSection = document.getElementById('mock-auth-section');
  if (mockSection && auth.constructor.isMockEnvironment()) {
    mockSection.style.display = 'block';
  }

  // Handle demo login
  const demoBtn = document.getElementById('demo-login-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', async () => {
      demoBtn.disabled = true;
      demoBtn.textContent = 'Logging in...';

      try {
        await auth.loginAsMock();
        // AuthManager will trigger navigation via listener
      } catch (error) {
        console.error('Demo login failed:', error);
        alert('Demo login failed');

        // Restore button content safely using createElement
        demoBtn.textContent = '';
        demoBtn.disabled = false;

        const icon = createElement('span', {
          className: 'material-symbols-outlined icon-md'
        }, 'science');
        const text = createElement('span', {}, 'Continue as Demo User');

        demoBtn.appendChild(icon);
        demoBtn.appendChild(text);
      }
    });
  }

  // Handle regular login form
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await auth.login(email, password);
        // Will navigate on success via auth listener
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
