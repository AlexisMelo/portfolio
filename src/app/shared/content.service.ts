import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Service pour gérer le contenu configurable de l'appli
 *
 * Todo: Utiliser un headless CMS à terme ???
 */
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private sanitizer = inject(DomSanitizer);

  /**
   * Description de mon activité
   */
  get description(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `Je suis <span class="g-name">Alexis</span>, développeur fullstack basé à Caen.
    J'apprécie concevoir et développer des applications performantes, intuitives
    et qui ont un réel impact sur le terrain.`
    );
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
}
