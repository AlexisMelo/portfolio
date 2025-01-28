import { Component, inject } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
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
