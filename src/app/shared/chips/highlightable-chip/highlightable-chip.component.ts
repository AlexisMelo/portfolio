import { Component, HostBinding, Input } from '@angular/core';
import { SuggestionChipComponent } from '../suggestion-chip/suggestion-chip.component';

@Component({
  selector: 'app-highlightable-chip',
  standalone: true,
  imports: [],
  templateUrl: '../suggestion-chip/suggestion-chip.component.html',
  styleUrl: './highlightable-chip.component.scss',
})
export class HighlightableChipComponent extends SuggestionChipComponent {
  /**
   * Est-ce que la chips doit être mise en avant par un style différent
   */
  @HostBinding('class.highlighted') @Input() highlighted: boolean = false;
}
