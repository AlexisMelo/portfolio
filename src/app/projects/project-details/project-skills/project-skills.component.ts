import { KeyValuePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { TooltipDirective } from 'src/app/shared/tooltip/tooltip.directive';
import { Skill } from '../../../skills/skill.model';
import { HighlightableChipComponent } from 'src/app/shared/chips/highlightable-chip/highlightable-chip.component';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-skills',
  standalone: true,
  imports: [
    KeyValuePipe,
    TooltipDirective,
    RouterLink,
    TranslocoPipe,
    HighlightableChipComponent,
  ],
  templateUrl: './project-skills.component.html',
  styleUrl: './project-skills.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectSkillsComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Link to the projects list
   */
  public PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Handle language
   */
  private langService = inject(LanguageService);

  /**
   * Technologies avec lesquelles j'ai travaillées, groupées par type
   */
  get workedWith(): { [key: string]: Skill[] } {
    if (!this.project.project_skills) return {};
    const lang = this.langService.currentLang();
    return this.project.project_skills
      .map(s => s.skill)
      .reduce((group: { [key: string]: Skill[] }, item: Skill) => {
        const label =
          item.skill_type.localizedLabel?.[lang] ?? item.skill_type.label;
        group[label] = group[label] || [];
        group[label].push(item);
        return group;
      }, {});
  }
}
