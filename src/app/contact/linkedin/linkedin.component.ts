import { Component, inject } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { ThemeService } from 'src/app/shared/theme.service';
import { GridItemDirective } from '../grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-linkedin',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './linkedin.component.html',
  styleUrl: './linkedin.component.scss',
})
export class LinkedinComponent extends GridItemDirective {
  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Ouvre Linkedin
   */
  public openLinkedin() {
    window.open(this.contentService.linkedIn, '_blank');
  }
}
