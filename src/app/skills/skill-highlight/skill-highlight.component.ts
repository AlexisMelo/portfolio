import { NgClass, NgStyle } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { Skill } from 'src/app/skills/skill.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-skill-highlight',
  standalone: true,
  imports: [MatIconModule, NgStyle, NgClass],
  templateUrl: './skill-highlight.component.html',
  styleUrl: './skill-highlight.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class SkillHighlightComponent extends GridItemDirective {
  /**
   * Compétence à afficher
   */
  @Input({ required: true }) skill!: Skill;

  /**
   * Couleur de l'icone
   */
  @Input() iconColor: string = 'default';

  /**
   * Gestion des routes
   */
  private router = inject(Router);

  /**
   * Redirection vers les projets en cas de click
   */
  @HostListener('click')
  onClick() {
    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: {
        skills: [this.skill.id],
      },
    });
  }
}
