import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { SupabaseService } from './supabase.service';

/**
 * Service pour gérer le contenu configurable de l'appli
 *
 * Todo: Utiliser un headless CMS à terme ???
 */
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  /**
   * Sanitizer
   */
  private sanitizer = inject(DomSanitizer);

  /**
   * Accès à supabase
   */
  private supabase = inject(SupabaseService);

  /**
   * Transloco
   */
  private translocoService = inject(TranslocoService);

  /**
   * Activité actuelle
   */
  public now = signal<SafeHtml[]>([]);

  /**
   * Active language as a reactive signal, updated on every language change.
   */
  public activeLang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  /**
   * Constructeur
   */
  constructor() {
    effect(() => {
      this.activeLang(); // track language changes
      this.updateNow();
    });
  }

  /**
   * Adresse mail
   */
  get mail() {
    return 'alexis.melo@outlook.fr';
  }

  /**
   * Téléphone
   */
  get phone() {
    return '+33 (0)6 12 15 78 26';
  }

  /**
   * Linkedin
   */
  get linkedIn() {
    return 'https://www.linkedin.com/in/alexis-melo-da-silva/';
  }

  /**
   * Github
   */
  get github() {
    return 'https://github.com/AlexisMelo';
  }

  /**
   * Langue de l'appli
   */
  get locale() {
    return 'fr-FR';
  }

  /**
   * Fetches "now" items from Supabase and updates the signal.
   */
  private async updateNow() {
    const items = await this.supabase.getNowItems();
    this.now.set(
      items.map(item => this.sanitizer.bypassSecurityTrustHtml(item))
    );
  }
}
