export default function History() {
  return (
    <div class="history-page">
      <div class="card" style="padding: 1.5rem;">
        <div class="filter-header">
          <h2 class="section-heading">Filters</h2>
          <button class="btn btn-xs btn-text" id="reset-filters">
            <span class="material-symbols-outlined icon-sm">filter_alt_off</span>
            <span>Reset</span>
          </button>
        </div>
        <div class="filter-controls-compact">
          <div class="filter-group-compact">
            <input type="text" id="filter-text" class="filter-input" placeholder="Search events..." />
          </div>

          <div class="filter-group-compact">
            <input type="date" id="filter-date-from" class="filter-input" />
          </div>

          <div class="filter-group-compact">
            <input type="date" id="filter-date-to" class="filter-input" />
          </div>

          <div class="filter-group-compact" id="type-filter-container">
            {/* Multi-select will be inserted here */}
          </div>

          <div class="filter-group-compact" id="status-filter-container">
            {/* Multi-select will be inserted here */}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="section-heading">Event History</h2>
          <span id="result-count" style="font-size: var(--text-sm); color: var(--color-text-secondary);">No events yet</span>
        </div>
        <div id="history-list" class="list-container custom-scrollbar" style="min-height: 300px;">
          <div style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
            <span class="material-symbols-outlined" style="font-size: 4rem; opacity: 0.3;">history</span>
            <p>Your event history will appear here</p>
          </div>
        </div>
      </div>

      <div id="pagination-container"></div>
    </div>
  );
}
