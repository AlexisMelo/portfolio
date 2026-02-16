import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ArchivesService } from '../archives.service';

@Component({
  selector: 'app-reset-button',
  imports: [MatIconModule],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.scss',
})
export class ResetButtonComponent {
  /**
   * Handle archives
   */
  private archivesService = inject(ArchivesService);

  /**
   * Handle click on component
   */
  @HostListener('click') onClick() {
    this.archivesService.clearFiltering();
    console.log('cleared');
  }
}
