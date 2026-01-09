/**
 * History Page Logic
 * Handles event history display, filtering, pagination, and actions
 */

import historyFixtures from '../fixtures/history-data.js';
import { createModal } from '../components/modal.js';
import { createPagination } from '../components/pagination.js';
import { createMultiSelect } from '../components/multi-select.js';
import { createElement } from '../utils/dom.js';
import { formatRelativeTime } from '../utils/dom.js';
import { local } from '../utils/storage.js';

class HistoryPage {
  constructor() {
    this.events = [];
    this.filteredEvents = [];
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.filters = {
      dateFrom: null,
      dateTo: null,
      searchText: '',
      types: ['task', 'event', 'reminder'],
      statuses: ['success', 'failed', 'pending']
    };

    // Load feedback from localStorage
    this.feedback = local.get('event_feedback', {});

    // Store multi-select references
    this.typeSelect = null;
    this.statusSelect = null;
  }

  /**
   * Initialize the history page
   */
  async init() {
    // Load events from fixtures
    await this.loadEvents();

    // Create multi-select dropdowns
    this.createMultiSelects();

    // Set up filter listeners
    this.setupFilters();

    // Initial render
    this.applyFilters();
    this.renderList();
    this.renderPagination();
  }

  /**
   * Create multi-select dropdown components
   */
  createMultiSelects() {
    // Type filter
    const typeContainer = document.getElementById('type-filter-container');
    if (typeContainer) {
      this.typeSelect = createMultiSelect({
        id: 'type-multi-select',
        label: 'Types',
        options: [
          { value: 'task', label: 'Task', color: 'task' },
          { value: 'event', label: 'Event', color: 'event' },
          { value: 'reminder', label: 'Reminder', color: 'reminder' }
        ],
        defaultSelected: ['task', 'event', 'reminder'],
        onChange: (selected) => {
          this.filters.types = selected;
          this.applyFiltersAndRender();
        }
      });
      typeContainer.appendChild(this.typeSelect);
    }

    // Status filter
    const statusContainer = document.getElementById('status-filter-container');
    if (statusContainer) {
      this.statusSelect = createMultiSelect({
        id: 'status-multi-select',
        label: 'Statuses',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'failed', label: 'Failed' },
          { value: 'pending', label: 'Pending' }
        ],
        defaultSelected: ['success', 'failed', 'pending'],
        onChange: (selected) => {
          this.filters.statuses = selected;
          this.applyFiltersAndRender();
        }
      });
      statusContainer.appendChild(this.statusSelect);
    }
  }

  /**
   * Load events from fixtures (simulates API call)
   */
  async loadEvents() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clone fixtures and merge with saved feedback
    this.events = historyFixtures.map(event => ({
      ...event,
      feedback: this.feedback[event.id] || event.feedback
    }));

    // Sort by timestamp (newest first)
    this.events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Set up filter event listeners
   */
  setupFilters() {
    // Date filters
    const dateFrom = document.getElementById('filter-date-from');
    const dateTo = document.getElementById('filter-date-to');

    if (dateFrom) {
      dateFrom.addEventListener('change', () => {
        this.filters.dateFrom = dateFrom.value ? new Date(dateFrom.value) : null;
        this.applyFiltersAndRender();
      });
    }

    if (dateTo) {
      dateTo.addEventListener('change', () => {
        this.filters.dateTo = dateTo.value ? new Date(dateTo.value + 'T23:59:59') : null;
        this.applyFiltersAndRender();
      });
    }

    // Text search
    const searchInput = document.getElementById('filter-text');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filters.searchText = searchInput.value.toLowerCase();
        this.applyFiltersAndRender();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  /**
   * Reset all filters to default
   */
  resetFilters() {
    // Reset filter state
    this.filters = {
      dateFrom: null,
      dateTo: null,
      searchText: '',
      types: ['task', 'event', 'reminder'],
      statuses: ['success', 'failed', 'pending']
    };

    // Reset UI
    const dateFrom = document.getElementById('filter-date-from');
    const dateTo = document.getElementById('filter-date-to');
    const searchInput = document.getElementById('filter-text');

    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';
    if (searchInput) searchInput.value = '';

    // Reset multi-select dropdowns
    if (this.typeSelect && this.typeSelect.setSelected) {
      this.typeSelect.setSelected(['task', 'event', 'reminder']);
    }

    if (this.statusSelect && this.statusSelect.setSelected) {
      this.statusSelect.setSelected(['success', 'failed', 'pending']);
    }

    this.applyFiltersAndRender();
  }

  /**
   * Apply filters to events
   */
  applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.timestamp);

      // Date range filter
      if (this.filters.dateFrom && eventDate < this.filters.dateFrom) return false;
      if (this.filters.dateTo && eventDate > this.filters.dateTo) return false;

      // Text search (search in input text)
      if (this.filters.searchText && !event.inputText.toLowerCase().includes(this.filters.searchText)) {
        return false;
      }

      // Type filter
      if (!this.filters.types.includes(event.type)) return false;

      // Status filter
      if (!this.filters.statuses.includes(event.status)) return false;

      return true;
    });

    this.currentPage = 1; // Reset to first page when filters change
  }

  /**
   * Apply filters and re-render
   */
  applyFiltersAndRender() {
    this.applyFilters();
    this.renderList();
    this.renderPagination();
  }

  /**
   * Render the event list for current page
   */
  renderList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageEvents = this.filteredEvents.slice(start, end);

    const container = document.getElementById('history-list');
    if (!container) return;

    container.textContent = '';

    if (pageEvents.length === 0) {
      // Empty state
      const emptyState = createElement('div', {
        style: 'text-align: center; padding: 3rem; color: var(--color-text-secondary);'
      });

      const icon = createElement('span', {
        className: 'material-symbols-outlined',
        style: 'font-size: 4rem; opacity: 0.3;'
      }, 'search_off');

      const text = createElement('p', {
        style: 'margin-top: 1rem; font-size: var(--text-lg);'
      }, 'No events found matching your filters');

      emptyState.appendChild(icon);
      emptyState.appendChild(text);
      container.appendChild(emptyState);

      // Update count
      document.getElementById('result-count').textContent = 'No events found';
      return;
    }

    pageEvents.forEach(event => {
      const item = this.createEventItem(event);
      container.appendChild(item);
    });

    // Update count
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
      resultCount.textContent = `Showing ${start + 1}-${Math.min(end, this.filteredEvents.length)} of ${this.filteredEvents.length} events`;
    }
  }

  /**
   * Create an event list item
   */
  createEventItem(event) {
    const item = createElement('div', {
      className: 'list-item event-item',
      'data-status': event.status,
      'data-type': event.type
    });

    // Header with badges and details button
    const header = createElement('div', {
      className: 'list-item-header'
    });

    const meta = createElement('div', {
      className: 'list-item-meta'
    });

    // Type badge
    const typeBadge = createElement('span', {
      className: `badge badge-${event.type}`
    }, event.type.charAt(0).toUpperCase() + event.type.slice(1));

    // Status badge
    const statusBadge = createElement('span', {
      className: `status-badge-${event.status}`
    }, event.status);

    // Timestamp
    const timestamp = createElement('span', {
      className: 'timestamp'
    }, formatRelativeTime(event.timestamp));

    meta.appendChild(typeBadge);
    meta.appendChild(statusBadge);
    meta.appendChild(timestamp);

    // Details button
    const detailsBtn = createElement('button', {
      className: 'btn-icon-sm',
      title: 'View details',
      onclick: () => this.openEventDetails(event)
    });

    const detailsIcon = createElement('span', {
      className: 'material-symbols-outlined icon-md'
    }, 'open_in_full');

    detailsBtn.appendChild(detailsIcon);

    header.appendChild(meta);
    header.appendChild(detailsBtn);

    // Event text (truncated)
    const text = createElement('p', {
      className: 'list-item-text truncated'
    }, `"${event.inputText}"`);

    // Divider
    const divider = createElement('div', {
      className: 'divider'
    });

    // Footer with result and actions
    const footer = createElement('div', {
      className: 'list-item-footer'
    });

    // Result
    const resultDiv = createElement('div', {
      className: 'event-result'
    });

    const resultIcon = createElement('span', {
      className: 'material-symbols-outlined icon-sm'
    }, event.status === 'success' ? 'check_circle' : event.status === 'failed' ? 'error' : 'pending');

    const resultText = createElement('span', {}, event.result);

    resultDiv.appendChild(resultIcon);
    resultDiv.appendChild(resultText);

    // Actions
    const actions = createElement('div', {
      className: 'event-actions'
    });

    // Retry button (only for failed events)
    if (event.status === 'failed') {
      const retryBtn = createElement('button', {
        className: 'btn btn-xs btn-secondary retry-btn',
        onclick: () => this.retryEvent(event.id)
      });

      const retryIcon = createElement('span', {
        className: 'material-symbols-outlined icon-sm'
      }, 'refresh');

      const retryText = createElement('span', {}, 'Retry');

      retryBtn.appendChild(retryIcon);
      retryBtn.appendChild(retryText);

      actions.appendChild(retryBtn);
    }

    // Feedback buttons
    const thumbsUpBtn = createElement('button', {
      className: `btn-icon-sm feedback-btn ${event.feedback === 'up' ? 'active up' : ''}`,
      'data-feedback': 'up',
      title: 'Helpful',
      onclick: () => this.submitFeedback(event.id, 'up')
    });

    const thumbsUpIcon = createElement('span', {
      className: 'material-symbols-outlined icon-sm'
    }, 'thumb_up');

    thumbsUpBtn.appendChild(thumbsUpIcon);

    const thumbsDownBtn = createElement('button', {
      className: `btn-icon-sm feedback-btn ${event.feedback === 'down' ? 'active down' : ''}`,
      'data-feedback': 'down',
      title: 'Not helpful',
      onclick: () => this.submitFeedback(event.id, 'down')
    });

    const thumbsDownIcon = createElement('span', {
      className: 'material-symbols-outlined icon-sm'
    }, 'thumb_down');

    thumbsDownBtn.appendChild(thumbsDownIcon);

    actions.appendChild(thumbsUpBtn);
    actions.appendChild(thumbsDownBtn);

    footer.appendChild(resultDiv);
    footer.appendChild(actions);

    // Assemble item
    item.appendChild(header);
    item.appendChild(text);
    item.appendChild(divider);
    item.appendChild(footer);

    return item;
  }

  /**
   * Open modal with event details
   */
  openEventDetails(event) {
    // Build detailed content
    const content = createElement('div', {
      className: 'event-details'
    });

    // Input section
    const inputHeading = createElement('h3', {}, 'Input');
    const inputText = createElement('p', {}, event.inputText);
    content.appendChild(inputHeading);
    content.appendChild(inputText);

    // Result section
    const resultHeading = createElement('h3', {}, 'Result');
    const resultText = createElement('p', {}, event.result);
    content.appendChild(resultHeading);
    content.appendChild(resultText);

    // Output data (if exists)
    if (event.output) {
      const outputHeading = createElement('h3', {}, 'Details');
      const outputPre = createElement('pre', {
        style: 'background: var(--color-surface-highlight); padding: 1rem; border-radius: var(--radius-md); overflow-x: auto;'
      }, JSON.stringify(event.output, null, 2));
      content.appendChild(outputHeading);
      content.appendChild(outputPre);
    }

    // Error (if failed)
    if (event.error) {
      const errorHeading = createElement('h3', {}, 'Error');
      const errorText = createElement('p', {
        style: 'color: var(--color-status-purple);'
      }, event.error);
      content.appendChild(errorHeading);
      content.appendChild(errorText);
    }

    // Status and timestamp
    const statusHeading = createElement('h3', {}, 'Status & Time');
    const statusText = createElement('p', {},
      `Status: ${event.status} | Processed: ${new Date(event.timestamp).toLocaleString()}`
    );
    content.appendChild(statusHeading);
    content.appendChild(statusText);

    // Create and open modal
    const modal = createModal({
      title: `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event Details`,
      content: content,
      size: 'medium'
    });

    modal.open();
  }

  /**
   * Retry a failed event
   */
  async retryEvent(eventId) {
    // Find the event
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    // Simulate retry (in real app, would call API)
    const event = this.events[eventIndex];

    // Update status to pending
    event.status = 'pending';
    event.result = 'Retrying...';

    // Re-render
    this.renderList();

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Randomly succeed or fail
    const success = Math.random() > 0.3;

    if (success) {
      event.status = 'success';
      event.result = 'Successfully processed on retry';
      event.error = undefined;
    } else {
      event.status = 'failed';
      event.result = 'Failed to process';
      event.error = 'Retry failed. Please check the input and try again.';
    }

    // Re-render
    this.applyFilters();
    this.renderList();
  }

  /**
   * Submit feedback (thumbs up/down)
   */
  submitFeedback(eventId, feedbackType) {
    // Find the event
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    // Toggle feedback (click same button to remove)
    if (event.feedback === feedbackType) {
      event.feedback = null;
      delete this.feedback[eventId];
    } else {
      event.feedback = feedbackType;
      this.feedback[eventId] = feedbackType;
    }

    // Save to localStorage
    local.set('event_feedback', this.feedback);

    // Re-render
    this.renderList();
  }

  /**
   * Render pagination controls
   */
  renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    createPagination(container, {
      totalItems: this.filteredEvents.length,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      onPageChange: (page) => {
        this.currentPage = page;
        this.renderList();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// Export function to initialize history page
export async function initHistoryPage() {
  const historyPage = new HistoryPage();
  await historyPage.init();
}

export default HistoryPage;
