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
  start_date: string;

  /**
   * Date de fin du projet
   */
  end_date: string;

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

  /**
   * Lien vers l'image d'illustration
   */
  thumbnail: string;

  /**
   * URL vers les détails du projet
   */
  url: string;
}
