import { createSignal, Show } from 'solid-js';
import { useNavigate, A } from '@solidjs/router';
import { auth } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isDemoLoading, setIsDemoLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await auth.login(email(), password());
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      await auth.loginAsMock();
      navigate('/');
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="blob-decorator"></div>

          <h1 class="heading-xl">Welcome Back</h1>
          <p class="subtitle">Log in to continue organizing your life</p>

          <form onSubmit={handleSubmit} class="form-vertical">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                autocomplete="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                autocomplete="current-password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-lg btn-primary btn-full-width"
                disabled={isLoading()}
              >
                {isLoading() ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>

          <Show when={auth.isMockEnvironment()}>
            <div class="mock-auth-section">
              <div class="divider-horizontal">
                <span>OR</span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                class="btn btn-lg btn-secondary btn-full-width"
                disabled={isDemoLoading()}
              >
                <span class="material-symbols-outlined icon-md">science</span>
                <span>{isDemoLoading() ? 'Logging in...' : 'Continue as Demo User'}</span>
              </button>

              <p class="text-sm text-muted" style="text-align: center; margin-top: 0.5rem;">
                For development and testing only
              </p>
            </div>
          </Show>

          <div class="auth-footer">
            <p>Don't have an account? <A href="/register">Sign up</A></p>
          </div>
        </div>
      </div>
    </div>
  );
}
