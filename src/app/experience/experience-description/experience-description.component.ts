import { Component, input } from '@angular/core';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-experience-description',
  standalone: true,
  imports: [],
  templateUrl: './experience-description.component.html',
  styleUrl: './experience-description.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceDescriptionComponent {
  /**
   * Context to display
   */
  public context = input.required<ContextWithProjects>();
}
