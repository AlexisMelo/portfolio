import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Hides the grid children matching the selector, then reveals them one after another
 * @param selector children to animate, relative to the grid
 */
function staggeredEntrance(selector: string) {
  return [
    // start all children hidden
    query(selector, [style({ opacity: 0.1, transform: 'translateY(80px)' })], {
      optional: true,
    }),

    // animate them one by one with a stagger
    query(
      selector,
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
  ];
}

export const gridItemAnimation = trigger('gridItemAnimation', [
  transition(':enter', staggeredEntrance(':scope > *')),
]);

/**
 * Staggered entrance for tiles added to an already rendered grid (e.g. once Supabase data arrives).
 * Bind it to a value that changes when tiles are added.
 */
export const asyncGridItemAnimation = trigger('asyncGridItemAnimation', [
  transition('* => *', staggeredEntrance(':scope > :enter')),
]);

/**
 * Replays the staggered entrance of the tiles matching the selector each time the bound value changes,
 * including tiles that were already displayed
 * @param selector tiles to animate, among the grid children
 */
export function replayGridItemAnimation(selector: string) {
  return trigger('replayGridItemAnimation', [
    // the first render is handled by gridItemAnimation
    transition(':enter', []),
    // tiles being removed are left out, as Angular keeps animated tiles in the DOM until their animation ends
    transition(
      '* => *',
      staggeredEntrance(`:scope > :is(${selector}):not(:leave)`)
    ),
  ]);
}
