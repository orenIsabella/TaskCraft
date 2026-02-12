import { createSignal, Show } from 'solid-js';
import { useNavigate, A } from '@solidjs/router';
import { auth } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [verificationCode, setVerificationCode] = createSignal('');
  const [step, setStep] = createSignal<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isDemoLoading, setIsDemoLoading] = createSignal(false);

  const handleEmailSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await auth.requestVerificationCode(email());
      setStep('code');
    } catch (error) {
      console.error('Verification code request failed:', error);
      alert('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await auth.verifyCodeAndLogin(email(), verificationCode());
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid verification code. Please try again.');
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
          <p class="subtitle">
            {step() === 'email'
              ? 'Enter your email to receive a verification code'
              : 'Enter the verification code sent to your email'}
          </p>

          <Show when={step() === 'email'}>
            <form onSubmit={handleEmailSubmit} class="form-vertical">
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

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-lg btn-primary btn-full-width"
                  disabled={isLoading()}
                >
                  {isLoading() ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          </Show>

          <Show when={step() === 'code'}>
            <form onSubmit={handleCodeSubmit} class="form-vertical">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email-display"
                  name="email"
                  disabled
                  value={email()}
                  style={{ background: 'var(--color-background-subtle)' }}
                />
              </div>

              <div class="form-group">
                <label for="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  placeholder="Enter 6-digit code"
                  autocomplete="one-time-code"
                  pattern="[0-9]*"
                  maxlength="6"
                  value={verificationCode()}
                  onInput={(e) => setVerificationCode(e.currentTarget.value)}
                />
              </div>

              <div class="form-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  class="btn btn-lg btn-secondary"
                  onClick={() => {
                    setStep('email');
                    setVerificationCode('');
                  }}
                  disabled={isLoading()}
                >
                  Back
                </button>
                <button
                  type="submit"
                  class="btn btn-lg btn-primary"
                  style={{ flex: 1 }}
                  disabled={isLoading()}
                >
                  {isLoading() ? 'Verifying...' : 'Verify & Log In'}
                </button>
              </div>
            </form>
          </Show>

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
