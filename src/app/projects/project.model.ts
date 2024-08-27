import { Context } from '../landing-page/timeline/context.model';
import { ProjectType } from './project-type.model';
import { Skill } from './skill.model';

/**
 * Représente un projet
 */
export interface Project {
  /**
   * Identifiant unique
   */
  id: number;

  /**
   * Titre du projet
   */
  label: string;

  /**
   * Date de début du projet
   */
  start_date: number;

  /**
   * Date de fin du projet
   */
  end_date: number;

  /**
   * Type de projet
   */
  type: ProjectType;

  /**
   * Contexte du projet
   */
  context: Context;

  /**
   * Description du projet
   */
  description: string;

  /**
   * Type du projet
   */
  project_type: ProjectType;

  /**
   * Liste des compétences utilisées dans le projet
   */
  skill: Array<Skill>;
}
