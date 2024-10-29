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
    return 'Bonjour ! Je suis Alexis Melo da Silva, développeur fullstack basé à Caen, en France. Je crée des applications web ou bureau, principalement pour la transformation digitale des industries.';
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
