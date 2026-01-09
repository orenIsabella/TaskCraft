/**
 * Settings Modal Component
 * Large modal for application settings
 */

import { createModal } from './modal.js';
import { createElement } from '../utils/dom.js';
import { local } from '../utils/storage.js';

/**
 * Open the settings modal
 */
export function openSettingsModal() {
  const content = createSettingsContent();

  const modal = createModal({
    title: 'Settings',
    content: content,
    size: 'large'
  });

  modal.open();
}

/**
 * Create settings content
 */
function createSettingsContent() {
  const container = createElement('div', {
    className: 'settings-content'
  });

  // Settings sections
  const sections = [
    createAccountSection(),
    createNotificationsSection(),
    createCalendarSection(),
    createAppearanceSection(),
    createPrivacySection()
  ];

  sections.forEach(section => container.appendChild(section));

  return container;
}

/**
 * Account Settings Section
 */
function createAccountSection() {
  const section = createElement('div', { className: 'settings-section' });

  const header = createElement('h3', { className: 'settings-section-title' }, 'Account');

  const content = createElement('div', { className: 'settings-section-content' });

  // Email
  const emailRow = createSettingRow(
    'Email Address',
    'demo@taskcraft.com',
    'email',
    false
  );

  // Name
  const nameRow = createSettingRow(
    'Display Name',
    'Demo User',
    'person',
    false
  );

  // Change Password Button
  const passwordRow = createElement('div', { className: 'setting-row' });
  const passwordLabel = createElement('div', { className: 'setting-label' });
  const passwordIcon = createElement('span', { className: 'material-symbols-outlined icon-md' }, 'lock');
  const passwordText = createElement('div', {});
  const passwordTitle = createElement('div', { className: 'setting-title' }, 'Password');
  const passwordDesc = createElement('div', { className: 'setting-description' }, 'Change your account password');
  passwordText.appendChild(passwordTitle);
  passwordText.appendChild(passwordDesc);
  passwordLabel.appendChild(passwordIcon);
  passwordLabel.appendChild(passwordText);

  const passwordBtn = createElement('button', {
    className: 'btn btn-sm btn-secondary'
  }, 'Change Password');

  passwordRow.appendChild(passwordLabel);
  passwordRow.appendChild(passwordBtn);

  content.appendChild(emailRow);
  content.appendChild(nameRow);
  content.appendChild(passwordRow);

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

/**
 * Notifications Section
 */
function createNotificationsSection() {
  const section = createElement('div', { className: 'settings-section' });

  const header = createElement('h3', { className: 'settings-section-title' }, 'Notifications');

  const content = createElement('div', { className: 'settings-section-content' });

  // Enable notifications
  const notifRow = createSettingToggle(
    'Enable Notifications',
    'Receive notifications for upcoming events and reminders',
    'notifications',
    'enable_notifications',
    true
  );

  // Email notifications
  const emailRow = createSettingToggle(
    'Email Notifications',
    'Get email summaries of your daily tasks',
    'email',
    'email_notifications',
    false
  );

  // Sound
  const soundRow = createSettingToggle(
    'Notification Sound',
    'Play a sound when you receive notifications',
    'volume_up',
    'notification_sound',
    true
  );

  content.appendChild(notifRow);
  content.appendChild(emailRow);
  content.appendChild(soundRow);

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

/**
 * Calendar Integration Section
 */
function createCalendarSection() {
  const section = createElement('div', { className: 'settings-section' });

  const header = createElement('h3', { className: 'settings-section-title' }, 'Calendar Integration');

  const content = createElement('div', { className: 'settings-section-content' });

  // Connected calendar
  const calendarRow = createElement('div', { className: 'setting-row' });
  const calendarLabel = createElement('div', { className: 'setting-label' });
  const calendarIcon = createElement('span', { className: 'material-symbols-outlined icon-md' }, 'event');
  const calendarText = createElement('div', {});
  const calendarTitle = createElement('div', { className: 'setting-title' }, 'Connected Calendar');
  const calendarDesc = createElement('div', { className: 'setting-description' }, 'Google Calendar - demo@taskcraft.com');
  calendarText.appendChild(calendarTitle);
  calendarText.appendChild(calendarDesc);
  calendarLabel.appendChild(calendarIcon);
  calendarLabel.appendChild(calendarText);

  const calendarBtn = createElement('button', {
    className: 'btn btn-sm btn-secondary'
  }, 'Disconnect');

  calendarRow.appendChild(calendarLabel);
  calendarRow.appendChild(calendarBtn);

  // Default calendar
  const defaultRow = createSettingRow(
    'Default Calendar',
    'Primary',
    'calendar_today',
    false
  );

  // Auto-sync
  const syncRow = createSettingToggle(
    'Auto-Sync',
    'Automatically sync events to your calendar',
    'sync',
    'auto_sync',
    true
  );

  content.appendChild(calendarRow);
  content.appendChild(defaultRow);
  content.appendChild(syncRow);

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

/**
 * Appearance Section
 */
function createAppearanceSection() {
  const section = createElement('div', { className: 'settings-section' });

  const header = createElement('h3', { className: 'settings-section-title' }, 'Appearance');

  const content = createElement('div', { className: 'settings-section-content' });

  // Theme selector
  const themeRow = createElement('div', { className: 'setting-row' });
  const themeLabel = createElement('div', { className: 'setting-label' });
  const themeIcon = createElement('span', { className: 'material-symbols-outlined icon-md' }, 'palette');
  const themeText = createElement('div', {});
  const themeTitle = createElement('div', { className: 'setting-title' }, 'Theme');
  const themeDesc = createElement('div', { className: 'setting-description' }, 'Choose your color theme from the header');
  themeText.appendChild(themeTitle);
  themeText.appendChild(themeDesc);
  themeLabel.appendChild(themeIcon);
  themeLabel.appendChild(themeText);

  themeRow.appendChild(themeLabel);

  // Compact mode
  const compactRow = createSettingToggle(
    'Compact Mode',
    'Reduce spacing for a denser interface',
    'compress',
    'compact_mode',
    false
  );

  content.appendChild(themeRow);
  content.appendChild(compactRow);

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

/**
 * Privacy & Security Section
 */
function createPrivacySection() {
  const section = createElement('div', { className: 'settings-section' });

  const header = createElement('h3', { className: 'settings-section-title' }, 'Privacy & Security');

  const content = createElement('div', { className: 'settings-section-content' });

  // Analytics
  const analyticsRow = createSettingToggle(
    'Usage Analytics',
    'Help improve TaskCraft by sharing anonymous usage data',
    'analytics',
    'usage_analytics',
    true
  );

  // Data export
  const exportRow = createElement('div', { className: 'setting-row' });
  const exportLabel = createElement('div', { className: 'setting-label' });
  const exportIcon = createElement('span', { className: 'material-symbols-outlined icon-md' }, 'download');
  const exportText = createElement('div', {});
  const exportTitle = createElement('div', { className: 'setting-title' }, 'Export Data');
  const exportDesc = createElement('div', { className: 'setting-description' }, 'Download all your data in JSON format');
  exportText.appendChild(exportTitle);
  exportText.appendChild(exportDesc);
  exportLabel.appendChild(exportIcon);
  exportLabel.appendChild(exportText);

  const exportBtn = createElement('button', {
    className: 'btn btn-sm btn-secondary',
    onclick: () => alert('Export functionality coming soon!')
  }, 'Export');

  exportRow.appendChild(exportLabel);
  exportRow.appendChild(exportBtn);

  // Delete account
  const deleteRow = createElement('div', { className: 'setting-row' });
  const deleteLabel = createElement('div', { className: 'setting-label' });
  const deleteIcon = createElement('span', {
    className: 'material-symbols-outlined icon-md',
    style: 'color: var(--color-status-purple);'
  }, 'delete_forever');
  const deleteText = createElement('div', {});
  const deleteTitle = createElement('div', { className: 'setting-title' }, 'Delete Account');
  const deleteDesc = createElement('div', { className: 'setting-description' }, 'Permanently delete your account and all data');
  deleteText.appendChild(deleteTitle);
  deleteText.appendChild(deleteDesc);
  deleteLabel.appendChild(deleteIcon);
  deleteLabel.appendChild(deleteText);

  const deleteBtn = createElement('button', {
    className: 'btn btn-sm btn-outline',
    style: 'color: var(--color-status-purple); border-color: var(--color-status-purple);',
    onclick: () => {
      if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        alert('Account deletion is disabled in demo mode');
      }
    }
  }, 'Delete');

  deleteRow.appendChild(deleteLabel);
  deleteRow.appendChild(deleteBtn);

  content.appendChild(analyticsRow);
  content.appendChild(exportRow);
  content.appendChild(deleteRow);

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

/**
 * Helper: Create a setting row with label and value
 */
function createSettingRow(title, value, icon, editable = false) {
  const row = createElement('div', { className: 'setting-row' });

  const label = createElement('div', { className: 'setting-label' });
  const iconEl = createElement('span', { className: 'material-symbols-outlined icon-md' }, icon);
  const textDiv = createElement('div', {});
  const titleEl = createElement('div', { className: 'setting-title' }, title);
  const valueEl = createElement('div', { className: 'setting-description' }, value);

  textDiv.appendChild(titleEl);
  textDiv.appendChild(valueEl);
  label.appendChild(iconEl);
  label.appendChild(textDiv);

  row.appendChild(label);

  if (editable) {
    const editBtn = createElement('button', {
      className: 'btn btn-sm btn-secondary'
    }, 'Edit');
    row.appendChild(editBtn);
  }

  return row;
}

/**
 * Helper: Create a toggle setting
 */
function createSettingToggle(title, description, icon, settingKey, defaultValue) {
  const row = createElement('div', { className: 'setting-row' });

  const label = createElement('div', { className: 'setting-label' });
  const iconEl = createElement('span', { className: 'material-symbols-outlined icon-md' }, icon);
  const textDiv = createElement('div', {});
  const titleEl = createElement('div', { className: 'setting-title' }, title);
  const descEl = createElement('div', { className: 'setting-description' }, description);

  textDiv.appendChild(titleEl);
  textDiv.appendChild(descEl);
  label.appendChild(iconEl);
  label.appendChild(textDiv);

  // Toggle switch
  const toggleContainer = createElement('label', { className: 'toggle-switch' });
  const currentValue = local.get(`setting_${settingKey}`, defaultValue);

  const checkbox = createElement('input', {
    type: 'checkbox',
    checked: currentValue
  });

  checkbox.addEventListener('change', (e) => {
    local.set(`setting_${settingKey}`, e.target.checked);
  });

  const slider = createElement('span', { className: 'toggle-slider' });

  toggleContainer.appendChild(checkbox);
  toggleContainer.appendChild(slider);

  row.appendChild(label);
  row.appendChild(toggleContainer);

  return row;
}
