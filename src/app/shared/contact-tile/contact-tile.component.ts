import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Drawings of the avatar a contact tile can show in its corner
 */
export type ContactTileAvatar = 'face-smiling' | 'sitting';

/**
 * Tile inviting visitors to get in touch
 */
@Component({
  selector: 'app-contact-tile',
  imports: [ActionButtonComponent, NgOptimizedImage],
  templateUrl: './contact-tile.component.html',
  styleUrl: './contact-tile.component.scss',
  host: {
    class: 'g-grid-item-highlight',
    '[class.sitting]': "avatar() === 'sitting'",
  },
  hostDirectives: [GridItemDirective],
})
export class ContactTileComponent {
  /**
   * Title of the tile, already translated
   */
  public readonly heading = input.required<string>();

  /**
   * Line under the title, already translated
   */
  public readonly subtitle = input.required<string>();

  /**
   * Text of the button opening the mail app, already translated
   */
  public readonly action = input.required<string>();

  /**
   * Drawing in the corner
   */
  public readonly avatar = input<ContactTileAvatar>('face-smiling');

  /**
   * Content of the site, which holds the mail address
   */
  protected readonly contentService = inject(ContentService);
}
