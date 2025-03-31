import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { Skill } from 'src/app/projects/skill.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-skills-recap',
  standalone: true,
  imports: [KeyValuePipe, RouterLink],
  templateUrl: './skills-recap.component.html',
  styleUrl: './skills-recap.component.scss',
})
export class SkillsRecapComponent extends GridItemDirective {
  /**
   * Compétences à afficher
   */
  @Input({ required: true }) skills!: Array<Skill>;

  /**
   * Couleur de fond des skills
   */
  @Input({ required: true }) bgColor!: string;

  /**
   * Couleur d'écriture des skills
   */
  @Input({ required: true }) color!: string;

  /**
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Technologies groupées par type
   */
  get groupedSkills(): { [key: string]: Skill[] } {
    if (!this.skills) return {};
    const skillsGrouped = this.skills.reduce(
      (group: { [key: string]: Skill[] }, item: Skill) => {
        group[item.skill_type.label] = group[item.skill_type.label] || [];
        group[item.skill_type.label].push(item);
        return group;
      },
      {}
    );
    return Object.fromEntries(
      Object.entries(skillsGrouped).map(([key, skills]) => [
        key,
        [...skills].sort((a, b) => (a.mastery > b.mastery ? -1 : 1)),
      ])
    );
  }
}
