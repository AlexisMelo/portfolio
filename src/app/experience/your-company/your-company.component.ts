import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Coral tile of the experience page inviting companies to be the next step of the path, with the
 * smiling face of the avatar in its corner and a button opening the mail app
 */
@Component({
  selector: 'app-your-company',
  imports: [ActionButtonComponent, NgOptimizedImage, TranslocoPipe],
  templateUrl: './your-company.component.html',
  styleUrl: './your-company.component.scss',
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class YourCompanyComponent {
  /**
   * Content of the site, which holds the mail address
   */
  protected readonly contentService = inject(ContentService);
}
