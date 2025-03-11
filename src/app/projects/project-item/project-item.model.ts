import { Tables } from 'database.types';

/**
 * Données nécessaires à l'affiche d'un projet
 */
export interface ProjectItem extends Tables<'project'> {
  /**
   * Illustrations
   */
  illustrations: Array<Tables<'project_illustration'>>;
}
