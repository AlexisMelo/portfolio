import { Component, Input } from '@angular/core';
import { DotColor } from './dot-color.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dot',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dot.component.html',
  styleUrl: './dot.component.scss',
})
export class DotComponent {
  /**
   * Couleur du point
   */
  @Input() color: DotColor = 'green';
}
