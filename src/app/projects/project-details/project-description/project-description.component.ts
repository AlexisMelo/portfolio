import { Component, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';
import { MatIconModule } from '@angular/material/icon';
import { ActionButtonComponent } from '../../../home/action-button/action-button.component';

@Component({
  selector: 'app-project-description',
  standalone: true,
  imports: [MatIconModule, ActionButtonComponent],
  templateUrl: './project-description.component.html',
  styleUrl: './project-description.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectDescriptionComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
