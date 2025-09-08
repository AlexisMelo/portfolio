import { Component, HostListener, inject } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

@Component({
  selector: 'app-linkedin',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './linkedin.component.html',
  styleUrl: './linkedin.component.scss',
})
export class LinkedinComponent extends GridItemDirective {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

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
