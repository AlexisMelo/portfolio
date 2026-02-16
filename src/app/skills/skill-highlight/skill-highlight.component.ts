import { NgClass } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Skill } from 'src/app/skills/skill.model';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-skill-highlight',
  imports: [MatIconModule, NgClass, LoaderComponent],
  templateUrl: './skill-highlight.component.html',
  styleUrl: './skill-highlight.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class SkillHighlightComponent extends GridItemDirective {
  /**
   * Compétence à afficher
   */
  @Input({ required: true }) skill?: Skill;

  /**
   * Should the component be displayed as loading
   */
  @Input({ required: true }) loading: boolean = false;

  /**
   * Gestion des routes
   */
  private router = inject(Router);

  /**
   * Redirection vers les projets en cas de click
   */
  @HostListener('click')
  onClick() {
    if (!this.skill) return;

    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: {
        skills: [this.skill.id],
      },
    });
  }
}
