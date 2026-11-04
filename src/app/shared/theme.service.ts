import { Injectable, signal } from '@angular/core';
import { Theme } from './theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /**
   * Current theme
   */
  private readonly currentTheme = signal<Theme>('light-mode');

  /**
   * Current theme, read-only
   */
  public readonly theme = this.currentTheme.asReadonly();

  /**
   * Constructeur
   */
  constructor() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme !== null) {
      this.setTheme(storedTheme as Theme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark-mode');
    } else {
      this.setTheme('light-mode');
    }
  }

  /**
   * Inverse le thème actuel entre "Light" et "Dark"
   */
  toggle() {
    this.setTheme(this.isDarkMode ? 'light-mode' : 'dark-mode');
    localStorage.setItem('theme', this.theme());
  }

  /**
   * Raccourci pour savoir si on est en dark mode
   */
  get isDarkMode(): boolean {
    return this.theme() === 'dark-mode';
  }

  /**
   * Changes the theme and applies it to the page
   * @param theme theme to apply
   */
  private setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    document.body.classList.toggle('dark-mode', theme === 'dark-mode');
    document.body.classList.toggle('light-mode', theme === 'light-mode');
  }
}
