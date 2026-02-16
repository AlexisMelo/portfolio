import { Component, HostListener, inject } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-linkedin',
  imports: [],
  templateUrl: './linkedin.component.html',
  styleUrl: './linkedin.component.scss',
})
export class LinkedinComponent {
  /**
   * Handle content
   */
  public contentService = inject(ContentService);

  /**
   * Handle theming
   */
  public themeService = inject(ThemeService);

  /**
   * Action when clicking on component
   */
  @HostListener('click') click() {
    this.openLinkedin();
  }

  /**
   * Ouvre Linkedin
   */
  public openLinkedin() {
    window.open(this.contentService.linkedIn, '_blank');
  }
}
