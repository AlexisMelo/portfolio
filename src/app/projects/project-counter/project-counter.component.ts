import { Component, inject } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';
import { ResetButtonComponent } from '../reset-button/reset-button.component';

@Component({
  selector: 'app-project-counter',
  imports: [ResetButtonComponent],
  templateUrl: './project-counter.component.html',
  styleUrl: './project-counter.component.scss',
})
export class ProjectCounterComponent extends GridItemDirective {
  /**
   * Projects, filters and their results
   */
  public projectsService = inject(ProjectsService);
}
