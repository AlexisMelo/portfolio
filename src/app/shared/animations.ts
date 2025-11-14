import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const gridItemAnimation = trigger('gridItemAnimation', [
  transition(':enter', [
    // start all children hidden
    query(
      ':scope > *',
      [style({ opacity: 0.1, transform: 'translateY(80px)' })],
      { optional: true }
    ),

    // animate them one by one with a stagger
    query(
      ':scope > *',
      [
        stagger(50, [
          animate(
            '200ms ease-in',
            style({
              opacity: 1,
              transform: 'translateY(0)',
            })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);
