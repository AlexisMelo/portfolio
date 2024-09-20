import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterItem } from './filter-item.model';

@Component({
  selector: 'app-filter-item',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './filter-item.component.html',
  styleUrl: './filter-item.component.scss',
})
export class FilterItemComponent {
  /**
   * Context to display
   */
  @Input({ required: true }) item!: FilterItem;

  /**
   * Est-ce que la chips doit avoir l'état "Active" ?
   */
  @HostBinding('class.active') @Input({ required: false }) active: boolean =
    false;
}
