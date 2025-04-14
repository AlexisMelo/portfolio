import { Tables } from 'database.types';

/**
 * Contexte de travail (salariat, école, ...)
 */
export interface ContextWithProjects extends Tables<'context'> {
  /**
   * Type de contexte
   */
  context_type: Tables<'context_type'>;

  /**
   * Projets réalisés dans le contexte
   */
  projects: Array<Tables<'project'>>;
}
