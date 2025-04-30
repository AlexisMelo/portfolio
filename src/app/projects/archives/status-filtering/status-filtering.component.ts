import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-status-filtering',
  standalone: true,
  imports: [],
  templateUrl: './status-filtering.component.html',
  styleUrl: './status-filtering.component.scss',
})
export class StatusFilteringComponent extends GridItemDirective {}
