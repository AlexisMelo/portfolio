import { Tables } from 'database.types';

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
   * Projects using this skill, only their ids since they are only counted
   */
  projects: Array<Pick<Tables<'project'>, 'id'>>;

  /** Localized description resolved from the translations table. */
  localizedDescription: Tables<'translations'>;
}
