import { Component, input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-key-header',
  imports: [],
  templateUrl: './key-header.component.html',
  styleUrl: './key-header.component.scss',
  hostDirectives: [GridItemDirective],
})
export class KeyHeaderComponent {
  /**
   * Chips to display under the title
   */
  public chips = input<string[]>();
}
