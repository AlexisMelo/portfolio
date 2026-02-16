import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dot',
  imports: [],
  templateUrl: './dot.component.html',
  styleUrl: './dot.component.scss',
})
export class DotComponent {
  /**
   * CSS Color for the dot
   */
  public color = input('green');

  /**
   * Should the dot animate with a pulse effect
   */
  public pulse = input(true);
}
