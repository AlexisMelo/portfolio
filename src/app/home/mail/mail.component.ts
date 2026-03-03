import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-mail',
  imports: [ActionButtonComponent, TranslocoPipe],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class MailComponent extends GridItemDirective {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Ouvre le gestionnaire de mails
   */
  public sendEmail() {
    window.open('mailto:' + this.contentService.mail);
  }
}
