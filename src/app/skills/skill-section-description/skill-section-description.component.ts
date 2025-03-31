import { Component, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-skill-section-description',
  standalone: true,
  imports: [],
  templateUrl: './skill-section-description.component.html',
  styleUrl: './skill-section-description.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class SkillSectionDescriptionComponent extends GridItemDirective {
  /**
   * Texte principal servant de titre
   */
  @Input({ required: true }) mainText!: string;

  /**
   * Texte descriptif à afficher
   */
  @Input({ required: true }) secondaryText!: string;
}
