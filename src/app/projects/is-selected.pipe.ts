import { Pipe, PipeTransform } from '@angular/core';

interface idItem {
  id: number | string;
}

@Pipe({
  name: 'isSelected',
  standalone: true,
})
export class IsSelectedPipe implements PipeTransform {
  transform(selectedItems: Array<idItem>, item: idItem): boolean {
    return selectedItems.find(i => i.id === item.id) !== undefined;
  }
}
