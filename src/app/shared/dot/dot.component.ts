import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dot',
  standalone: true,
  imports: [],
  templateUrl: './dot.component.html',
  styleUrl: './dot.component.scss',
})
export class DotComponent {
  /**
   * HEX Color for the dot
   */
  @Input() color: string = 'green';
}
