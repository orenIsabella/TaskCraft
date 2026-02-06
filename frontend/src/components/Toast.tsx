import { createSignal, createContext, useContext, For } from 'solid-js';
import type { JSX } from 'solid-js';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>();

export function ToastProvider(props: { children: JSX.Element }) {
  const [toasts, setToasts] = createSignal<Toast[]>([]);
  let nextId = 0;

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {props.children}
      <div class="toast-container">
        <For each={toasts()}>
          {(toast) => (
            <div class={`toast toast-${toast.type}`}>
              <span class="material-symbols-outlined toast-icon">
                {toast.type === 'success' ? 'check_circle' :
                 toast.type === 'error' ? 'error' : 'info'}
              </span>
              <span class="toast-message">{toast.message}</span>
              <button
                class="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          )}
        </For>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
