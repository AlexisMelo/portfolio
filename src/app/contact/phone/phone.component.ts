import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
})
export class PhoneComponent extends GridItemDirective {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Lancer l'appel
   */
  public call() {
    window.open('tel:' + this.contentService.phone);
  }
}
