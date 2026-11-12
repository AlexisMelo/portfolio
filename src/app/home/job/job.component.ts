import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SKILLS_ROUTE } from '../../route-paths';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

/**
 * Tile at the top of the home page with my job title, centred, and under it my speciality: the
 * Angular and .NET chips and a "& much more" one, floating up and down, each a link to the skills page
 */
@Component({
  selector: 'app-job',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './job.component.html',
  styleUrl: './job.component.scss',
})
export class JobComponent extends GridItemDirective {
  /**
   * Page the chips lead to
   */
  protected readonly SKILLS_ROUTE = SKILLS_ROUTE;
}
