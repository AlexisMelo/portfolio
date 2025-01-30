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
    // return "Je suis Alexis Melo da Silva, développeur fullstack basé à Caen, en France. Je met mes compétences en développement web au service de la transformation digitale des entreprises et au déploiement de l'i4.0.";
    return `Fort de 3 ans d’expérience en 
développement logiciel et web au sein
d’une grande entreprise, je souhaite 
désormais exercer ma passion sous le 
statut de freelance. 
Aimant aussi bien participer à
l’élaboration d’interfaces que réfléchir sur les problématiques liées à la gestion de la donnée, j’aspire chaque jour à devenir un développeur un peu plus complet.`;
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
