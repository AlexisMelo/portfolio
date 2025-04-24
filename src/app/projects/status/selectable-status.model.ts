import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { StatusValue } from './status.model';

/**
 * Permet de rendre les statut "selectionnable" autrement que par leur nom
 */
export interface SelectableStatus extends SelectableItem {
  /**
   * Identifiant associé au statut
   */
  id: number;

  /**
   * Label du statut, en toutes lettres. Par exemple 'Terminé'
   */
  label: StatusValue;
}
