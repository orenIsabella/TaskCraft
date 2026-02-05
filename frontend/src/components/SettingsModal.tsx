import { createSignal, createEffect, onCleanup } from 'solid-js';
import Modal from './Modal';
import { api } from '../lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  ai_context: string;
  auto_sync: boolean;
  usage_analytics: boolean;
}

export default function SettingsModal(props: SettingsModalProps) {
  const [autoSync, setAutoSync] = createSignal(
    localStorage.getItem('setting_auto_sync') !== 'false'
  );
  const [usageAnalytics, setUsageAnalytics] = createSignal(
    localStorage.getItem('setting_usage_analytics') !== 'false'
  );
  const [aiContext, setAiContext] = createSignal(
    localStorage.getItem('setting_ai_context') || ''
  );
  const [isLoading, setIsLoading] = createSignal(false);

  // Fetch settings from backend when modal opens
  createEffect(() => {
    if (props.isOpen) {
      fetchSettings();
    }
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const settings: Settings = await api.get('/settings');

      setAiContext(settings.ai_context || '');
      setAutoSync(settings.auto_sync);
      setUsageAnalytics(settings.usage_analytics);

      // Update localStorage cache
      localStorage.setItem('setting_ai_context', settings.ai_context || '');
      localStorage.setItem('setting_auto_sync', String(settings.auto_sync));
      localStorage.setItem('setting_usage_analytics', String(settings.usage_analytics));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Keep using localStorage values on error
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<Settings>) => {
    try {
      await api.patch('/settings', updates);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleToggle = (key: string, setter: (value: boolean) => void) => (e: InputEvent) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    setter(checked);
    localStorage.setItem(`setting_${key}`, String(checked));

    // Save to backend
    const updates: Partial<Settings> = {};
    if (key === 'auto_sync') updates.auto_sync = checked;
    if (key === 'usage_analytics') updates.usage_analytics = checked;
    saveSettings(updates);
  };

  let textareaDebounceTimer: number | undefined;
  const handleAiContextChange = (e: InputEvent) => {
    const value = (e.currentTarget as HTMLTextAreaElement).value;
    setAiContext(value);
    localStorage.setItem('setting_ai_context', value);

    // Debounce API call
    clearTimeout(textareaDebounceTimer);
    textareaDebounceTimer = setTimeout(() => {
      saveSettings({ ai_context: value });
    }, 1000) as unknown as number;
  };

  onCleanup(() => {
    clearTimeout(textareaDebounceTimer);
  });

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

          </div>
        </div>

        {/* AI Assistant Section */}
        <div class="settings-section">
          <h3 class="settings-section-title">AI Assistant</h3>
          <div class="settings-section-content">
            <div class="setting-row" style={{ "flex-direction": "column", "align-items": "flex-start", gap: "0.75rem" }}>
              <div class="setting-label">
                <span class="material-symbols-outlined icon-md">psychology</span>
                <div>
                  <div class="setting-title">Custom Context</div>
                  <div class="setting-description">Provide additional context to help the AI assistant understand your preferences and needs</div>
                </div>
              </div>
              <textarea
                class="textarea textarea-sm"
                placeholder="E.g., I prefer meetings in the morning, I work on software engineering projects, I need reminders 30 minutes before events..."
                value={aiContext()}
                onInput={handleAiContextChange}
                style={{ width: "100%", resize: "vertical" }}
              />
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
