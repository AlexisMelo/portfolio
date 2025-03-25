import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [],
  templateUrl: './now.component.html',
  styleUrl: './now.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class NowComponent extends GridItemDirective {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);
}
