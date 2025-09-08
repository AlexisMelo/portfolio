import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../../../home/action-button/action-button.component';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-details-icon',
  standalone: true,
  imports: [NgOptimizedImage, ActionButtonComponent],
  templateUrl: './project-details-icon.component.html',
  styleUrl: './project-details-icon.component.scss',
})
export class ProjectDetailsIconComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Ouvre le lien du projet
   */
  public openLink() {
    if (!this.project.deployment) return;
    window.open(this.project.deployment);
  }
}
