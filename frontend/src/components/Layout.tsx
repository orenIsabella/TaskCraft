import { A } from '@solidjs/router';
import { Show, createSignal, onMount, onCleanup } from 'solid-js';
import type { JSX } from 'solid-js';
import { auth } from '../lib/auth';
import SettingsModal from './SettingsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import ThemeDropdown from './ThemeDropdown';

export default function Layout(props: { children?: JSX.Element }) {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = createSignal(false);
  const [isTermsOpen, setIsTermsOpen] = createSignal(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = createSignal(false);

  const handleSettingsClick = (e: Event) => {
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  const handlePrivacyClick = (e: Event) => {
    e.preventDefault();
    setIsPrivacyOpen(true);
  };

  const handleTermsClick = (e: Event) => {
    e.preventDefault();
    setIsTermsOpen(true);
  };

  const handleLogout = async () => {
    await auth.logout();
    window.location.href = '/login';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close user menu when clicking outside
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const userMenu = document.querySelector('.user-menu-wrapper');
      if (userMenu && !userMenu.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  });

  return (
    <>
      <div class="page-wrapper">
        <header class="header" id="main-header">
          <div class="header-logo">
            <A href="/">
              <div class="logo-icon">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clip-rule="evenodd"
                    d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </A>
            <h2 class="logo-text">TaskCraft</h2>
          </div>
          <div class="header-actions">
            <div class="header-buttons" id="auth-buttons">
              <ThemeDropdown />
              <button
                class="btn btn-icon btn-secondary"
                onClick={handleSettingsClick}
                title="Settings"
              >
                <span class="material-symbols-outlined icon-lg">settings</span>
              </button>
              <A href="/help" class="btn btn-icon btn-secondary">
                <span class="material-symbols-outlined icon-lg">help</span>
              </A>
            </div>
            <div id="user-menu" class="user-menu">
              <Show
                when={auth.isAuthenticated()}
                fallback={
                  <A href="/login" class="btn btn-sm btn-primary">Log In</A>
                }
              >
                <div class="user-menu-wrapper">
                  <button
                    class="user-menu-button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen())}
                    title={auth.state.user?.name || 'User'}
                  >
                    <Show
                      when={auth.state.user?.avatar}
                      fallback={
                        <div class="user-avatar user-avatar-initials">
                          {getInitials(auth.state.user?.name)}
                        </div>
                      }
                    >
                      <div
                        class="user-avatar"
                        style={{
                          'background-image': `url('${auth.state.user?.avatar}')`
                        }}
                      />
                    </Show>
                    <Show when={auth.state.isMockMode}>
                      <span class="user-demo-badge">Demo</span>
                    </Show>
                  </button>

                  <Show when={isUserMenuOpen()}>
                    <div class="user-dropdown">
                      <div class="user-dropdown-header">
                        <div class="user-dropdown-name">{auth.state.user?.name}</div>
                        <div class="user-dropdown-email">{auth.state.user?.email}</div>
                      </div>
                      <div class="user-dropdown-divider"></div>
                      <button class="user-dropdown-item" onClick={handleLogout}>
                        <span class="material-symbols-outlined icon-md">logout</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          </div>
        </header>

        <main class="main-container" id="app">
          {props.children}
        </main>

        <footer class="app-footer">
          <div class="footer-content">
            <div class="footer-left">
              <span class="footer-text">TaskCraft v1.0.0</span>
              <span class="footer-divider">•</span>
              <span class="footer-text">© 2026 TaskCraft</span>
            </div>
            <div class="footer-links">
              <a href="#" class="footer-link" onClick={handlePrivacyClick}>Privacy Policy</a>
              <span class="footer-divider">•</span>
              <a href="#" class="footer-link" onClick={handleTermsClick}>Terms of Service</a>
              <span class="footer-divider">•</span>
              <A href="/about" class="footer-link">About</A>
              <span class="footer-divider">•</span>
              <A href="/help" class="footer-link">Help</A>
            </div>
          </div>
        </footer>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen()}
        onClose={() => setIsSettingsOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen()}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsOpen()}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
}
