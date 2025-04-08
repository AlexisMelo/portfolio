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

  public mainText?: SafeHtml;

  private sanitizer = inject(DomSanitizer);

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.mainText = this.sanitizer.bypassSecurityTrustHtml(
      "Toujours à l'écoute d'opportunités et prêt à discuter, je suis joignable par mail à l'adresse <span>Alexis.Melo@outlook.fr</span>"
    );
  }

  /**
   * Ouvre le gestionnaire de mails
   */
  public sendEmail() {
    window.open('mailto:' + this.contentService.mail);
  }
}
