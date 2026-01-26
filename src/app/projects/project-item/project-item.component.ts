import { Component, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { ProjectItemSkillListComponent } from './project-item-skill-list/project-item-skill-list.component';
import { ProjectItem } from './project-item.model';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [ProjectItemSkillListComponent, LoaderComponent],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class ProjectItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  @Input({ required: true }) project?: ProjectItem;

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Link to projects
   */
  public PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Skills à afficher
   */
  get skills() {
    if (!this.project) return [];

    return this.project.project_skills
      .filter(s => s.highlight)
      .map(s => s.skill);
  }

  /**
   * Illustration à afficher
   */
  get firstIllustration() {
    return this.project?.illustrations.reduce((prev, current) =>
      prev.position > current.position ? current : prev
    );
  }

  /**
   * Handle click on the component
   */
  @HostListener('click') onClick() {
    this.router.navigate([PROJECTS_ROUTE, this.project?.url]);
  }
}
