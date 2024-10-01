import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-suggestion-chip',
  standalone: true,
  imports: [],
  templateUrl: './suggestion-chip.component.html',
  styleUrl: './suggestion-chip.component.scss',
})
export class SuggestionChipComponent {
  /**
   * Texte à afficher sur la chips
   */
  @Input({ required: true }) label!: string;
}
