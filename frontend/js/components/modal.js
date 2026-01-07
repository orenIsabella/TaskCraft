/**
 * Modal Component
 * Reusable modal dialog with overlay
 *
 * SECURITY NOTE: Modal content uses template elements for HTML parsing.
 * Only pass trusted content (e.g., from your own app, not user-generated).
 * For user-generated content, sanitize first or use textContent.
 */

import { createElement } from '../utils/dom.js';

class Modal {
  constructor(options = {}) {
    this.options = {
      title: '',
      content: '',
      size: 'medium', // 'small', 'medium', 'large', 'full'
      closeOnEscape: true,
      closeOnOverlay: true,
      onClose: null,
      ...options
    };

    this.isOpen = false;
    this.overlay = null;
    this.container = null;

    this.handleEscape = this.handleEscape.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  /**
   * Create and render the modal
   */
  create() {
    // Create overlay
    this.overlay = createElement('div', {
      className: 'modal-overlay',
      onclick: this.handleOverlayClick
    });

    // Create container
    const sizeClass = `modal-${this.options.size}`;
    this.container = createElement('div', {
      className: `modal-container ${sizeClass}`
    });

    // Create header
    const header = createElement('div', {
      className: 'modal-header'
    });

    const title = createElement('h2', {
      className: 'modal-title'
    }, this.options.title);

    const closeBtn = createElement('button', {
      className: 'modal-close',
      onclick: (e) => {
        e.stopPropagation();
        this.close();
      },
      title: 'Close (ESC)'
    });

    const closeIcon = createElement('span', {
      className: 'material-symbols-outlined'
    }, 'close');

    closeBtn.appendChild(closeIcon);
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create body
    const body = createElement('div', {
      className: 'modal-body'
    });

    // Set content (can be string or HTMLElement)
    if (typeof this.options.content === 'string') {
      // Using template element to safely parse trusted HTML from our app
      const template = document.createElement('template');
      template.innerHTML = this.options.content;
      body.appendChild(template.content);
    } else if (this.options.content instanceof HTMLElement) {
      body.appendChild(this.options.content);
    }

    // Assemble modal
    this.container.appendChild(header);
    this.container.appendChild(body);
    this.overlay.appendChild(this.container);

    return this.overlay;
  }

  /**
   * Open the modal
   */
  open() {
    if (this.isOpen) return;

    if (!this.overlay) {
      this.create();
    }

    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Add event listeners
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscape);
    }

    this.isOpen = true;

    // Trigger animation
    setTimeout(() => {
      this.overlay.classList.add('modal-open');
    }, 10);
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isOpen) return;

    this.overlay.classList.remove('modal-open');

    // Wait for animation before removing
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }

      document.body.style.overflow = '';
      document.removeEventListener('keydown', this.handleEscape);

      this.isOpen = false;

      // Call onClose callback
      if (this.options.onClose) {
        this.options.onClose();
      }
    }, 200); // Match CSS transition duration
  }

  /**
   * Handle ESC key
   */
  handleEscape(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Handle click on overlay (outside modal)
   */
  handleOverlayClick(e) {
    if (this.options.closeOnOverlay && e.target === this.overlay) {
      this.close();
    }
  }

  /**
   * Update modal content
   * @param {string|HTMLElement} content - New content (trusted only!)
   */
  setContent(content) {
    if (!this.container) return;

    const body = this.container.querySelector('.modal-body');
    if (!body) return;

    body.textContent = '';

    if (typeof content === 'string') {
      // Using template element for trusted HTML content
      const template = document.createElement('template');
      template.innerHTML = content;
      body.appendChild(template.content);
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
  }

  /**
   * Update modal title
   */
  setTitle(title) {
    if (!this.container) return;

    const titleEl = this.container.querySelector('.modal-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Destroy modal and clean up
   */
  destroy() {
    this.close();
    this.overlay = null;
    this.container = null;
  }
}

/**
 * Create a modal instance
 * @param {Object} options - Modal options
 * @returns {Modal} Modal instance
 */
export function createModal(options) {
  return new Modal(options);
}

export default Modal;
