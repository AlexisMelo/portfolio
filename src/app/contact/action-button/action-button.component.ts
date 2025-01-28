import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  /**
   * Icon à afficher dans le bouton
   */
  @Input() icon = 'open_in_new';
}
