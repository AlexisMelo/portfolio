import { Injectable } from '@angular/core';

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
   * Description de mon activité
   */
  get description() {
    return 'Enchanté ! Je suis Alexis Melo da Silva, développeur d’applications qui améliorent la compétitivité des entreprises et le quotidien des employés.';
  }

  /**
   * Adresse mail
   */
  get mail() {
    return 'Alexis.Melo@outlook.fr';
  }

  /**
   * Téléphone
   */
  get phone() {
    return '06 12 15 78 26';
  }
}
