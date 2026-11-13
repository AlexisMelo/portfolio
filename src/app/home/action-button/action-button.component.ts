import { booleanAttribute, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Places of an action button laid over its tile, from its bottom corners
 */
export type ActionButtonPosition =
  | 'bottom-left'
  | 'bottom-left-2'
  | 'bottom-right';

/**
 * Every round button of the tiles: round with an icon, a pill with the text it holds. It goes on a
 * native button or link, so that it is reached with the keyboard; an icon-only one needs an
 * aria-label. On a span, it only gives the look, for the visual button of a larger link.
 */
@Component({
  selector:
    'button[app-action-button], a[app-action-button], span[app-action-button]',
  imports: [MatIconModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  host: {
    '[class]': 'position()',
    '[class.with-icon]': '!!icon()',
    '[class.icon-end]': 'iconEnd()',
  },
})
export class ActionButtonComponent {
  /**
   * Name of the Material Symbols icon, which must be in the font link of index.html
   */
  public readonly icon = input<string>();

  /**
   * Whether the icon comes after the text instead of before it
   */
  public readonly iconEnd = input(false, { transform: booleanAttribute });

  /**
   * Place of the button over its tile, which must be positioned; in the flow when not given
   */
  public readonly position = input<ActionButtonPosition>();
}
