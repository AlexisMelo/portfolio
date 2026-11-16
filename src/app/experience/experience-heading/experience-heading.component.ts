import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { CountTitleComponent } from 'src/app/shared/count-title/count-title.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Title tile of the experience page, in teal (the brand): how many steps (jobs, internships,
 * schools) the path holds and the year the first one started. When the filters hide some steps, the
 * number and the year count to those of the shown steps, and a badge gives the total. Empty until
 * the steps arrive.
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
   * Every step of the path
   */
  public readonly contexts = input.required<Array<ContextWithProjects>>();

  /**
   * Steps the filters show
   */
  public readonly shownContexts = input.required<Array<ContextWithProjects>>();

  /**
   * Number of every step
   */
  protected readonly total = computed(() => this.contexts().length);

  /**
   * Number of the shown steps
   */
  protected readonly count = computed(() => this.shownContexts().length);

  /**
   * Year the first shown step started, the first year of all when none is shown
   */
  protected readonly shownYear = computed(
    () =>
      firstStartYear(this.shownContexts()) ?? firstStartYear(this.contexts())
  );
}

/**
 * Year the earliest of some steps started, null when there is none
 * @param contexts steps to look at
 */
function firstStartYear(contexts: Array<ContextWithProjects>): number | null {
  const dates = contexts.map(context => context.start_date);
  if (dates.length === 0) return null;

  const first = dates.reduce((earliest, date) =>
    date < earliest ? date : earliest
  );
  return Number(first.slice(0, 4));
}
