/**
 * Type de projet
 */
export interface ProjectType {
  /**
   * Identifiant unique
   */
  id: number;

  /**
   * Titre du projet
   */
  label: 'Site web' | 'Application bureau';
}
