import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { CountTitleComponent } from 'src/app/shared/count-title/count-title.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Title tile of the experience page, in teal (the brand): how many steps (jobs, internships,
 * schools) the path holds and the year the first one started. Empty until the steps arrive.
 */
@Component({
  selector: 'app-experience-heading',
  imports: [CountTitleComponent, TranslocoPipe],
  templateUrl: './experience-heading.component.html',
  styleUrl: './experience-heading.component.scss',
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class ExperienceHeadingComponent {
  /**
   * Steps of the path
   */
  public readonly contexts = input.required<Array<ContextWithProjects>>();

  /**
   * Number of steps
   */
  protected readonly count = computed(() => this.contexts().length);

  /**
   * Year the first step started, null when there is none
   */
  protected readonly firstYear = computed(() => {
    const dates = this.contexts().map(context => context.start_date);
    if (dates.length === 0) return null;

    const first = dates.reduce((earliest, date) =>
      date < earliest ? date : earliest
    );
    return Number(first.slice(0, 4));
  });
}
