import { Component, inject } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [ActionButtonComponent],
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
   * Main text
   */
  public mainText?: SafeHtml;

  /**
   * Sanitizer
   */
  private sanitizer = inject(DomSanitizer);

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.mainText = this.sanitizer.bypassSecurityTrustHtml(
      "Toujours à l'écoute d'opportunités, dis-moi comment je peux t'aider !"
    );
  }

  /**
   * Ouvre le gestionnaire de mails
   */
  public sendEmail() {
    window.open('mailto:' + this.contentService.mail);
  }
}
