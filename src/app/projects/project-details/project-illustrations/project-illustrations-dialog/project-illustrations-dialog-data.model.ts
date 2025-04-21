import { Tables } from 'database.types';

/**
 * Données nécessaires pour le modal d'illustrations de projet
 */
export interface ProjectIllustrationsDialogData {
  /**
   * Liste des illustrations du projet
   */
  illustrations: Array<Tables<'project_illustration'>>;

  /**
   * Index de la slide affichée dans le modal
   */
  slideShownOnOpen: number;
}
