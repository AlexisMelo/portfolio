import { Component, Input } from '@angular/core';
import { Skill } from 'src/app/projects/skill.model';
import { HighlightableChipComponent } from '../../shared/chips/highlightable-chip/highlightable-chip.component';
import { KeyValuePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SkillDetailedCardComponent } from './skill-detailed-card/skill-detailed-card.component';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from 'src/app/shared/tooltip/tooltip.directive';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    HighlightableChipComponent,
    KeyValuePipe,
    MatIconModule,
    SkillDetailedCardComponent,
    RouterLink,
    TooltipDirective,
  ],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
})
export class SkillListComponent {
  /**
   * Skills à afficher
   */
  @Input({ required: true }) skills?: Array<Skill>;

  /**
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Technologies avec lesquelles j'ai travaillées, groupées par type
   */
  get workedWith(): { [key: string]: Skill[] } {
    if (!this.skills) return {};
    return this.skills
      .filter(s => !s.loved && !s.currently_learning)
      .reduce((group: { [key: string]: Skill[] }, item: Skill) => {
        group[item.skill_type.label] = group[item.skill_type.label] || [];
        group[item.skill_type.label].push(item);
        return group;
      }, {});
  }

  /**
   * Technologies aimées
   */
  get loved() {
    if (!this.skills) return [];
    return this.skills.filter(s => s.loved);
  }

  /**
   * Technologies en apprentissage
   */
  get learning() {
    if (!this.skills) return [];
    return this.skills.filter(s => s.currently_learning);
  }
}
