import { Tables } from 'database.types';
import { Skill } from './skill.model';

/**
 * Représente un projet
 */
export interface Project extends Tables<'project'> {
  /**
   * Type de projet
   */
  project_type: Tables<'project_type'>;

  /**
   * Contexte du projet
   */
  project_context: Tables<'context'>;

  /**
   * Skills utilisés dans le projet
   */
  skills: Array<Skill>;

  /**
   * Sections de texte
   */
  sections: Array<Tables<'section'>>;

  /**
   * Collègues sur le projet
   */
  coworkers: Array<Tables<'coworker'>>;

  /**
   * Mes rôles dans le projet
   */
  roles: Array<Tables<'role'>>;

  /**
   * Illustration pour un projet
   */
  illustrations: Array<Tables<'project_illustration'>>;
}
