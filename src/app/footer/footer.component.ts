import { Component, inject } from '@angular/core';
import { ContentService } from '../shared/content.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);
}
