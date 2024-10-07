/**
 * Section de détails d'un projet
 */
export interface Section {
  /**
   * Identifiant du projet
   */
  project: number;

  /**
   * Position dans la page
   */
  position: number;

  /**
   * Identifiant unique
   */
  id: number;

  /**
   * Label de la section
   */
  label: string;

  /**
   * Lien vers l'illustration
   */
  illustration: string;

  /**
   * Texte de la section
   */
  description: string;
}
