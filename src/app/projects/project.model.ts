import { Tables } from 'database.types';
import { ContextWithProjects } from './context-with-projects.model';
import { Skill } from '../skills/skill.model';

interface ProjectCoworker extends Tables<'project_coworker'> {
  coworker: Tables<'coworker'>;
}

interface ProjectSkill extends Tables<'project_skill'> {
  skill: Skill;
}

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
  project_context: ContextWithProjects;

  /**
   * Skills used in the project
   */
  project_skills: Array<ProjectSkill>;

  /**
   * Collègues sur le projet
   */
  coworkers: Array<ProjectCoworker>;

  /**
   * Mes rôles dans le projet
   */
  roles: Array<Tables<'role'>>;

  /**
   * Illustration pour un projet
   */
  illustrations: Array<Tables<'project_illustration'>>;

  /** Localized description resolved from the translations table. */
  localizedDescription: Tables<'translations'>;

  /** Localized problematic resolved from the translations table. */
  localizedProblem: Tables<'translations'>;

  /** Localized participation resolved from the translations table. */
  localizedParticipation: Tables<'translations'>;
}
