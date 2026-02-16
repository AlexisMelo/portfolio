import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectItemSkillListComponent } from '../../project-item/project-item-skill-list/project-item-skill-list.component';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-description',
  imports: [MatIconModule, ProjectItemSkillListComponent],
  templateUrl: './project-description.component.html',
  styleUrl: './project-description.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectDescriptionComponent extends GridItemDirective {
  /**
   * Project
   */
  public readonly project = input.required<Project>();

  /**
   * Skills to display
   */
  protected highlightedSkills = computed(() => {
    return this.project()
      .project_skills.filter(s => s.highlight)
      .map(s => s.skill);
  });
}
