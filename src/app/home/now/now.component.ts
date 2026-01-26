import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-now',
  standalone: true,
  imports: [MatIconModule],
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
