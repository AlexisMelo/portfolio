import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
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

  /** Language service */
  private languageService = inject(LanguageService);

  /**
   * Skills to display
   */
  protected highlightedSkills = computed(() => {
    return this.project()
      .project_skills.filter(s => s.highlight)
      .map(s => s.skill);
  });

  /** Description in the currently active language. */
  protected description = computed(
    () =>
      this.project().localizedDescription?.[this.languageService.currentLang()]
  );
}
