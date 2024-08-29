import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  /**
   * Label
   */
  @Input({ required: true }) label!: string;

  /**
   * Icone à afficher
   */
  @Input() icon?: string;
}
