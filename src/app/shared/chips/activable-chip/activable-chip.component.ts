import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SuggestionChipComponent } from '../suggestion-chip/suggestion-chip.component';

@Component({
  selector: 'app-activable-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './activable-chip.component.html',
  styleUrl: './activable-chip.component.scss',
})
export class ActivableChipComponent extends SuggestionChipComponent {
  /**
   * Est-ce que la chips doit avoir l'état "Active" ?
   */
  @HostBinding('class.active') @Input({ required: false }) active: boolean =
    false;
}
