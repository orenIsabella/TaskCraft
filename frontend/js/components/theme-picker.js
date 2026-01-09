/**
 * Theme Picker Component
 * UI component for selecting themes
 */

import theme from '../utils/theme.js';
import { createElement } from '../utils/dom.js';

/**
 * Create a theme picker UI
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Options for the theme picker
 */
export function createThemePicker(container, options = {}) {
  const {
    showLabels = true,
    layout = 'grid', // 'grid' or 'list'
  } = options;

  // Clear container
  container.textContent = '';

  // Create theme options
  const themes = theme.getAvailableThemes();

  if (layout === 'grid') {
    const grid = createElement('div', {
      className: 'theme-picker-grid',
      style: 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;'
    });

    themes.forEach(({ id, name, isCurrent }) => {
      const card = createThemeCard(id, name, isCurrent, showLabels);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  } else {
    // List layout
    const list = createElement('div', {
      className: 'theme-picker-list',
      style: 'display: flex; flex-direction: column; gap: 0.75rem;'
    });

    themes.forEach(({ id, name, isCurrent }) => {
      const item = createThemeListItem(id, name, isCurrent);
      list.appendChild(item);
    });

    container.appendChild(list);
  }
}

/**
 * Create a theme card (for grid layout)
 */
function createThemeCard(id, name, isCurrent, showLabels) {
  const card = createElement('div', {
    className: `theme-card ${isCurrent ? 'active' : ''}`,
    style: `
      cursor: pointer;
      border: 2px solid ${isCurrent ? 'var(--color-primary)' : 'var(--color-border)'};
      border-radius: var(--radius-lg);
      padding: 1rem;
      transition: all var(--transition-base);
      background: var(--color-surface-dark);
    `,
    onclick: () => theme.setTheme(id)
  });

  // Color preview
  const preview = createElement('div', {
    className: 'theme-preview',
    style: `
      height: 60px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-surface-highlight) 100%);
      margin-bottom: ${showLabels ? '0.75rem' : '0'};
    `
  });

  card.appendChild(preview);

  if (showLabels) {
    const label = createElement('div', {
      style: `
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: var(--text-sm);
        text-align: center;
      `
    }, name);

    if (isCurrent) {
      const checkmark = createElement('span', {
        className: 'material-symbols-outlined',
        style: 'font-size: 16px; margin-left: 0.25rem; color: var(--color-primary);'
      }, 'check_circle');
      label.appendChild(checkmark);
    }

    card.appendChild(label);
  }

  // Hover effect
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'var(--color-primary)';
    card.style.transform = 'translateY(-2px)';
  });

  card.addEventListener('mouseleave', () => {
    if (!isCurrent) {
      card.style.borderColor = 'var(--color-border)';
    }
    card.style.transform = 'translateY(0)';
  });

  return card;
}

/**
 * Create a theme list item (for list layout)
 */
function createThemeListItem(id, name, isCurrent) {
  const item = createElement('div', {
    className: `theme-list-item ${isCurrent ? 'active' : ''}`,
    style: `
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: var(--radius-lg);
      background: ${isCurrent ? 'var(--color-surface-highlight)' : 'var(--color-surface-dark)'};
      border: 1px solid ${isCurrent ? 'var(--color-primary)' : 'var(--color-border)'};
      transition: all var(--transition-base);
    `,
    onclick: () => theme.setTheme(id)
  });

  // Color swatch
  const swatch = createElement('div', {
    style: `
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-primary);
      flex-shrink: 0;
    `
  });

  // Name
  const nameEl = createElement('div', {
    style: `
      flex: 1;
      font-weight: 500;
      color: var(--color-text-primary);
    `
  }, name);

  // Checkmark
  const checkmark = createElement('span', {
    className: 'material-symbols-outlined',
    style: `
      color: var(--color-primary);
      opacity: ${isCurrent ? '1' : '0'};
      transition: opacity var(--transition-base);
    `
  }, 'check_circle');

  item.appendChild(swatch);
  item.appendChild(nameEl);
  item.appendChild(checkmark);

  // Hover effect
  item.addEventListener('mouseenter', () => {
    item.style.borderColor = 'var(--color-primary)';
  });

  item.addEventListener('mouseleave', () => {
    if (!isCurrent) {
      item.style.borderColor = 'var(--color-border)';
    }
  });

  return item;
}

/**
 * Create a simple theme toggle button (cycles through themes)
 * @param {HTMLElement} container - Container element
 */
export function createThemeToggle(container) {
  const button = createElement('button', {
    className: 'btn btn-icon btn-secondary',
    onclick: () => theme.nextTheme(),
    title: 'Change theme'
  });

  const icon = createElement('span', {
    className: 'material-symbols-outlined icon-lg'
  }, 'palette');

  button.appendChild(icon);
  container.appendChild(button);

  // Update icon when theme changes
  theme.subscribe(() => {
    // Optional: could change icon or add animation
    button.style.animation = 'none';
    setTimeout(() => {
      button.style.animation = '';
    }, 10);
  });

  return button;
}
