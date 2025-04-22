import { Tables } from 'database.types';
import { Project } from '../projects/project.model';

/**
 * Compétence connue
 */
export interface Skill extends Tables<'skill'> {
  /**
   * Type
   */
  skill_type: Tables<'skill_type'>;

  /**
   * Champs d'application
   */
  skill_field: Tables<'skill_field'>;

  /**
   * Projets utilisant cette technologie
   */
  projects: Array<Project>;
}
