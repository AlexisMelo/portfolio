import { Component, Input } from '@angular/core';
import { Skill } from 'src/app/projects/skill.model';
import { RightArrowComponent } from '../../timeline/right-arrow/right-arrow.component';

@Component({
  selector: 'app-skill-front-page',
  standalone: true,
  imports: [RightArrowComponent],
  templateUrl: './skill-front-page.component.html',
  styleUrl: './skill-front-page.component.scss',
})
export class SkillFrontPageComponent {
  /**
   * Skill à afficher
   */
  @Input({ required: true }) skill!: Skill;
}
