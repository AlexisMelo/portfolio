import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { Project } from '../../project.model';
import { ProjectItemSkillListComponent } from '../project-item-skill-list/project-item-skill-list.component';

@Component({
  selector: 'app-project-item-condensed',
  imports: [MatIconModule, ProjectItemSkillListComponent],
  templateUrl: './project-item-condensed.component.html',
  styleUrl: './project-item-condensed.component.scss',
  host: {
    class: 'g-grid-item-start-aligned',
    '(click)': 'navigate()',
  },
})
export class ProjectCondensedItemComponent extends GridItemDirective {
  /** Project to display */
  public project = input.required<Project>();

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Language service
   */
  private languageService = inject(LanguageService);

  /** Description in the currently active language. */
  protected description = computed(
    () =>
      this.project()?.localizedDescription?.[this.languageService.currentLang()]
  );

  /** Main illustration for the project */
  public firstIllustration = computed(() => {
    const project = this.project();

    if (project.illustrations.length === 0) return null;

    return project.illustrations.reduce((prev, current) =>
      prev.position > current.position ? current : prev
    );
  });

  /** Skills to display on project preview */
  protected highlightedSkills = computed(() =>
    this.project()
      .project_skills.filter(s => s.highlight)
      .map(s => s.skill)
  );

  /** Navigate to the project detail page. */
  protected navigate() {
    this.router.navigate([PROJECTS_ROUTE, this.project().url]);
  }
}
