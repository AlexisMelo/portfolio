import { Component, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-project-counter',
  standalone: true,
  imports: [],
  templateUrl: './project-counter.component.html',
  styleUrl: './project-counter.component.scss',
})
export class ProjectCounterComponent extends GridItemDirective {
  /**
   * Number to show on top of the counter.
   */
  @Input({ required: true }) numerator!: number;

  /**
   * Number to show on the bottom of the counter.
   */
  @Input({ required: true }) denominator!: number;
}
