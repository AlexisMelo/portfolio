import { Context } from '../landing-page/timeline/context.model';
import { Coworker } from './coworker.model';
import { ProjectType } from './project-type.model';
import { Role } from './role.model';
import { Section } from './section.model';
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
  end_date?: string;

  /**
   * Contexte du projet
   */
  context: Context;

  /**
   * Description du projet
   */
  description?: string;

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
  thumbnail?: string;

  /**
   * Lien vers l'icone
   */
  icon?: string;

  /**
   * URL vers les détails du projet
   */
  url: string;

  /**
   * Est-ce que le projet doit être mis en avant sur le portfolio
   */
  pinned: boolean;

  /**
   * Equipe
   */
  coworker: Array<Coworker>;

  /**
   * Rôles joués dans la réalisation du projet
   */
  role: Array<Role>;

  /**
   * Sections avec les détails
   */
  section: Array<Section>;

  /**
   * Le projet est-il à l'abandon
   */
  abandoned: boolean;

  /**
   * Lien vers le code source
   */
  source: string;

  /**
   * Lien vers le projet déployé
   */
  deployment: string;
}
