import { Tables } from 'database.types';

export interface SkillWithType extends Tables<'skill'> {
  skill_type: Tables<'skill_type'>;
}
