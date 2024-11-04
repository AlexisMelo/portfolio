import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /**
   * Evènement déclenché lors d'un clic sur le bouton
   */
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter();

  /**
   * Style du bouton
   */
  @Input() style: 'outlined' | 'plain' = 'plain';

  /**
   * Lors d'un clic sur le bouton
   */
  click() {
    this.buttonClicked.next();
  }
}
