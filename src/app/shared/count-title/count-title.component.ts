import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-count-title',
  imports: [TranslocoPipe],
  templateUrl: './count-title.component.html',
  styleUrl: './count-title.component.scss',
})
export class CountTitleComponent {
  /**
   * Number shown big
   */
  public readonly count = input.required<number>();

  /**
   * What the number counts, already translated and agreed with it ("steps")
   */
  public readonly noun = input.required<string>();

  /**
   * Year the counted things started from, nothing shown when null
   */
  public readonly year = input.required<number | null>();

  /**
   * Total the number is part of, shown in a badge when it differs from the number; no badge when
   * not given
   */
  public readonly total = input<number>();
}
