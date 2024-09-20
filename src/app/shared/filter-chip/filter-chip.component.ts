import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss',
  animations: [
    trigger('matIcon', [
      transition(':enter', [
        style({
          width: '0',
        }),
        animate(
          '100ms linear',
          style({
            width: '1rem',
          })
        ),
      ]),
      transition(':leave', [
        style({
          width: '1rem',
          fontSize: '1rem',
          height: '1rem',
          marginRight: '0.5rem',
          marginLeft: '0.5rem',
        }),
        animate(
          '100ms linear',
          style({
            width: '0',
          })
        ),
      ]),
    ]),
  ],
})
export class FilterChipComponent {
  /**
   * Texte à afficher sur la chips
   */
  @Input({ required: true }) label!: string;

  /**
   * Est-ce que la chips doit avoir l'état "Active" ?
   */
  @HostBinding('class.active') @Input({ required: false }) active: boolean =
    false;
}
