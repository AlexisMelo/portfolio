import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupabaseService } from './supabase.service';
import { Tables } from 'database.types';

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
  public now?: SafeHtml;

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
    this.now = this.sanitizer.bypassSecurityTrustHtml(
      'Réaliser les démarches pour devenir développeur fullstack en <span>freelance</span><br><br>Renforcer mes connaissances sur Angular, Typescript et Supabase<br><br>Construire ce portfolio'
    );
  }
}
