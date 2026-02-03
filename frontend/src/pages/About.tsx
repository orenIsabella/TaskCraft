export default function About() {
  return (
    <div class="about-page">
      <div class="card card-hero about-hero">
        <div class="blob-decorator"></div>
        <div class="blob-decorator"></div>

        <div class="about-hero-icon">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fill-rule="evenodd"></path>
          </svg>
        </div>

        <h1 class="heading-hero">About TaskCraft</h1>
        <p class="subtitle">Organize your tasks and calendar using natural language.</p>
      </div>

      <div class="card">
        <div class="card-content">
          <h2 class="section-heading">Our Mission</h2>
          <p class="text-lg text-secondary line-height-relaxed mb-lg">
            TaskCraft makes it easy to capture and organize your thoughts without complexity. By converting natural language into structured tasks and calendar events, we help you keep track of what matters.
          </p>
          <p class="text-lg text-secondary line-height-relaxed">
            The platform uses natural language processing to turn your scattered ideas into organized tasks, scheduled events, and timely reminders.
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <h2 class="section-heading">Core Values</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">speed</span>
              </div>
              <h3>Keep It Simple</h3>
              <p>Task management works best when it doesn't get in your way. We focus on clarity and ease of use.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <h3>Privacy First</h3>
              <p>Your data belongs to you. We use industry-standard encryption and never share your information.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <span class="material-symbols-outlined">psychology</span>
              </div>
              <h3>Continuous Improvement</h3>
              <p>We use your feedback to make the platform more accurate and helpful over time.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card card-centered">
        <h2 class="section-heading">The Team</h2>
        <p class="text-secondary mb-lg">
          TaskCraft is developed by a distributed team of engineers and designers.
        </p>
        <div class="text-secondary text-sm">
          More information coming soon
        </div>
      </div>

      <div class="card card-centered">
        <h2 class="section-heading">Contact</h2>
        <p class="text-secondary mb-xl">
          Have questions or feedback? We'd like to hear from you.
        </p>
        <div class="button-group">
          <button class="btn btn-md btn-primary">
            <span class="material-symbols-outlined icon-lg">email</span>
            <span>Email Us</span>
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
