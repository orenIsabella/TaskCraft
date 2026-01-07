/**
 * Pagination Component
 * Handles page navigation for lists
 */

import { createElement } from '../utils/dom.js';

/**
 * Create pagination controls
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Pagination options
 */
export function createPagination(container, options = {}) {
  const {
    totalItems = 0,
    itemsPerPage = 20,
    currentPage = 1,
    maxVisiblePages = 5,
    onPageChange = () => {}
  } = options;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Clear container
  container.textContent = '';

  if (totalPages <= 1) {
    // Don't show pagination if only one page
    return;
  }

  // Create pagination wrapper
  const pagination = createElement('div', {
    className: 'pagination'
  });

  // Previous button
  const prevBtn = createElement('button', {
    className: `pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`,
    disabled: currentPage === 1,
    onclick: () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  });

  const prevIcon = createElement('span', {
    className: 'material-symbols-outlined icon-md'
  }, 'chevron_left');

  const prevText = createElement('span', {}, 'Previous');

  prevBtn.appendChild(prevIcon);
  prevBtn.appendChild(prevText);

  // Page numbers
  const pages = createElement('div', {
    className: 'pagination-pages'
  });

  const pageNumbers = getPageNumbers(currentPage, totalPages, maxVisiblePages);

  pageNumbers.forEach(page => {
    if (page === '...') {
      const ellipsis = createElement('span', {
        className: 'pagination-ellipsis'
      }, '...');
      pages.appendChild(ellipsis);
    } else {
      const pageBtn = createElement('button', {
        className: `pagination-page ${page === currentPage ? 'active' : ''}`,
        onclick: () => onPageChange(page)
      }, String(page));
      pages.appendChild(pageBtn);
    }
  });

  // Next button
  const nextBtn = createElement('button', {
    className: `pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`,
    disabled: currentPage === totalPages,
    onclick: () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  });

  const nextText = createElement('span', {}, 'Next');

  const nextIcon = createElement('span', {
    className: 'material-symbols-outlined icon-md'
  }, 'chevron_right');

  nextBtn.appendChild(nextText);
  nextBtn.appendChild(nextIcon);

  // Page info
  const pageInfo = createElement('div', {
    className: 'pagination-info'
  }, `Page ${currentPage} of ${totalPages}`);

  // Assemble pagination
  pagination.appendChild(prevBtn);
  pagination.appendChild(pages);
  pagination.appendChild(nextBtn);
  pagination.appendChild(pageInfo);

  container.appendChild(pagination);
}

/**
 * Calculate which page numbers to show
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @param {number} maxVisible - Maximum visible page buttons
 * @returns {Array} Array of page numbers and ellipsis
 */
function getPageNumbers(current, total, maxVisible) {
  if (total <= maxVisible) {
    // Show all pages
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  let start = Math.max(2, current - halfVisible);
  let end = Math.min(total - 1, current + halfVisible);

  // Adjust if at beginning or end
  if (current <= halfVisible) {
    end = maxVisible - 1;
  } else if (current >= total - halfVisible) {
    start = total - maxVisible + 2;
  }

  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (end < total - 1) {
    pages.push('...');
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export default createPagination;
