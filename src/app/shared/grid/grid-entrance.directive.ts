import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  untracked,
} from '@angular/core';

/**
 * Class running the staggered entrance of a tile (styles.scss)
 */
const STAGGER_CLASS = 'g-grid-item-stagger';

/**
 * Keyframes of the staggered entrance (styles.scss)
 */
const STAGGER_ANIMATION = 'g-grid-item-stagger';

/**
 * Position of a tile in its entrance, which sets its delay (styles.scss)
 */
const STAGGER_INDEX = '--g-stagger-index';

/**
 * Staggered entrance of a page grid: the tiles present when the grid first renders enter one after another.
 * Tiles added later only fade in, unless staggerAddedTiles is set.
 */
@Directive({
  selector: '[appGridEntrance]',
  host: { class: 'g-grid-entrance' },
})
export class GridEntranceDirective {
  /**
   * Whether the tiles added after the first render (e.g. once Supabase data arrives) also enter one after another
   */
  public readonly staggerAddedTiles = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Replays the entrance of the tiles matching replaySelector each time this value changes,
   * including tiles already displayed (e.g. a key of the displayed results)
   */
  public readonly replayKey = input<string>();

  /**
   * Tiles whose entrance is replayed, among the grid children
   */
  public readonly replaySelector = input('*');

  /**
   * The grid element
   */
  private readonly grid: HTMLElement = inject(ElementRef).nativeElement;

  /**
   * Constructor
   */
  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.stagger(this.toTiles(this.grid.children));

      if (!this.staggerAddedTiles()) return;
      const observer = new MutationObserver(records => {
        const added = records
          .flatMap(record => this.toTiles(record.addedNodes))
          // tiles removed in the same render, or already animated by a replay, are left out
          .filter(
            tile =>
              tile.parentElement === this.grid &&
              !tile.classList.contains(STAGGER_CLASS)
          );
        this.stagger(added);
      });
      observer.observe(this.grid, { childList: true });
      destroyRef.onDestroy(() => observer.disconnect());
    });

    // the first render is handled by afterNextRender
    let firstRun = true;
    afterRenderEffect(() => {
      this.replayKey();
      if (firstRun) {
        firstRun = false;
        return;
      }
      untracked(() =>
        this.stagger(
          this.toTiles(
            this.grid.querySelectorAll(`:scope > :is(${this.replaySelector()})`)
          )
        )
      );
    });
  }

  /**
   * Makes the tiles enter one after another, in DOM order
   * @param tiles tiles to animate
   */
  private stagger(tiles: HTMLElement[]) {
    if (tiles.length === 0) return;

    // a tile still entering must lose its animation for one style calculation, or the animation would not restart
    const entering = tiles.filter(tile =>
      tile.classList.contains(STAGGER_CLASS)
    );
    if (entering.length > 0) {
      entering.forEach(tile => tile.classList.remove(STAGGER_CLASS));
      void this.grid.offsetWidth;
    }

    tiles.forEach((tile, index) => {
      tile.style.setProperty(STAGGER_INDEX, String(index));
      tile.classList.add(STAGGER_CLASS);
      tile.addEventListener('animationend', this.onStaggerEnd);
    });
  }

  /**
   * Removes the entrance class and index once the tile has entered.
   * Listened on each tile, as animate.enter stops the propagation of the event.
   * @param event animationend event, possibly from an animation inside the tile
   */
  private readonly onStaggerEnd = (event: AnimationEvent) => {
    const tile = event.currentTarget as HTMLElement;
    if (event.target !== tile || event.animationName !== STAGGER_ANIMATION)
      return;

    tile.classList.remove(STAGGER_CLASS);
    tile.style.removeProperty(STAGGER_INDEX);
    tile.removeEventListener('animationend', this.onStaggerEnd);
  };

  /**
   * Keeps the elements of a node list, the tiles
   * @param nodes grid children or added nodes, which include comments from control flow blocks
   */
  private toTiles(nodes: Iterable<Node>): HTMLElement[] {
    return [...nodes].filter(
      (node): node is HTMLElement => node instanceof HTMLElement
    );
  }
}
