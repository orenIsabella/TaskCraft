import { createSignal, Show } from 'solid-js';
import { api } from '../lib/api';
import { auth } from '../lib/auth';

interface EventDraft {
  title: string;
  start_at: string | null;
  end_at: string | null;
  notes: string;
  missing_info: string[];
}

interface TaskCreateResponse {
  raw_text: string;
  event: EventDraft;
}

export default function Dashboard() {
  const [taskText, setTaskText] = createSignal('');
  const [isGenerating, setIsGenerating] = createSignal(false);
  const [lastEvent, setLastEvent] = createSignal<EventDraft | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  const handleGenerate = async () => {
    const text = taskText().trim();

    if (!text) {
      setError('Please enter a task');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setLastEvent(null);

      const user = auth.getUser();
      const payload = {
        text,
        email: user ? user.email : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jerusalem"
      };

      const response: TaskCreateResponse = await api.post('/tasks', payload);
      console.log('Generated task output:', response);

      setLastEvent(response.event);
      setTaskText('');
    } catch (err: any) {
      console.error('Failed to generate tasks:', err);

      if (err.status === 503) {
        setError('AI service is temporarily unavailable. Please try again later.');
      } else if (err.status >= 400 && err.status < 500) {
        setError(err.data?.detail || 'Invalid request. Please check your input.');
      } else {
        setError('Failed to generate task. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div class="hero-grid">
      <div class="hero-main">
        <div class="flex-col gap-4">
          <h1 class="heading-hero">
            Turn Chaos into <span class="highlight">Calendar.</span>
          </h1>
          <p class="subtitle">
            Simply type your next tasks below and we'll handle the rest.
          </p>
        </div>

        <Show when={error()}>
          <div class="alert alert-error">
            <span class="material-symbols-outlined alert-icon">error</span>
            <div class="alert-content">{error()}</div>
          </div>
        </Show>

        <Show when={lastEvent()}>
          {(event) => (
            <div class="event-result">
              <div class="event-result-header">
                <span class="material-symbols-outlined event-result-icon">check_circle</span>
                <div class="event-result-body">
                  <h3 class="event-result-title">
                    Event Created: {event().title}
                  </h3>

                  <Show when={event().start_at || event().end_at}>
                    <div class="event-result-meta">
                      <Show when={event().start_at}>
                        <div>
                          <strong>Start:</strong> {formatDateTime(event().start_at)}
                        </div>
                      </Show>
                      <Show when={event().end_at}>
                        <div>
                          <strong>End:</strong> {formatDateTime(event().end_at)}
                        </div>
                      </Show>
                    </div>
                  </Show>

                  <Show when={event().notes}>
                    <div class="event-result-notes">
                      <strong>Notes:</strong> {event().notes}
                    </div>
                  </Show>

                  <Show when={event().missing_info.length > 0}>
                    <div class="event-missing-info">
                      <div class="event-missing-info-header">
                        <span class="material-symbols-outlined">warning</span>
                        <strong>Missing Information</strong>
                      </div>
                      <ul>
                        {event().missing_info.map((info) => (
                          <li>{info}</li>
                        ))}
                      </ul>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          )}
        </Show>

        <div class="card card-input">
          <div class="blob-decorator"></div>
          <label class="form-group">
            <span class="form-label">What's on your mind?</span>
            <div class="input-wrapper">
              <textarea
                id="task-input"
                class="textarea"
                placeholder="e.g., Lunch with Sarah next Tuesday at 1pm, then remind me to call the plumber..."
                value={taskText()}
                onInput={(e) => setTaskText(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
              />
              <div class="input-actions">
                <span class="input-hint">Press Enter to send</span>
                <button
                  id="generate-btn"
                  class="btn btn-md btn-primary"
                  onClick={handleGenerate}
                  disabled={isGenerating()}
                >
                  <span class="material-symbols-outlined icon-lg">auto_awesome</span>
                  <span>{isGenerating() ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </label>
        </div>

        <div class="action-buttons">
          <button id="manual-event-btn" class="btn btn-sm btn-secondary">
            <span class="material-symbols-outlined icon-lg">add_circle</span>
            <span>Create Manual Event</span>
          </button>
          <button id="import-csv-btn" class="btn btn-sm btn-outline">
            <span class="material-symbols-outlined icon-lg">upload_file</span>
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      <div class="hero-sidebar">
        <div class="card card-primary">
          <div class="icon-decorator">
            <span class="material-symbols-outlined">phonelink_setup</span>
          </div>
          <div class="mobile-card-content">
            <div class="icon-badge">
              <span class="material-symbols-outlined icon-xl">qr_code_scanner</span>
            </div>
            <h3 class="mobile-card-title">Take it to go.</h3>
            <p class="mobile-card-text">
              Don't lose that thought. Scan to sync instantly with our mobile companion.
            </p>
            <button class="btn btn-md btn-dark w-full mt-2">
              View Instructions
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="section-heading">Last Processed</h2>
            <a href="/history" class="btn btn-text">View All</a>
          </div>
          <div id="last-processed-list" class="list-container custom-scrollbar">
            <div class="list-item">
              <div class="list-item-header">
                <div class="list-item-meta">
                  <span class="badge badge-task">Task</span>
                  <span class="timestamp">2 mins ago</span>
                </div>
                <span class="material-symbols-outlined chevron-icon icon-md">chevron_right</span>
              </div>
              <p class="list-item-text">"Buy almond milk and coffee beans on the way home"</p>
              <div class="divider"></div>
              <div class="list-item-footer">
                <span class="material-symbols-outlined icon-sm">check_circle</span>
                <span>Added to Grocery List</span>
              </div>
            </div>

            <div class="list-item">
              <div class="list-item-header">
                <div class="list-item-meta">
                  <span class="badge badge-event">Event</span>
                  <span class="timestamp">1 hour ago</span>
                </div>
                <span class="material-symbols-outlined chevron-icon icon-md">chevron_right</span>
              </div>
              <p class="list-item-text">"Sync with dev team tomorrow at 10am about the API"</p>
              <div class="divider"></div>
              <div class="list-item-footer">
                <span class="material-symbols-outlined icon-sm">event</span>
                <span>Dev Sync · Tomorrow 10:00 AM</span>
              </div>
            </div>

            <div class="list-item">
              <div class="list-item-header">
                <div class="list-item-meta">
                  <span class="badge badge-reminder">Reminder</span>
                  <span class="timestamp">Yesterday</span>
                </div>
                <span class="material-symbols-outlined chevron-icon icon-md">chevron_right</span>
              </div>
              <p class="list-item-text">"Cancel netflix subscription before the 15th"</p>
              <div class="divider"></div>
              <div class="list-item-footer">
                <span class="material-symbols-outlined icon-sm">notifications</span>
                <span>Set for: Oct 14th, 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
