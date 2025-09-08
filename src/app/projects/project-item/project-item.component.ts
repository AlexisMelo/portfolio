import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { ActionButtonComponent } from '../../home/action-button/action-button.component';
import { ProjectItemSkillListComponent } from './project-item-skill-list/project-item-skill-list.component';
import { ProjectItem } from './project-item.model';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [
    RouterLink,
    ActionButtonComponent,
    RouterLink,
    ProjectItemSkillListComponent,
    LoaderComponent,
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  @Input({ required: true }) project?: ProjectItem;

  /**
   * Lien vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

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
}
