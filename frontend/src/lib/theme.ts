import { createSignal, createEffect } from 'solid-js';

const THEME_STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = 'default';

interface Theme {
  id: string;
  name: string;
}

const THEMES: Record<string, string> = {
  default: 'Golden Hour',
  ocean: 'Ocean Blue',
  forest: 'Forest Green',
  midnight: 'Midnight Purple',
  sunset: 'Sunset Orange',
  rose: 'Rose Pink',
  daylight: 'Daylight',
  cloud: 'Cloud',
  meadow: 'Meadow',
};

function loadTheme(): string {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES[saved]) {
      return saved;
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
  return DEFAULT_THEME;
}

function saveTheme(themeId: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

function applyTheme(themeId: string): void {
  if (themeId === DEFAULT_THEME) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }
}

const [currentTheme, setCurrentTheme] = createSignal(loadTheme());

createEffect(() => {
  const themeId = currentTheme();
  applyTheme(themeId);
  saveTheme(themeId);
});

export const theme = {
  get current() {
    return currentTheme();
  },

  setTheme(themeId: string) {
    if (!THEMES[themeId]) {
      console.warn(`Theme "${themeId}" not found, falling back to default`);
      themeId = DEFAULT_THEME;
    }
    setCurrentTheme(themeId);
  },

  getAvailableThemes(): Array<Theme & { isCurrent: boolean }> {
    const current = currentTheme();
    return Object.entries(THEMES).map(([id, name]) => ({
      id,
      name,
      isCurrent: id === current,
    }));
  },

  getCurrentTheme(): Theme {
    const id = currentTheme();
    return {
      id,
      name: THEMES[id],
    };
  },

  nextTheme() {
    const themeIds = Object.keys(THEMES);
    const currentIndex = themeIds.indexOf(currentTheme());
    const nextIndex = (currentIndex + 1) % themeIds.length;
    setCurrentTheme(themeIds[nextIndex]);
  },
};
