import { Component, inject, Input } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-project-problematic',
  imports: [],
  templateUrl: './project-problematic.component.html',
  styleUrl: './project-problematic.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectProblematicComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Sanitizer
   */
  private sanitizer = inject(DomSanitizer);

  /**
   * Problématique
   */
  get problematic() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.project.problematic ?? '...'
    );
  }
}
