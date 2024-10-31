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
    return "Je suis Alexis Melo da Silva, développeur fullstack basé à Caen, en France. Je met mes compétences en développement web au service de la transformation digitale des entreprises et au déploiement de l'i4.0.";
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
