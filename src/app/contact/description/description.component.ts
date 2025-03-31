import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
})
export class DescriptionComponent extends GridItemDirective {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);
}
