import { Tables } from 'database.types';

interface ProjectSkillWithSkillDetails extends Tables<'project_skill'> {
  skill: Tables<'skill'>;
}

/**
 * Données nécessaires à l'affiche d'un projet
 */
export interface ProjectItem extends Tables<'project'> {
  /**
   * Illustrations
   */
  illustrations: Array<Tables<'project_illustration'>>;

  /**
   * Skills utilisés dans le projet
   */
  project_skills: Array<ProjectSkillWithSkillDetails>;
}
