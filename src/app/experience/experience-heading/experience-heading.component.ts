import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { CountTitleComponent } from 'src/app/shared/count-title/count-title.component';
import { firstStartYear } from 'src/app/shared/first-start-year';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Title tile of the experience page
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
