import { Project } from './project.model';
import { SkillField } from './skill-field.model';
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
   * Champs d'application
   */
  skill_field: SkillField;

  /**
   * URL pour illustration du skill
   */
  icon: string;

  /**
   * Est-ce que c'est un skill "important", par exemple Typescript > Javascript
   */
  main: boolean;

  /**
   * Couleur hexadecimale
   */
  color: string;

  /**
   * Est-ce qu'on doit l'afficher sur la page d'accueil
   */
  landing_page: boolean;

  /**
   * Courte description
   */
  description: string;

  /**
   * Est-ce que cette technologie fait partie de mes préférées ?
   */
  loved: boolean;

  /**
   * Est-ce que je suis entrain d'apprendre cette technologie ?
   */
  currently_learning: boolean;

  /**
   * Projets utilisant cette technologie
   */
  projects: Array<Project>;
}
