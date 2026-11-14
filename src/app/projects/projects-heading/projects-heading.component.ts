import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Title tile of the projects page, in mustard (the accent) with a big title
 */
@Component({
  selector: 'app-projects-heading',
  imports: [TranslocoPipe],
  template: `<h2>{{ 'projects.heading' | transloco }}</h2>`,
  styleUrl: './projects-heading.component.scss',
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class ProjectsHeadingComponent {}
