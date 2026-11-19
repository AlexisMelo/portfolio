import { Component, input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Tile of the legal page: a heading and the projected text
 */
@Component({
  selector: 'app-legal-section',
  templateUrl: './legal-section.html',
  styleUrl: './legal-section.scss',
  hostDirectives: [GridItemDirective],
})
export class LegalSection {
  /**
   * Heading of the section, already translated
   */
  public readonly heading = input.required<string>();
}
