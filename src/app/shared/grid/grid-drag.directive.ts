import {
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { GridArea, rearrange, sameArea } from './grid-layout';

/**
 * Distance a mouse or pen moves, in pixels, before a press becomes a drag instead of a click
 */
const DRAG_THRESHOLD = 6;

/**
 * Time a finger stays down, in milliseconds, before it picks the tile up
 */
const LONG_PRESS_DELAY = 500;

/**
 * Distance a finger moves, in pixels, before the long press is dropped in favour of scrolling
 */
const LONG_PRESS_TOLERANCE = 8;

/**
 * Height of the bands at the top and bottom of the window, in pixels, that scroll the page while dragging
 */
const EDGE_SCROLL_ZONE = 80;

/**
 * Fastest scroll while dragging near an edge, in pixels per frame
 */
const EDGE_SCROLL_SPEED = 14;

/**
 * Duration of the slide of a tile to its new place, in milliseconds
 */
const SLIDE_DURATION = 400;

/**
 * Easing of the slides: fast start, long soft end
 */
const SLIDE_EASING = 'cubic-bezier(0.2, 0, 0, 1)';

/**
 * Scale of the dragged tile, which looks lifted from the grid
 */
const LIFT_SCALE = 1.03;

/**
 * Duration of the lift of a tile when it is picked up, in milliseconds
 */
const LIFT_DURATION = 200;

/**
 * Elements that keep their own pointer behaviour (text selection) instead of starting a drag
 */
const IGNORED_TARGETS = 'input, textarea, select, [contenteditable]';

/**
 * Class of the dragged tile (styles.scss)
 */
const DRAGGING_CLASS = 'g-grid-item-dragging';

/**
 * Class of the outline showing where the dragged tile lands (styles.scss), which is not a tile
 */
export const PLACEHOLDER_CLASS = 'g-grid-drop-placeholder';

/**
 * Class on the root element while a tile is dragged (styles.scss)
 */
const ROOT_DRAGGING_CLASS = 'g-grid-dragging';

/**
 * Size of the grid tracks, read from the grid
 */
interface GridMetrics {
  /**
   * Number of columns
   */
  columns: number;

  /**
   * Distance between the starts of two columns, in pixels
   */
  colStep: number;

  /**
   * Distance between the starts of two rows, in pixels
   */
  rowStep: number;

  /**
   * Space between two columns, in pixels
   */
  colGap: number;

  /**
   * Space between two rows, in pixels
   */
  rowGap: number;
}

/**
 * Press on a tile that may become a drag
 */
interface Gesture {
  /**
   * Pointer pressing the tile
   */
  pointerId: number;

  /**
   * Whether it is a finger, which waits for a long press
   */
  touch: boolean;

  /**
   * Pressed tile
   */
  tile: HTMLElement;

  /**
   * Where the press started, in window coordinates
   */
  startX: number;
  startY: number;

  /**
   * Latest pointer position, in window coordinates
   */
  x: number;
  y: number;

  /**
   * Timer of the long press, for a finger
   */
  timer?: ReturnType<typeof setTimeout>;
}

/**
 * Tile being dragged
 */
interface Drag {
  /**
   * Dragged tile
   */
  tile: HTMLElement;

  /**
   * Every tile of the grid, in DOM order
   */
  tiles: HTMLElement[];

  /**
   * Index of the dragged tile in tiles
   */
  index: number;

  /**
   * Area of every tile when the drag started
   */
  start: GridArea[];

  /**
   * Area every tile is displayed on now. For the dragged tile, the area it lands on when dropped.
   */
  applied: GridArea[];

  /**
   * Area under the dragged tile the layout was computed for, where it is dropped before the tiles rise
   */
  target: GridArea;

  /**
   * When the tile was picked up, in milliseconds (performance.now()), which runs its lift
   */
  startedAt: number;

  /**
   * Grid tracks
   */
  metrics: GridMetrics;

  /**
   * Position of the pointer in the tile when the drag started, in pixels
   */
  grabX: number;
  grabY: number;

  /**
   * Element scrolled when the pointer nears the top or bottom of the window
   */
  scroller: Element;

  /**
   * Outline of the area the tile lands on
   */
  placeholder: HTMLElement;

  /**
   * Pending animation frame
   */
  frame: number;
}

/**
 * Lets visitors rearrange the tiles of a page grid with drag and drop. A tile is picked up by moving
 * the mouse a few pixels while pressing it, or by a long press with a finger; a simple click still
 * works as usual. Tiles it lands on swap places with it or are pushed down, then every tile rises
 * as far as it can, so that no space is left empty above a tile.
 * The layout is not saved: it goes back to the CSS one on reload, when the window width changes,
 * and when tiles are added or removed (filters, data arriving).
 */
@Directive({
  selector: '[appGridDrag]',
  host: { class: 'g-grid-drag' },
})
export class GridDragDirective implements OnDestroy {
  /**
   * The grid element
   */
  private readonly grid: HTMLElement = inject(ElementRef).nativeElement;

  /**
   * Document, which follows the pointer once a tile is pressed
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Press that may become a drag
   */
  private gesture?: Gesture;

  /**
   * Drag in progress
   */
  private drag?: Drag;

  /**
   * Window width the tiles were pinned at, undefined while the CSS layout is in use
   */
  private pinnedWidth?: number;

  /**
   * Whether the visitor asked for reduced motion, which leaves the slides out
   */
  private readonly reducedMotion = matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  /**
   * Goes back to the CSS layout when tiles are added or removed
   */
  private readonly mutationObserver = new MutationObserver(records => {
    const changed = records.some(record =>
      [...record.addedNodes, ...record.removedNodes].some(
        node =>
          node instanceof HTMLElement &&
          !node.classList.contains(PLACEHOLDER_CLASS)
      )
    );
    if (changed) this.reset();
  });

  /**
   * Goes back to the CSS layout when the window width changes, which may change the number of columns.
   * The columns cannot be counted instead: pinned tiles past the last column add columns to the grid.
   */
  private readonly onResize = (): void => {
    if (
      this.pinnedWidth !== undefined &&
      this.document.defaultView?.innerWidth !== this.pinnedWidth
    ) {
      this.reset();
    }
  };

  /**
   * Constructor: listens to presses on the grid with native listeners, which do not run change detection
   */
  constructor() {
    // capture: tiles such as the map stop the propagation of their own pointer events
    this.grid.addEventListener('pointerdown', this.onPointerDown, {
      capture: true,
    });
    // links and images would start the browser's own drag and drop
    this.grid.addEventListener('dragstart', this.preventDefault, {
      capture: true,
    });
    // a listener added once the finger is down could not stop the page from scrolling
    this.grid.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    this.mutationObserver.observe(this.grid, { childList: true });
    this.document.defaultView?.addEventListener('resize', this.onResize);
  }

  /**
   * Stops listening, and drops a tile still being dragged
   */
  ngOnDestroy(): void {
    this.cancelGesture();
    this.endDrag();
    this.grid.removeEventListener('pointerdown', this.onPointerDown, {
      capture: true,
    });
    this.grid.removeEventListener('dragstart', this.preventDefault, {
      capture: true,
    });
    this.grid.removeEventListener('touchmove', this.onTouchMove);
    this.mutationObserver.disconnect();
    this.document.defaultView?.removeEventListener('resize', this.onResize);
  }

  /**
   * Starts following a press on a tile
   */
  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.gesture || this.drag || !event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.target as Element;
    if (target.closest(IGNORED_TARGETS)) return;

    const tile = this.tileOf(target);
    if (!tile) return;

    const touch = event.pointerType === 'touch';
    this.gesture = {
      pointerId: event.pointerId,
      touch,
      tile,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
    };
    if (touch) {
      this.gesture.timer = setTimeout(() => this.startDrag(), LONG_PRESS_DELAY);
    }

    this.document.addEventListener('pointermove', this.onPointerMove, {
      capture: true,
      passive: true,
    });
    this.document.addEventListener('pointerup', this.onPointerUp, {
      capture: true,
    });
    this.document.addEventListener('pointercancel', this.onPointerUp, {
      capture: true,
    });
    this.document.addEventListener('contextmenu', this.onContextMenu, {
      capture: true,
    });
  };

  /**
   * Follows the pointer: starts the drag once it moved far enough, or gives up the long press when
   * a finger starts scrolling
   */
  private readonly onPointerMove = (event: PointerEvent): void => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;

    // the button was released outside the window, where the release is not reported
    if (!gesture.touch && event.buttons === 0) {
      this.onPointerUp(event);
      return;
    }

    gesture.x = event.clientX;
    gesture.y = event.clientY;
    if (this.drag) return;

    const distance = Math.hypot(
      gesture.x - gesture.startX,
      gesture.y - gesture.startY
    );
    if (gesture.touch) {
      if (distance > LONG_PRESS_TOLERANCE) this.cancelGesture();
    } else if (distance > DRAG_THRESHOLD) {
      this.startDrag();
    }
  };

  /**
   * Drops the tile, or lets the click happen when the press never became a drag
   */
  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.gesture || event.pointerId !== this.gesture.pointerId) return;

    if (this.drag) {
      // a quick flick can end before the first frame of the drag
      this.follow(this.drag, this.gesture);
      this.endDrag();
      this.preventNextClick();
    }
    this.cancelGesture();
  };

  /**
   * Keeps a long press from opening the context menu
   */
  private readonly onContextMenu = (event: Event): void => {
    if (this.gesture?.touch) event.preventDefault();
  };

  /**
   * Keeps a dragging finger from scrolling the page
   */
  private readonly onTouchMove = (event: TouchEvent): void => {
    if (this.drag && event.cancelable) event.preventDefault();
  };

  /**
   * Cancels the default action of an event
   */
  private readonly preventDefault = (event: Event): void => {
    event.preventDefault();
  };

  /**
   * Cancels the click that follows the release of a dragged tile, so that its link or button stays untouched
   */
  private readonly preventClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Picks the pressed tile up: pins every tile where it is, then follows the pointer
   */
  private startDrag(): void {
    const gesture = this.gesture;
    if (!gesture || this.drag) return;
    clearTimeout(gesture.timer);

    const metrics = this.readMetrics();
    const tiles = this.tiles();
    const index = tiles.indexOf(gesture.tile);
    if (metrics.columns === 0 || index < 0) {
      this.cancelGesture();
      return;
    }

    // tiles placed by the browser would flow around the moved ones: every tile gets its area written
    const start = tiles.map(tile => this.readArea(tile, metrics));
    tiles.forEach((tile, i) => this.applyArea(tile, start[i]));
    this.pinnedWidth = this.document.defaultView?.innerWidth;

    const tile = gesture.tile;
    const rect = tile.getBoundingClientRect();
    tile.getAnimations().forEach(animation => animation.cancel());
    tile.classList.add(DRAGGING_CLASS);
    // sticky tiles go back to their grid area, which the pointer offset is computed from
    tile.style.position = 'relative';
    tile.style.zIndex = '1000';
    // the transform follows the pointer without delay; the larger shadow fades in
    tile.style.transition = 'box-shadow 200ms';

    const placeholder = this.document.createElement('div');
    placeholder.className = PLACEHOLDER_CLASS;
    placeholder.setAttribute('aria-hidden', 'true');
    this.applyArea(placeholder, start[index]);
    this.grid.append(placeholder);

    this.drag = {
      tile,
      tiles,
      index,
      start,
      applied: start,
      target: start[index],
      startedAt: performance.now(),
      metrics,
      grabX: gesture.startX - rect.left,
      grabY: gesture.startY - rect.top,
      scroller: this.scrollParent(),
      placeholder,
      frame: requestAnimationFrame(this.onFrame),
    };

    this.document.documentElement.classList.add(ROOT_DRAGGING_CLASS);
    this.document.getSelection()?.removeAllRanges();
  }

  /**
   * Each frame of a drag: scrolls near the edges, keeps the tile under the pointer, and moves the
   * other tiles out of the way of the area it would land on
   */
  private readonly onFrame = (): void => {
    const drag = this.drag;
    const gesture = this.gesture;
    if (!drag || !gesture) return;

    this.scrollNearEdges(drag, gesture.y);
    this.follow(drag, gesture);
    drag.frame = requestAnimationFrame(this.onFrame);
  };

  /**
   * Keeps the dragged tile under the pointer, moves the other tiles to where they would be if it were
   * dropped there, and outlines where it would land
   * @param drag drag in progress
   * @param gesture press of the dragged tile
   */
  private follow(drag: Drag, gesture: Gesture): void {
    const { metrics } = drag;
    const home = drag.start[drag.index];
    const gridRect = this.grid.getBoundingClientRect();
    const x = gesture.x - drag.grabX - gridRect.left;
    const y = gesture.y - drag.grabY - gridRect.top;

    // the scale grows with an ease out, and comes after the move so that it does not stretch the distance moved
    const lift = Math.min(
      (performance.now() - drag.startedAt) / LIFT_DURATION,
      1
    );
    const scale = 1 + (LIFT_SCALE - 1) * (1 - (1 - lift) ** 2);
    drag.tile.style.transform = `translate(${x - (home.col - 1) * metrics.colStep}px, ${y - (home.row - 1) * metrics.rowStep}px) scale(${scale})`;

    const target: GridArea = {
      ...home,
      col: Math.min(
        Math.max(Math.round(x / metrics.colStep) + 1, 1),
        Math.max(metrics.columns - home.width + 1, 1)
      ),
      row: Math.max(Math.round(y / metrics.rowStep) + 1, 1),
    };
    if (!sameArea(target, drag.target)) {
      drag.target = target;
      const layout = rearrange(drag.start, drag.index, target);
      this.applyArea(drag.placeholder, layout[drag.index]);
      this.applyLayout(drag, layout);
    }
  }

  /**
   * Drops the dragged tile on the area outlined, sliding it there from under the pointer
   */
  private endDrag(): void {
    const drag = this.drag;
    if (!drag) return;
    this.drag = undefined;

    cancelAnimationFrame(drag.frame);
    drag.placeholder.remove();
    this.document.documentElement.classList.remove(ROOT_DRAGGING_CLASS);

    const { tile } = drag;
    const from = tile.getBoundingClientRect();
    tile.classList.remove(DRAGGING_CLASS);
    tile.style.removeProperty('transform');
    tile.style.removeProperty('position');
    tile.style.removeProperty('z-index');

    // a tile removed meanwhile (filters) is left as it is
    if (tile.isConnected) {
      this.applyArea(tile, drag.applied[drag.index]);
      this.land(tile, from);
    }

    // removed once the style without the transform is computed (by the landing), or the tiles'
    // transform transition would replay the drop
    void tile.offsetWidth;
    tile.style.removeProperty('transition');
  }

  /**
   * Stops following the pointer
   */
  private cancelGesture(): void {
    if (!this.gesture) return;
    clearTimeout(this.gesture.timer);
    this.gesture = undefined;

    this.document.removeEventListener('pointermove', this.onPointerMove, {
      capture: true,
    });
    this.document.removeEventListener('pointerup', this.onPointerUp, {
      capture: true,
    });
    this.document.removeEventListener('pointercancel', this.onPointerUp, {
      capture: true,
    });
    this.document.removeEventListener('contextmenu', this.onContextMenu, {
      capture: true,
    });
  }

  /**
   * Cancels the click the browser sends right after the release. A release without click (finger
   * moved, pointer released outside the tile) leaves it for a short while only.
   */
  private preventNextClick(): void {
    const view = this.document.defaultView;
    if (!view) return;
    view.addEventListener('click', this.preventClick, {
      capture: true,
      once: true,
    });
    setTimeout(
      () =>
        view.removeEventListener('click', this.preventClick, { capture: true }),
      400
    );
  }

  /**
   * Goes back to the CSS layout: ends a drag, and removes the areas written on the tiles
   */
  private reset(): void {
    if (this.pinnedWidth === undefined && !this.drag) return;

    this.cancelGesture();
    this.endDrag();
    this.pinnedWidth = undefined;
    this.tiles().forEach(tile => {
      tile.style.removeProperty('grid-column');
      tile.style.removeProperty('grid-row');
    });
  }

  /**
   * Moves the tiles, except the dragged one, to their new areas
   * @param drag drag in progress
   * @param areas new area of every tile
   */
  private applyLayout(drag: Drag, areas: GridArea[]): void {
    const moved = drag.tiles
      .map((tile, i) => ({ tile, area: areas[i] }))
      .filter(
        ({ area }, i) => i !== drag.index && !sameArea(area, drag.applied[i])
      );
    this.moveElements(
      moved.map(({ tile }) => tile),
      moved.map(({ area }) => area)
    );
    drag.applied = areas;
  }

  /**
   * Writes new areas on elements, and slides them there from where they were displayed.
   * The slides are added to the ones still running, so that a tile that changes course mid-way
   * curves smoothly instead of jumping.
   * @param elements tiles to move
   * @param areas their new areas
   */
  private moveElements(elements: HTMLElement[], areas: GridArea[]): void {
    // offsets are the places in the layout, without the slides still running
    const before = elements.map(element => [
      element.offsetLeft,
      element.offsetTop,
    ]);
    elements.forEach((element, i) => this.applyArea(element, areas[i]));
    if (this.reducedMotion.matches) return;

    elements.forEach((element, i) => {
      const dx = before[i][0] - element.offsetLeft;
      const dy = before[i][1] - element.offsetTop;
      if (dx === 0 && dy === 0) return;
      element.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0px, 0px)' },
        ],
        { duration: SLIDE_DURATION, easing: SLIDE_EASING, composite: 'add' }
      );
    });
  }

  /**
   * Slides the dropped tile from under the pointer to its area, shrinking it back to its size
   * @param tile dropped tile, already on its area
   * @param from where it was displayed, lifted, in window coordinates
   */
  private land(tile: HTMLElement, from: DOMRect): void {
    if (this.reducedMotion.matches) return;

    const to = tile.getBoundingClientRect();
    // measured from the centres, which the scale keeps in place
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const scale = to.width > 0 ? from.width / to.width : 1;
    tile.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: 'none' },
      ],
      { duration: SLIDE_DURATION, easing: SLIDE_EASING }
    );
  }

  /**
   * Scrolls the page when the pointer is near the top or bottom of the window, faster closer to the edge
   */
  private scrollNearEdges(drag: Drag, pointerY: number): void {
    const height = this.document.defaultView?.innerHeight ?? 0;
    let speed = 0;
    if (pointerY < EDGE_SCROLL_ZONE) {
      speed = -EDGE_SCROLL_SPEED * (1 - pointerY / EDGE_SCROLL_ZONE);
    } else if (pointerY > height - EDGE_SCROLL_ZONE) {
      speed = EDGE_SCROLL_SPEED * (1 - (height - pointerY) / EDGE_SCROLL_ZONE);
    }
    if (speed !== 0) drag.scroller.scrollBy(0, Math.round(speed));
  }

  /**
   * Writes an area on a tile, as its grid lines
   */
  private applyArea(element: HTMLElement, area: GridArea): void {
    element.style.gridColumn = `${area.col} / span ${area.width}`;
    element.style.gridRow = `${area.row} / span ${area.height}`;
  }

  /**
   * Reads the area of a tile: from its grid lines when they are set, otherwise from where the
   * browser placed it. Sticky tiles always have their lines set, as their position may be shifted.
   */
  private readArea(tile: HTMLElement, metrics: GridMetrics): GridArea {
    const style = getComputedStyle(tile);
    const cols = this.readLines(
      style.gridColumnStart,
      style.gridColumnEnd,
      metrics.columns
    );
    const rows = this.readLines(style.gridRowStart, style.gridRowEnd);
    if (cols && rows) {
      return {
        col: cols.start,
        row: rows.start,
        width: cols.span,
        height: rows.span,
      };
    }

    // offsets are not affected by the transforms of the entrance animations
    const x =
      tile.offsetParent === this.grid
        ? tile.offsetLeft
        : tile.offsetLeft - this.grid.offsetLeft;
    const y =
      tile.offsetParent === this.grid
        ? tile.offsetTop
        : tile.offsetTop - this.grid.offsetTop;
    return {
      col: Math.round(x / metrics.colStep) + 1,
      row: Math.round(y / metrics.rowStep) + 1,
      width: Math.max(
        Math.round((tile.offsetWidth + metrics.colGap) / metrics.colStep),
        1
      ),
      height: Math.max(
        Math.round((tile.offsetHeight + metrics.rowGap) / metrics.rowStep),
        1
      ),
    };
  }

  /**
   * Reads the computed start and end lines of a tile on one axis
   * @param start computed start line, e.g. "3", "auto" or "span 2"
   * @param end computed end line, e.g. "5", "-1", "auto" or "span 2"
   * @param tracks number of explicit tracks, which negative lines count from
   * @returns first track and number of tracks, or undefined when the browser places the tile
   */
  private readLines(
    start: string,
    end: string,
    tracks?: number
  ): { start: number; span: number } | undefined {
    const first = Number(start);
    if (!Number.isInteger(first) || first < 1) return undefined;
    if (end === 'auto') return { start: first, span: 1 };

    const span = /^span (\d+)$/.exec(end);
    if (span) return { start: first, span: Number(span[1]) };

    let last = Number(end);
    if (!Number.isInteger(last)) return undefined;
    if (last < 0) {
      if (tracks === undefined) return undefined;
      last = tracks + 2 + last;
    }
    return last > first ? { start: first, span: last - first } : undefined;
  }

  /**
   * Reads the size of the grid tracks
   */
  private readMetrics(): GridMetrics {
    const style = getComputedStyle(this.grid);
    const tracks = style.gridTemplateColumns.split(' ').filter(Boolean);
    const cell = parseFloat(tracks[0]) || 0;
    const colGap = parseFloat(style.columnGap) || 0;
    const rowGap = parseFloat(style.rowGap) || 0;
    const rowSize = parseFloat(style.gridAutoRows) || cell;
    return {
      columns: tracks.length,
      colStep: cell + colGap,
      rowStep: rowSize + rowGap,
      colGap,
      rowGap,
    };
  }

  /**
   * Displayed tiles of the grid, in DOM order
   */
  private tiles(): HTMLElement[] {
    return [...this.grid.children].filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        !child.classList.contains(PLACEHOLDER_CLASS) &&
        getComputedStyle(child).display !== 'none'
    );
  }

  /**
   * Tile containing an element, if any
   */
  private tileOf(element: Element): HTMLElement | undefined {
    let current: Element | null = element;
    while (current && current.parentElement !== this.grid) {
      current = current.parentElement;
    }
    return current instanceof HTMLElement &&
      !current.classList.contains(PLACEHOLDER_CLASS)
      ? current
      : undefined;
  }

  /**
   * First ancestor of the grid that scrolls, which is the body on this site
   */
  private scrollParent(): Element {
    let current = this.grid.parentElement;
    while (current) {
      const { overflowY } = getComputedStyle(current);
      if (
        /(auto|scroll)/.test(overflowY) &&
        current.scrollHeight > current.clientHeight
      ) {
        return current;
      }
      current = current.parentElement;
    }
    return this.document.scrollingElement ?? this.document.documentElement;
  }
}
