/**
 * Propriétés nécessaires pour pouvoir filter sur un objet en particulier
 */
export interface SelectableItem {
  /**
   * Identifiant unique de l'objet selectionnable
   */
  id: number | string;

  /**
   * Label à afficher pour l'utilisateur
   */
  label: string;
}
