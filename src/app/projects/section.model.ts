/**
 * Section de détails d'un projet
 */
export interface Section {
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

  /**
   * Tags
   */
  tags: string | null;

  /**
   * Position de la section (utile si non-reliée à un projet par exemple)
   */
  position: number | null;
}
