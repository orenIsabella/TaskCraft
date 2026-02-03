export default function Help() {
  return (
    <div class="help-page">
      <div class="card card-hero">
        <div class="blob-decorator"></div>
        <h1 class="heading-hero">Getting Started with TaskCraft</h1>
        <p class="subtitle">Learn how to organize your tasks and events using natural language.</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="section-heading">Quick Start</h2>
        </div>
        <div class="card-content">
          <div class="help-section">
            <div class="help-step">
              <div class="help-step-number">1</div>
              <div class="help-step-content">
                <h3>Enter Your Task</h3>
                <p>Type what you'd like to remember in natural language. No special syntax needed.</p>
                <div class="help-example">
                  <span class="material-symbols-outlined">lightbulb</span>
                  <span>"Lunch with Sarah next Tuesday at 1pm, then remind me to call the plumber on Friday"</span>
                </div>
              </div>
            </div>

            <div class="help-step">
              <div class="help-step-number">2</div>
              <div class="help-step-content">
                <h3>Generate Tasks</h3>
                <p>Click Generate and TaskCraft will parse your input and create tasks, events, and reminders.</p>
              </div>
            </div>

            <div class="help-step">
              <div class="help-step-number">3</div>
              <div class="help-step-content">
                <h3>Review Results</h3>
                <p>Check the results and review what was created. Everything syncs to your calendar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="section-heading">Features</h2>
        </div>
        <div class="card-content">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3>Natural Language Processing</h3>
              <p>Understands your intent and extracts tasks, dates, and context automatically.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">event</span>
              </div>
              <h3>Calendar Integration</h3>
              <p>Events are added to your calendar with the correct date, time, and duration.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">notifications</span>
              </div>
              <h3>Reminders</h3>
              <p>Set up reminders for important tasks and events.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">history</span>
              </div>
              <h3>History</h3>
              <p>Review all processed events and provide feedback to improve accuracy.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">sync</span>
              </div>
              <h3>Auto-Sync</h3>
              <p>Your calendar stays synchronized across all your devices.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">palette</span>
              </div>
              <h3>Themes</h3>
              <p>Choose from multiple color themes to personalize your experience.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="section-heading">Frequently Asked Questions</h2>
        </div>
        <div class="card-content">
          <div class="faq-list">
            <div class="faq-item">
              <h3>What input format does TaskCraft accept?</h3>
              <p>TaskCraft accepts natural language text. Simply describe what you need—mention dates, times, people, and what needs to be done.</p>
            </div>

            <div class="faq-item">
              <h3>Can I use TaskCraft offline?</h3>
              <p>The web app requires an internet connection for processing. Your calendar data syncs to your device and can be accessed offline.</p>
            </div>

            <div class="faq-item">
              <h3>Can I edit tasks and events after creation?</h3>
              <p>Yes. Events sync to your calendar where you can edit them using any calendar application.</p>
            </div>

            <div class="faq-item">
              <h3>How can I provide feedback on results?</h3>
              <p>Visit the History page to review your processed events and provide feedback. This helps improve accuracy over time.</p>
            </div>

            <div class="faq-item">
              <h3>Is my data secure?</h3>
              <p>Yes. We use industry-standard encryption for all data. Your information is never shared with third parties. See the Privacy Policy for details.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card card-centered">
        <h2 class="section-heading">Questions?</h2>
        <p class="text-secondary mb-xl">
          We're here to help. Get in touch with us.
        </p>
        <div class="button-group">
          <button class="btn btn-md btn-primary">
            <span class="material-symbols-outlined icon-lg">email</span>
            <span>Email Support</span>
          </button>
          <button class="btn btn-md btn-secondary">
            <span class="material-symbols-outlined icon-lg">forum</span>
            <span>Community</span>
          </button>
        </div>
      </div>
    </div>
  );
}
