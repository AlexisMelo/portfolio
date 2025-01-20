import {
  NgOptimizedImage,
  NgPlural,
  NgPluralCase,
  SlicePipe,
} from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Skill } from 'src/app/projects/skill.model';

@Component({
  selector: 'app-skill-detailed-card',
  standalone: true,
  imports: [
    SlicePipe,
    MatIconModule,
    NgPlural,
    NgPluralCase,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './skill-detailed-card.component.html',
  styleUrl: './skill-detailed-card.component.scss',
})
export class SkillDetailedCardComponent {
  /**
   * Skill à afficher
   */
  @Input({ required: true }) skill!: Skill;
}
