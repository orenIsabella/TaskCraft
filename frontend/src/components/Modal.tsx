import { createSignal, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { JSX } from 'solid-js';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
}

export default function Modal(props: ModalProps) {
  const size = () => props.size || 'medium';
  const closeOnEscape = () => props.closeOnEscape ?? true;
  const closeOnOverlay = () => props.closeOnOverlay ?? true;

  const [showContent, setShowContent] = createSignal(false);

  const handleEscape = (e: KeyboardEvent) => {
    if (closeOnEscape() && e.key === 'Escape') {
      handleClose();
    }
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (closeOnOverlay() && e.target === e.currentTarget) {
      handleClose();
    }
  };

  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setShowContent(true), 10);

      if (closeOnEscape()) {
        document.addEventListener('keydown', handleEscape);
      }
    } else {
      document.body.style.overflow = '';
      setShowContent(false);
      document.removeEventListener('keydown', handleEscape);
    }
  });

  onCleanup(() => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
  });

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      props.onClose();
    }, 200);
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          class={`modal-overlay ${showContent() ? 'modal-open' : ''}`}
          onClick={handleOverlayClick}
        >
          <div class={`modal-container modal-${size()}`}>
            <div class="modal-header">
              <h2 class="modal-title">{props.title}</h2>
              <button
                class="modal-close"
                onClick={handleClose}
                title="Close (ESC)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              {props.children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
