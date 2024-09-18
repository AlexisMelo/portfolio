import { Component, Input } from '@angular/core';
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
}
