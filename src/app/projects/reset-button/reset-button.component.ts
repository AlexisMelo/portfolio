import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-reset-button',
  imports: [MatIconModule],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.scss',
})
export class ResetButtonComponent {
  /**
   * Projects and their filters
   */
  private projectsService = inject(ProjectsService);

  /**
   * Handle click on component
   */
  @HostListener('click') onClick() {
    this.projectsService.clearFiltering();
  }
}
