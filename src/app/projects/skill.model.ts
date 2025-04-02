import { Tables } from 'database.types';
import { Project } from './project.model';
import { SkillField } from './skill-field.model';

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
  skill_field: SkillField;

  /**
   * Projets utilisant cette technologie
   */
  projects: Array<Project>;
}
