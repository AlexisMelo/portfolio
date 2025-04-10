import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-project-item-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './project-item-placeholder.component.html',
  styleUrl: './project-item-placeholder.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectItemPlaceholderComponent extends GridItemDirective {}
