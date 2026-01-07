/**
 * Multi-Select Dropdown Component
 * A modern, accessible multi-select dropdown with chip-style selected items
 */

/**
 * Create a multi-select dropdown
 * @param {Object} config - Configuration object
 * @param {string} config.id - Unique ID for the dropdown
 * @param {string} config.label - Label for the dropdown
 * @param {Array} config.options - Array of {value, label, color} objects
 * @param {Array} config.defaultSelected - Array of default selected values
 * @param {Function} config.onChange - Callback when selection changes
 * @returns {HTMLElement} The dropdown container element
 */
export function createMultiSelect(config) {
  const {
    id,
    label,
    options = [],
    defaultSelected = [],
    onChange = () => {}
  } = config;

  const selected = new Set(defaultSelected);

  // Container
  const container = document.createElement('div');
  container.className = 'multi-select';
  container.id = id;

  // Trigger button
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'multi-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const triggerContent = document.createElement('span');
  triggerContent.className = 'multi-select-trigger-content';
  updateTriggerText();

  const chevron = document.createElement('span');
  chevron.className = 'material-symbols-outlined multi-select-chevron';
  chevron.textContent = 'expand_more';

  trigger.appendChild(triggerContent);
  trigger.appendChild(chevron);

  // Dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'multi-select-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-multiselectable', 'true');

  // Options list
  options.forEach(option => {
    const optionEl = document.createElement('div');
    optionEl.className = 'multi-select-option';
    optionEl.setAttribute('role', 'option');
    optionEl.setAttribute('data-value', option.value);
    optionEl.setAttribute('aria-selected', selected.has(option.value));

    if (selected.has(option.value)) {
      optionEl.classList.add('selected');
    }

    const checkbox = document.createElement('div');
    checkbox.className = 'multi-select-checkbox';

    const checkIcon = document.createElement('span');
    checkIcon.className = 'material-symbols-outlined';
    checkIcon.textContent = 'check';
    checkbox.appendChild(checkIcon);

    const labelEl = document.createElement('span');
    labelEl.textContent = option.label;

    if (option.color) {
      const badge = document.createElement('span');
      badge.className = `badge badge-${option.color}`;
      badge.textContent = option.label;
      optionEl.appendChild(checkbox);
      optionEl.appendChild(badge);
    } else {
      optionEl.appendChild(checkbox);
      optionEl.appendChild(labelEl);
    }

    optionEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleOption(option.value);
    });

    dropdown.appendChild(optionEl);
  });

  container.appendChild(trigger);
  container.appendChild(dropdown);

  // Toggle dropdown
  let isOpen = false;
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    container.classList.toggle('open', isOpen);
    trigger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target) && isOpen) {
      isOpen = false;
      container.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  function toggleOption(value) {
    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }

    // Update UI
    const optionEl = dropdown.querySelector(`[data-value="${value}"]`);
    if (optionEl) {
      optionEl.classList.toggle('selected');
      optionEl.setAttribute('aria-selected', selected.has(value));
    }

    updateTriggerText();
    onChange(Array.from(selected));
  }

  function updateTriggerText() {
    const count = selected.size;
    if (count === 0) {
      triggerContent.textContent = `Select ${label}`;
      triggerContent.classList.add('placeholder');
    } else if (count === options.length) {
      triggerContent.textContent = `All ${label}`;
      triggerContent.classList.remove('placeholder');
    } else {
      const selectedOptions = options.filter(o => selected.has(o.value));
      triggerContent.textContent = selectedOptions.map(o => o.label).join(', ');
      triggerContent.classList.remove('placeholder');
    }
  }

  // Public API
  container.getSelected = () => Array.from(selected);
  container.setSelected = (values) => {
    selected.clear();
    values.forEach(v => selected.add(v));

    dropdown.querySelectorAll('.multi-select-option').forEach(opt => {
      const value = opt.getAttribute('data-value');
      const isSelected = selected.has(value);
      opt.classList.toggle('selected', isSelected);
      opt.setAttribute('aria-selected', isSelected);
    });

    updateTriggerText();
  };

  return container;
}
