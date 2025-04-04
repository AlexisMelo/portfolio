import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { HighlightableChipComponent } from 'src/app/shared/chips/highlightable-chip/highlightable-chip.component';
import { TooltipDirective } from 'src/app/shared/tooltip/tooltip.directive';
import { Project } from '../../project.model';
import { Skill } from '../../skill.model';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-project-skills',
  standalone: true,
  imports: [
    KeyValuePipe,
    HighlightableChipComponent,
    TooltipDirective,
    RouterLink,
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
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Technologies avec lesquelles j'ai travaillées, groupées par type
   */
  get workedWith(): { [key: string]: Skill[] } {
    if (!this.project.skills) return {};
    return this.project.skills.reduce(
      (group: { [key: string]: Skill[] }, item: Skill) => {
        group[item.skill_type.label] = group[item.skill_type.label] || [];
        group[item.skill_type.label].push(item);
        return group;
      },
      {}
    );
  }
}
