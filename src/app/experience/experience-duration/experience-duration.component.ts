import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { DurationPipe } from 'src/app/projects/duration.pipe';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-experience-duration',
  imports: [DatePipe, DurationPipe],
  templateUrl: './experience-duration.component.html',
  styleUrl: './experience-duration.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceDurationComponent {
  /**
   * Context to display
   */
  public context = input.required<ContextWithProjects>();

  /**
   * When is the context taking place
   */
  public timing = computed<'past' | 'now' | 'future'>(() => {
    const today = new Date();
    const startDate = new Date(this.context().start_date);
    if (startDate > today) return 'future';

    const endDateNullable = this.context().end_date;
    if (endDateNullable === null) return 'now';

    const endDate = new Date(endDateNullable);
    return endDate > today ? 'now' : 'past';
  });
}
