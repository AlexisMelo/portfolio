import { Tables } from 'database.types';

/**
 * Contexte de travail (salariat, école, ...)
 */
export interface ContextWithProjects extends Tables<'context'> {
  /**
   * Projets réalisés dans le contexte
   */
  projects: Array<Tables<'project'>>;
}
