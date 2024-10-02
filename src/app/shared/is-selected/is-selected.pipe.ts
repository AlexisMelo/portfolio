import { Pipe, PipeTransform } from '@angular/core';
import { SelectableItem } from './selectable-item.model';

@Pipe({
  name: 'isSelected',
  standalone: true,
})
export class IsSelectedPipe implements PipeTransform {
  transform(
    selectedItems: Array<SelectableItem>,
    item: SelectableItem
  ): boolean {
    return selectedItems.find(i => i.id === item.id) !== undefined;
  }
}
