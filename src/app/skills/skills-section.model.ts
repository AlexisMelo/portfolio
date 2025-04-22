import { Skill } from './skill.model';

export interface SkillsSection {
  /**
   * Titre de la section
   */
  heading: string;

  /**
   * Description du contenu de la section
   */
  description: string;

  /**
   * Sous-titre de la section
   */
  subtitle: string;

  /**
   * Identifiant unique de la section
   */
  id: string;

  /**
   * Liste des skills de la section
   */
  skills: Array<Skill>;

  /**
   * Identifiant du "Skill field" en base
   */
  skillFieldId: number;

  /**
   * Style à appliquer sur la section
   */
  class: string;

  /**
   * Couleur de la section
   */
  recapBackgroundColor: string;

  /**
   * Couleur du background de la section
   */
  sectionBackgroundColor: string;

  /**
   * Couleur du texte de la section
   */
  sectionColor: string;
}
