import { effect, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type Language = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  /**
   * Servie to manage the language of the app.
   */
  private translocoService = inject(TranslocoService);

  /**
   * Current language of the app
   */
  public currentLang = signal<Language>(
    (localStorage.getItem('lang') as Language) ?? 'fr'
  );

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      const lang = this.currentLang();
      this.translocoService.setActiveLang(lang);
      localStorage.setItem('lang', lang);
    });
  }

  /**
   * Change language
   */
  toggle() {
    this.currentLang.update(lang => (lang === 'fr' ? 'en' : 'fr'));
  }
}
