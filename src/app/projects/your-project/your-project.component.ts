import { Component, inject } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-your-project',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './your-project.component.html',
  styleUrl: './your-project.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class YourProjectComponent extends GridItemDirective {
  /**
   * Handle content
   */
  public contentService = inject(ContentService);

  /**
   * Open mail app
   */
  public sendEmail() {
    window.open('mailto:' + this.contentService.mail);
  }
}
