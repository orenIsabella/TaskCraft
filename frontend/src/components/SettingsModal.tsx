import { createSignal } from 'solid-js';
import Modal from './Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal(props: SettingsModalProps) {
  const [enableNotifications, setEnableNotifications] = createSignal(
    localStorage.getItem('setting_enable_notifications') === 'true'
  );
  const [emailNotifications, setEmailNotifications] = createSignal(
    localStorage.getItem('setting_email_notifications') === 'true'
  );
  const [notificationSound, setNotificationSound] = createSignal(
    localStorage.getItem('setting_notification_sound') !== 'false'
  );
  const [autoSync, setAutoSync] = createSignal(
    localStorage.getItem('setting_auto_sync') !== 'false'
  );
  const [compactMode, setCompactMode] = createSignal(
    localStorage.getItem('setting_compact_mode') === 'true'
  );
  const [usageAnalytics, setUsageAnalytics] = createSignal(
    localStorage.getItem('setting_usage_analytics') !== 'false'
  );

  const handleToggle = (key: string, setter: (value: boolean) => void) => (e: InputEvent) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    setter(checked);
    localStorage.setItem(`setting_${key}`, String(checked));
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="Settings" size="large">
      <div class="settings-content">
        {/* Account Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">Account</h3>
          <div class="settings-section-content">
            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">email</span>
                <div>
                  <div class="setting-title">Email Address</div>
                  <div class="setting-description">demo@taskcraft.com</div>
                </div>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">person</span>
                <div>
                  <div class="setting-title">Display Name</div>
                  <div class="setting-description">Demo User</div>
                </div>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">lock</span>
                <div>
                  <div class="setting-title">Password</div>
                  <div class="setting-description">Change your account password</div>
                </div>
              </div>
              <button class="btn btn-sm btn-secondary">Change Password</button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">Notifications</h3>
          <div class="settings-section-content">
            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">notifications</span>
                <div>
                  <div class="setting-title">Enable Notifications</div>
                  <div class="setting-description">Receive notifications for upcoming events and reminders</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={enableNotifications()}
                  onInput={handleToggle('enable_notifications', setEnableNotifications)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">email</span>
                <div>
                  <div class="setting-title">Email Notifications</div>
                  <div class="setting-description">Get email summaries of your daily tasks</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailNotifications()}
                  onInput={handleToggle('email_notifications', setEmailNotifications)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">volume_up</span>
                <div>
                  <div class="setting-title">Notification Sound</div>
                  <div class="setting-description">Play a sound when you receive notifications</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSound()}
                  onInput={handleToggle('notification_sound', setNotificationSound)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Calendar Integration Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">Calendar Integration</h3>
          <div class="settings-section-content">
            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">event</span>
                <div>
                  <div class="setting-title">Connected Calendar</div>
                  <div class="setting-description">Google Calendar - demo@taskcraft.com</div>
                </div>
              </div>
              <button class="btn btn-sm btn-secondary">Disconnect</button>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">calendar_today</span>
                <div>
                  <div class="setting-title">Default Calendar</div>
                  <div class="setting-description">Primary</div>
                </div>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">sync</span>
                <div>
                  <div class="setting-title">Auto-Sync</div>
                  <div class="setting-description">Automatically sync events to your calendar</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoSync()}
                  onInput={handleToggle('auto_sync', setAutoSync)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">Appearance</h3>
          <div class="settings-section-content">
            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">palette</span>
                <div>
                  <div class="setting-title">Theme</div>
                  <div class="setting-description">Choose your color theme from the header</div>
                </div>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">compress</span>
                <div>
                  <div class="setting-title">Compact Mode</div>
                  <div class="setting-description">Reduce spacing for a denser interface</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={compactMode()}
                  onInput={handleToggle('compact_mode', setCompactMode)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">Privacy & Security</h3>
          <div class="settings-section-content">
            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">analytics</span>
                <div>
                  <div class="setting-title">Usage Analytics</div>
                  <div class="setting-description">Help improve TaskCraft by sharing anonymous usage data</div>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  checked={usageAnalytics()}
                  onInput={handleToggle('usage_analytics', setUsageAnalytics)}
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">download</span>
                <div>
                  <div class="setting-title">Export Data</div>
                  <div class="setting-description">Download all your data in JSON format</div>
                </div>
              </div>
              <button
                class="btn btn-sm btn-secondary"
                onClick={() => alert('Export functionality coming soon!')}
              >
                Export
              </button>
            </div>

            <div class="setting-row">
              <div class="setting-label">
                <span
                  class="material-symbols-outlined icon-md"
                  style={{ color: 'var(--color-status-purple)' }}
                >
                  delete_forever
                </span>
                <div>
                  <div class="setting-title">Delete Account</div>
                  <div class="setting-description">Permanently delete your account and all data</div>
                </div>
              </div>
              <button
                class="btn btn-sm btn-outline"
                style={{
                  color: 'var(--color-status-purple)',
                  'border-color': 'var(--color-status-purple)'
                }}
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    alert('Account deletion is disabled in demo mode');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
