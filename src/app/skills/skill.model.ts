import { Tables } from 'database.types';
import { Project } from '../projects/project.model';

/** skill_type row with its label resolved from the translations table. */
export interface SkillType extends Tables<'skill_type'> {
  /** Localized label from the translations table. */
  localizedLabel: Tables<'translations'>;
}

/**
 * Compétence connue
 */
export interface Skill extends Tables<'skill'> {
  /**
   * Type
   */
  skill_type: SkillType;

  /**
   * Champs d'application
   */
  skill_field: Tables<'skill_field'>;

  /**
   * Projets utilisant cette technologie
   */
  projects: Array<Project>;

  /** Localized description resolved from the translations table. */
  localizedDescription: Tables<'translations'>;
}
