/**
 * Rôle que peut avoir une personne dans un projet
 */
export interface Role {
  /**
   * Identifiant unique du rôle
   */
  id: number;

  /**
   * Description du rôle
   */
  label: string;
}
