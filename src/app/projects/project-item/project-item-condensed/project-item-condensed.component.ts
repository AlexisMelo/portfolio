import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';
import { ProjectItemSkillListComponent } from '../project-item-skill-list/project-item-skill-list.component';

@Component({
  selector: 'app-project-item-condensed',
  standalone: true,
  imports: [
    ActionButtonComponent,
    RouterLink,
    DatePipe,
    StatusPipe,
    MatIconModule,
    ProjectItemSkillListComponent,
  ],
  templateUrl: './project-item-condensed.component.html',
  styleUrl: './project-item-condensed.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectCondensedItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  @Input({ required: true }) project!: Project;

  /**
   * Skills to display on project preview
   */
  get highlightedSkills() {
    return this.project.project_skills
      .filter(s => s.highlight)
      .map(s => s.skill);
  }
}
