import { Tables } from 'database.types';

/**
 * Contexte de travail (salariat, école, ...)
 */
export interface ContextWithProjects extends Tables<'context'> {
  /**
   * Projets réalisés dans le contexte
   */
  projects: Array<Tables<'project'>>;

  /** Localized description resolved from the translations table. */
  localizedDescription: Tables<'translations'>;

  /** Localized label resolved from the translations table. */
  localizedLabel: Tables<'translations'>;

  /** Localized job title resolved from the translations table. */
  localizedJob: Tables<'translations'>;
}
