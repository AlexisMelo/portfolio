import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { Status, StatusValue } from './status.model';

/**
 * Selectable status for select lists
 */
export interface SelectableStatus extends SelectableItem {
  /**
   * Id for the status
   */
  id: Status;

  /**
   * Label for the status
   */
  label: StatusValue;
}
