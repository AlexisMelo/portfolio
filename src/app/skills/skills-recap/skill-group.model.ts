import { Tables } from 'database.types';
import { Skill } from 'src/app/projects/skill.model';

/**
 * Ensemble de skills regroupés selon leur type
 */
export interface SkillGroup {
  /**
   * Type de skill
   */
  skill: Tables<'skill_type'>;
  /**
   * Skills rattachés à ce type
   */
  skills: Skill[];
}
