import { Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { ActionButtonComponent } from '../../contact/action-button/action-button.component';
import { ProjectItem } from './project-item.model';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [RouterLink, ActionButtonComponent],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
})
export class ProjectItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  @Input({ required: true }) project!: ProjectItem;

  /**
   * Couleur de fond
   */
  @HostBinding('style.backgroundColor') get color() {
    return this.themeService.isDarkMode ? 'transparent' : this.project.color;
  }
}
