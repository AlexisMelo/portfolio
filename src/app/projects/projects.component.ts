import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { SocialLinkComponent } from 'src/app/home/social-link/social-link.component';
import { GridDragDirective } from 'src/app/shared/grid/grid-drag.directive';
import { GridEntranceDirective } from 'src/app/shared/grid/grid-entrance.directive';
import { CategoryFilteringComponent } from './category-filtering/category-filtering.component';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectFilteringComponent } from './project-filtering/project-filtering.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectsHeadingComponent } from './projects-heading/projects-heading.component';
import { ProjectsIntroComponent } from './projects-intro/projects-intro.component';
import { ProjectsService } from './projects.service';
import { StatusFilteringComponent } from './status-filtering/status-filtering.component';

/**
 * Projects page: every project in a list, the most recent first, with the filters around it
 */
@Component({
  selector: 'app-projects',
  imports: [
    ProjectsHeadingComponent,
    ProjectsIntroComponent,
    ProjectFilteringComponent,
    ProjectCounterComponent,
    StatusFilteringComponent,
    CategoryFilteringComponent,
    SocialLinkComponent,
    ProjectListComponent,
    GridEntranceDirective,
    GridDragDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  providers: [ProjectsService],
})
export class ProjectsComponent {
  /**
   * Projects, filters and their results
   */
  private readonly projectsService = inject(ProjectsService);

  /**
   * Drag and drop of the tiles
   */
  private readonly gridDrag = viewChild.required(GridDragDirective);

  /**
   * Number of projects in the list, which sets its height
   */
  private readonly listSize = computed(
    () => this.projectsService.listedProjects().length
  );

  /**
   * Constructor
   */
  constructor() {
    // The list grows and shrinks with the results: tiles moved by the visitor would keep it at its
    // previous size, so the page goes back to the CSS layout once the new list is rendered
    afterRenderEffect(() => {
      this.listSize();
      untracked(() => this.gridDrag().reset());
    });
  }
}
