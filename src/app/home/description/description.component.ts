import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
  host: { class: 'g-grid-item-shadow' },
})
export class DescriptionComponent extends GridItemDirective {}
