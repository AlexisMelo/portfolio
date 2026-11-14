import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

/**
 * Fetches the Transloco translation files from the public i18n folder
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  /**
   * Client used to fetch the translation files
   */
  private http = inject(HttpClient);

  /**
   * Loads the translations of a language, relative to the base href so that it also works under a sub-path (GitHub Pages)
   */
  getTranslation(lang: string) {
    return this.http.get<Translation>(`i18n/${lang}.json`);
  }
}
