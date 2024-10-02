import { Component, HostBinding, Input } from '@angular/core';

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

  /**
   * Est-ce que la chips doit être + large (pour être de la même hauteur qu'un input par exemple)
   */
  @HostBinding('class.large') @Input() large: boolean = false;
}
