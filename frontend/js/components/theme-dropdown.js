/**
 * Theme Dropdown Component
 * Dropdown menu for selecting themes
 */

import theme from '../utils/theme.js';
import { createElement } from '../utils/dom.js';

/**
 * Create a theme dropdown button
 * @param {HTMLElement} container - Container element
 */
export function createThemeDropdown(container) {
  // Create wrapper for button + dropdown
  const wrapper = createElement('div', {
    style: 'position: relative;'
  });

  // Create toggle button
  const button = createElement('button', {
    className: 'btn btn-icon btn-secondary',
    title: 'Change theme',
    onclick: (e) => {
      e.stopPropagation();
      toggleDropdown();
    }
  });

  const icon = createElement('span', {
    className: 'material-symbols-outlined icon-lg'
  }, 'palette');

  button.appendChild(icon);

  // Create dropdown menu
  const dropdown = createElement('div', {
    className: 'theme-dropdown',
    style: `
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: var(--color-surface-dark);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 0.5rem;
      min-width: 200px;
      box-shadow: var(--shadow-lg);
      display: none;
      z-index: 1000;
    `
  });

  // Populate dropdown with themes
  updateDropdownItems(dropdown);

  // Close dropdown when clicking outside
  const closeOnClickOutside = (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = 'none';
      document.removeEventListener('click', closeOnClickOutside);
    }
  };

  const toggleDropdown = () => {
    const isOpen = dropdown.style.display === 'block';

    if (isOpen) {
      dropdown.style.display = 'none';
      document.removeEventListener('click', closeOnClickOutside);
    } else {
      dropdown.style.display = 'block';
      // Add listener on next tick to avoid immediate close
      setTimeout(() => {
        document.addEventListener('click', closeOnClickOutside);
      }, 0);
    }
  };

  // Update dropdown when theme changes
  theme.subscribe(() => {
    updateDropdownItems(dropdown);
  });

  wrapper.appendChild(button);
  wrapper.appendChild(dropdown);
  container.appendChild(wrapper);

  return wrapper;
}

/**
 * Update dropdown items with current theme state
 */
function updateDropdownItems(dropdown) {
  dropdown.textContent = '';

  const themes = theme.getAvailableThemes();

  themes.forEach(({ id, name, isCurrent }) => {
    const item = createElement('div', {
      className: 'theme-dropdown-item',
      style: `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: background var(--transition-fast);
        background: ${isCurrent ? 'var(--color-surface-highlight)' : 'transparent'};
      `,
      onclick: () => {
        theme.setTheme(id);
        dropdown.style.display = 'none';
      }
    });

    // Color swatch
    const swatch = createElement('div', {
      style: `
        width: 20px;
        height: 20px;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        flex-shrink: 0;
        border: 1px solid var(--color-border);
      `
    });

    // Theme name
    const nameEl = createElement('div', {
      style: `
        flex: 1;
        font-size: var(--text-sm);
        font-weight: ${isCurrent ? '600' : '500'};
        color: var(--color-text-primary);
      `
    }, name);

    // Checkmark for current theme
    const checkmark = createElement('span', {
      className: 'material-symbols-outlined',
      style: `
        font-size: 18px;
        color: var(--color-primary);
        opacity: ${isCurrent ? '1' : '0'};
      `
    }, 'check');

    item.appendChild(swatch);
    item.appendChild(nameEl);
    item.appendChild(checkmark);

    // Hover effect
    item.addEventListener('mouseenter', () => {
      if (!isCurrent) {
        item.style.background = 'var(--color-surface-highlight-alpha-30)';
      }
    });

    item.addEventListener('mouseleave', () => {
      if (!isCurrent) {
        item.style.background = 'transparent';
      }
    });

    dropdown.appendChild(item);
  });
}
