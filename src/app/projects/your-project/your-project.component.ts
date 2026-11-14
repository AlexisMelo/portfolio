import { Component, inject, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ContentService } from 'src/app/shared/content.service';

/**
 * Entry of the project list inviting visitors to bring the next project: a coral row (a card on
 * phones) numbered after the last project. The whole entry opens the mail app.
 */
@Component({
  selector: 'app-your-project',
  imports: [ActionButtonComponent, TranslocoPipe],
  templateUrl: './your-project.component.html',
  styleUrl: './your-project.component.scss',
})
export class YourProjectComponent {
  /**
   * Number the visitor's project would get: the one after the last project
   */
  public readonly number = input.required<number>();

  /**
   * Content of the site, which holds the mail address
   */
  protected readonly contentService = inject(ContentService);
}
