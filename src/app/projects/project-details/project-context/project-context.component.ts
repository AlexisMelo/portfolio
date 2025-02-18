import { Component, inject, Input } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-context',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './project-context.component.html',
  styleUrl: './project-context.component.scss',
  host: { class: 'g-start-aligned' },
})
export class ProjectContextComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Gestion du routeur
   */
  private router = inject(Router);

  /**
   * Ouvre plus de projets du même contexte
   */
  public moreProjects() {
    this.router.navigate(['/projects'], {
      queryParams: {
        contexts: this.project.project_context.id,
      },
      fragment: 'archives',
    });
  }
}
