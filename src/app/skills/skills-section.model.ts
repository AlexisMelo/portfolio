import { Skill } from '../projects/skill.model';
import { TitleSeparator } from '../shared/title-separator/title-separator.model';

export interface SkillsSection extends TitleSeparator {
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
   * Couleur d'écriture du skill
   */
  recapColor: string;

  /**
   * Couleur du background de la section
   */
  sectionBackgroundColor: string;

  /**
   * Couleur du texte de la section
   */
  sectionColor: string;
}
