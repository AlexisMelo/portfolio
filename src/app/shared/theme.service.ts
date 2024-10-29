import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Theme } from './theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  /**
   * Est-ce que le site est en dark mode ?
   */
  public theme = new BehaviorSubject<Theme>('light-mode');

  /**
   * Souscription aux changements de theme
   */
  private themeSubscription?: Subscription;

  /**
   * Constructeur
   */
  constructor() {
    this.themeSubscription = this.theme.subscribe({
      next: theme => {
        if (theme === 'light-mode') {
          document.body.classList.remove('dark-mode');
          document.body.classList.add('light-mode');
        } else {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        }
      },
    });

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme !== null) {
      this.theme.next(storedTheme as Theme);
    }
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Inverse le thème actuel entre "Light" et "Dark"
   */
  toggle() {
    this.theme.next(
      this.theme.value === 'light-mode' ? 'dark-mode' : 'light-mode'
    );
    localStorage.setItem('theme', this.theme.value.toString());
  }

  /**
   * Raccourci pour savoir si on est en dark mode
   */
  get isDarkMode(): boolean {
    return this.theme.value === 'dark-mode';
  }
}
