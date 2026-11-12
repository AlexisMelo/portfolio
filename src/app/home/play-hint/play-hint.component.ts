import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

/**
 * Tile inviting visitors to play with the grid: a drag icon in the middle, for moving the tiles, and
 * arrows pointing out of the corners, where the tiles are resized. It is decorative and hidden from
 * screen readers, since the tiles can't be moved with the keyboard.
 */
@Component({
  selector: 'app-play-hint',
  imports: [MatIconModule],
  templateUrl: './play-hint.component.html',
  styleUrl: './play-hint.component.scss',
  host: { 'aria-hidden': 'true' },
})
export class PlayHintComponent extends GridItemDirective {}
