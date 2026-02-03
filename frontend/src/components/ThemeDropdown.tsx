import { createSignal, For, onCleanup } from 'solid-js';
import { theme } from '../lib/theme';

export default function ThemeDropdown() {
  const [isOpen, setIsOpen] = createSignal(false);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.theme-dropdown-wrapper')) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = (e: Event) => {
    e.stopPropagation();
    const nextState = !isOpen();
    setIsOpen(nextState);

    if (nextState) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    theme.setTheme(themeId);
    setIsOpen(false);
    document.removeEventListener('click', handleClickOutside);
  };

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="theme-dropdown-wrapper">
      <button
        class="btn btn-icon btn-secondary"
        onClick={toggleDropdown}
        title="Change theme"
      >
        <span class="material-symbols-outlined icon-lg">palette</span>
      </button>

      <div class={`theme-dropdown ${isOpen() ? 'theme-dropdown-open' : ''}`}>
        <For each={theme.getAvailableThemes()}>
          {(themeItem) => (
            <div
              class={`theme-dropdown-item ${themeItem.isCurrent ? 'theme-dropdown-item-active' : ''}`}
              onClick={() => handleThemeSelect(themeItem.id)}
            >
              <div class="theme-swatch"></div>
              <div class="theme-name">{themeItem.name}</div>
              <span class="material-symbols-outlined theme-checkmark">
                check
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
