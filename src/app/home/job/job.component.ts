import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

/**
 * Tile at the top of the home page that explains my job, with the Angular and .NET frameworks
 * shown as coloured chips that float up and down
 */
@Component({
  selector: 'app-job',
  imports: [TranslocoPipe],
  templateUrl: './job.component.html',
  styleUrl: './job.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class JobComponent extends GridItemDirective {}
