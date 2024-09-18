import { SkillType } from './skill-type.model';

/**
 * Compétence connue
 */
export interface Skill {
  /**
   * Identifiant unique
   */
  id: number;

  /**
   * Nom de la compétence
   */
  label: string;

  /**
   *
   */
  type: number;

  /**
   * Type
   */
  skill_type: SkillType;

  /**
   * URL pour illustration du skill
   */
  icon: string;
}
