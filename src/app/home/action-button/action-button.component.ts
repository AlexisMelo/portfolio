import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-button',
  imports: [MatIconModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  /**
   * Icon à afficher dans le bouton
   */
  @Input() icon: string | null = null;

  /**
   * Texte à afficher à côté du bouton
   */
  @Input() text?: string;

  /**
   * Est-ce que le bouton doit être déroulé ?
   */
  @HostBinding('class.unfold') @Input() unfold: boolean = false;

  /**
   * Position du bouton.
   * Position absolute doit être à true
   */
  @HostBinding('class') @Input() position:
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-left-2'
    | 'top-right'
    | 'center-right' = 'bottom-left';

  /**
   * Est-ce que le bouton doit être positionné de façon absolue
   */
  @HostBinding('class.position-absolute') @Input() positionAbsolute: boolean =
    true;

  /**
   * Est-ce que le texte est vide ? Utile pour le css
   */
  @HostBinding('class.text-is-empty') get textEmpty() {
    return this.text === '' || this.text === undefined;
  }
}
