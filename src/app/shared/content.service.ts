import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
   * Activité actuelle
   */
  public now?: SafeHtml[];

  /**
   * Constructeur
   */
  constructor() {
    this.updateNow();
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
   * Activité actuelle
   */
  private async updateNow() {
    const nows =
      'Réaliser les démarches pour devenir développeur fullstack en freelance/Renforcer mes connaissances sur Angular, Typescript et Supabase/Construire ce portfolio'.split(
        '/'
      );
    this.now = nows.map(n => this.sanitizer.bypassSecurityTrustHtml(n));
  }
}
