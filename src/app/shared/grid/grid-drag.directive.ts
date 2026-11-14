import {
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { GridArea, rearrange, sameArea } from './grid-layout';
import {
  EdgeZone,
  edgesAt,
  ResizeEdges,
  resizeArea,
  resizeCursor,
} from './grid-resize';

/**
 * Distance a mouse or pen moves, in pixels, before a press becomes a drag instead of a click
 */
const DRAG_THRESHOLD = 6;

/**
 * Bands along the edges of a tile where a mouse or pen resizes it, in pixels. The band outside
 * covers half the gap between two tiles.
 */
const POINTER_EDGE_ZONE: EdgeZone = { inside: 8, outside: 6, corner: 20 };

/**
 * Bands along the edges of a tile where a long press resizes it, wider for a finger
 */
const TOUCH_EDGE_ZONE: EdgeZone = { inside: 14, outside: 6, corner: 28 };

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
 * Class of the tile being moved or resized (styles.scss)
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
 * Class on the root element while a tile is resized (styles.scss)
 */
const ROOT_RESIZING_CLASS = 'g-grid-resizing';

/**
 * Class on the grid while a mouse or pen is over the edge of a tile (styles.scss)
 */
const RESIZE_HOVER_CLASS = 'g-grid-resize-hover';

/**
 * Custom property holding the resize cursor: on the grid while the pointer is over the edge of a
 * tile, on the root element while a tile is resized (styles.scss)
 */
const RESIZE_CURSOR_PROPERTY = '--g-grid-resize-cursor';

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
   * Edges of the tile the press is on, which resize it instead of moving it
   */
  edges?: ResizeEdges;

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
 * Resize of the dragged tile, whose edges follow the pointer
 */
interface Resize {
  /**
   * Edges following the pointer
   */
  edges: ResizeEdges;

  /**
   * Where the pointer was when the resize started, from the top left corner of the grid, in pixels
   */
  originX: number;
  originY: number;

  /**
   * Distance between where the tile was displayed when the resize started and its area, in pixels:
   * the offset of a stuck sticky tile, which it keeps until it is released
   */
  shiftX: number;
  shiftY: number;
}

/**
 * Tile being dragged, to move it or to resize it
 */
interface Drag {
  /**
   * Dragged tile
   */
  tile: HTMLElement;

  /**
   * Resize in progress, undefined when the tile is moved
   */
  resize?: Resize;

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
   * Area the layout was computed for, before the tiles rise: under the moved tile, or the one of the resized tile
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
 * The same gestures on the edge or corner of a tile resize it instead: its edges follow the pointer,
 * and it takes whole grid tracks when released, one at least, the columns staying inside the grid.
 * Tiles it grows over are pushed down the same way.
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
    this.grid.addEventListener('pointermove', this.onHover, { passive: true });
    this.grid.addEventListener('pointerleave', this.onLeave);
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
    this.grid.removeEventListener('pointermove', this.onHover);
    this.grid.removeEventListener('pointerleave', this.onLeave);
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

    // a press in the gap between two tiles can only resize one of them
    const edge = this.edgeAt(event);
    const tile = edge?.tile ?? this.tileOf(target);
    if (!tile) return;

    const touch = event.pointerType === 'touch';
    this.gesture = {
      pointerId: event.pointerId,
      touch,
      tile,
      edges: edge?.edges,
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
   * Shows the resize cursor while a mouse or pen is over the edge of a tile. Fingers do not hover,
   * and a pressed button may be selecting text.
   */
  private readonly onHover = (event: PointerEvent): void => {
    if (this.gesture || this.drag) return;
    if (event.pointerType === 'touch' || event.buttons !== 0) {
      this.showResizeCursor(undefined);
      return;
    }
    this.showResizeCursor(this.edgeAt(event)?.edges);
  };

  /**
   * Hides the resize cursor when the pointer leaves the grid
   */
  private readonly onLeave = (): void => {
    if (!this.drag) this.showResizeCursor(undefined);
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
   * Picks the pressed tile up, or grabs its edges: pins every tile where it is, then follows the pointer
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
    // measured once the animations are cancelled, and before the tile leaves a sticky position
    const resize = gesture.edges
      ? this.startResize(gesture, gesture.edges, start[index], metrics)
      : undefined;
    tile.classList.add(DRAGGING_CLASS);
    // sticky tiles go back to their grid area, which the pointer offset is computed from; their
    // sticky offsets would shift them as relative offsets
    tile.style.position = 'relative';
    tile.style.inset = 'auto';
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
      resize,
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

    // the whole page shows the cursor of the gesture, instead of the grid over an edge only
    this.showResizeCursor(undefined);
    const root = this.document.documentElement;
    if (resize) {
      root.style.setProperty(
        RESIZE_CURSOR_PROPERTY,
        resizeCursor(resize.edges)
      );
      root.classList.add(ROOT_RESIZING_CLASS);
    } else {
      root.classList.add(ROOT_DRAGGING_CLASS);
    }
    this.document.getSelection()?.removeAllRanges();
  }

  /**
   * Measures where the edges of a tile are grabbed from
   * @param gesture press on the edges
   * @param edges edges pressed
   * @param home area of the tile
   * @param metrics grid tracks
   */
  private startResize(
    gesture: Gesture,
    edges: ResizeEdges,
    home: GridArea,
    metrics: GridMetrics
  ): Resize {
    const gridRect = this.grid.getBoundingClientRect();
    const shown = gesture.tile.getBoundingClientRect();
    return {
      edges,
      originX: gesture.startX - gridRect.left,
      originY: gesture.startY - gridRect.top,
      shiftX: shown.left - gridRect.left - (home.col - 1) * metrics.colStep,
      shiftY: shown.top - gridRect.top - (home.row - 1) * metrics.rowStep,
    };
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
   * Keeps the dragged tile, or its grabbed edges, under the pointer, moves the other tiles to where
   * they would be if it were released now, and outlines where it would land
   * @param drag drag in progress
   * @param gesture press of the dragged tile
   */
  private follow(drag: Drag, gesture: Gesture): void {
    const gridRect = this.grid.getBoundingClientRect();
    const target = drag.resize
      ? this.followResize(drag, drag.resize, gesture, gridRect)
      : this.followMove(drag, gesture, gridRect);

    if (!sameArea(target, drag.target)) {
      drag.target = target;
      const layout = rearrange(drag.start, drag.index, target);
      this.applyArea(drag.placeholder, layout[drag.index]);
      this.applyLayout(drag, layout);
    }
  }

  /**
   * Keeps the moved tile under the pointer
   * @param drag drag in progress
   * @param gesture press of the dragged tile
   * @param gridRect where the grid is displayed
   * @returns the area under the tile
   */
  private followMove(
    drag: Drag,
    gesture: Gesture,
    gridRect: DOMRect
  ): GridArea {
    const { metrics } = drag;
    const home = drag.start[drag.index];
    const x = gesture.x - drag.grabX - gridRect.left;
    const y = gesture.y - drag.grabY - gridRect.top;

    // the scale grows with an ease out, and comes after the move so that it does not stretch the distance moved
    const lift = Math.min(
      (performance.now() - drag.startedAt) / LIFT_DURATION,
      1
    );
    const scale = 1 + (LIFT_SCALE - 1) * (1 - (1 - lift) ** 2);
    drag.tile.style.transform = `translate(${x - (home.col - 1) * metrics.colStep}px, ${y - (home.row - 1) * metrics.rowStep}px) scale(${scale})`;

    return {
      ...home,
      col: Math.min(
        Math.max(Math.round(x / metrics.colStep) + 1, 1),
        Math.max(metrics.columns - home.width + 1, 1)
      ),
      row: Math.max(Math.round(y / metrics.rowStep) + 1, 1),
    };
  }

  /**
   * Keeps the grabbed edges of the resized tile under the pointer, the tile staying at least one
   * track large and its columns inside the grid
   * @param drag drag in progress
   * @param resize resize of the dragged tile
   * @param gesture press of the dragged tile
   * @param gridRect where the grid is displayed
   * @returns the area the tile takes once its edges are on the closest grid lines
   */
  private followResize(
    drag: Drag,
    resize: Resize,
    gesture: Gesture,
    gridRect: DOMRect
  ): GridArea {
    const { metrics, tile } = drag;
    const { edges } = resize;
    const home = drag.start[drag.index];
    const dx = gesture.x - gridRect.left - resize.originX;
    const dy = gesture.y - gridRect.top - resize.originY;

    // sides of the area and smallest tile, in pixels from the top left corner of the grid
    const left = (home.col - 1) * metrics.colStep;
    const top = (home.row - 1) * metrics.rowStep;
    const right = left + home.width * metrics.colStep - metrics.colGap;
    const bottom = top + home.height * metrics.rowStep - metrics.rowGap;
    const minWidth = metrics.colStep - metrics.colGap;
    const minHeight = metrics.rowStep - metrics.rowGap;
    const gridRight = Math.max(
      metrics.columns * metrics.colStep - metrics.colGap,
      right
    );

    const newLeft =
      edges.x < 0 ? Math.min(Math.max(left + dx, 0), right - minWidth) : left;
    const newRight =
      edges.x > 0
        ? Math.min(Math.max(right + dx, left + minWidth), gridRight)
        : right;
    const newTop =
      edges.y < 0 ? Math.min(Math.max(top + dy, 0), bottom - minHeight) : top;
    const newBottom =
      edges.y > 0 ? Math.max(bottom + dy, top + minHeight) : bottom;

    // the tile stays on its area: the translation moves its top left corner, the size its other sides
    tile.style.width = `${newRight - newLeft}px`;
    tile.style.height = `${newBottom - newTop}px`;
    tile.style.transform = `translate(${newLeft - left + resize.shiftX}px, ${newTop - top + resize.shiftY}px)`;

    return resizeArea(
      home,
      edges,
      Math.round(dx / metrics.colStep),
      Math.round(dy / metrics.rowStep),
      metrics.columns
    );
  }

  /**
   * Drops the dragged tile on the area outlined, sliding it there from under the pointer, or brings
   * the edges of the resized tile to its new area
   */
  private endDrag(): void {
    const drag = this.drag;
    if (!drag) return;
    this.drag = undefined;

    cancelAnimationFrame(drag.frame);
    drag.placeholder.remove();
    const root = this.document.documentElement;
    root.classList.remove(ROOT_DRAGGING_CLASS, ROOT_RESIZING_CLASS);
    root.style.removeProperty(RESIZE_CURSOR_PROPERTY);

    const { tile } = drag;
    const from = tile.getBoundingClientRect();
    tile.classList.remove(DRAGGING_CLASS);
    tile.style.removeProperty('transform');
    tile.style.removeProperty('width');
    tile.style.removeProperty('height');
    tile.style.removeProperty('position');
    tile.style.removeProperty('inset');
    tile.style.removeProperty('z-index');

    // a tile removed meanwhile (filters) is left as it is
    if (tile.isConnected) {
      this.applyArea(tile, drag.applied[drag.index]);
      if (drag.resize) {
        this.settle(tile, from);
      } else {
        this.land(tile, from);
      }
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
   * Goes back to the CSS layout: ends a drag, and removes the areas written on the tiles.
   * Pages call it when a tile changes size with its content (the project list), whose new size
   * the written areas would hide.
   */
  public reset(): void {
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
   * Brings the released tile from the size its edges were left at to its area. The size is animated
   * rather than scaled, so that the content does not stretch.
   * @param tile released tile, already on its area
   * @param from where it was displayed, in window coordinates
   */
  private settle(tile: HTMLElement, from: DOMRect): void {
    if (this.reducedMotion.matches) return;

    const to = tile.getBoundingClientRect();
    tile.animate(
      [
        {
          width: `${from.width}px`,
          height: `${from.height}px`,
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`,
        },
        {
          width: `${to.width}px`,
          height: `${to.height}px`,
          transform: 'none',
        },
      ],
      { duration: SLIDE_DURATION, easing: SLIDE_EASING }
    );
  }

  /**
   * Shows the resize cursor over the grid, or hides it
   * @param edges edges under the pointer, undefined when it is not over an edge
   */
  private showResizeCursor(edges: ResizeEdges | undefined): void {
    this.grid.classList.toggle(RESIZE_HOVER_CLASS, edges !== undefined);
    if (edges) {
      this.grid.style.setProperty(RESIZE_CURSOR_PROPERTY, resizeCursor(edges));
    } else {
      this.grid.style.removeProperty(RESIZE_CURSOR_PROPERTY);
    }
  }

  /**
   * Tile whose edge is under the pointer, and the edges a resize would move
   * @param event press or move of the pointer
   * @returns undefined when the pointer is not on the edge of a tile
   */
  private edgeAt(
    event: PointerEvent
  ): { tile: HTMLElement; edges: ResizeEdges } | undefined {
    const target = event.target as Element;
    if (target.closest(IGNORED_TARGETS)) return undefined;

    // over a tile only its own edges are close enough; in a gap, any tile around it may be
    const tile = this.tileOf(target);
    const candidates = tile ? [tile] : target === this.grid ? this.tiles() : [];
    const zone =
      event.pointerType === 'touch' ? TOUCH_EDGE_ZONE : POINTER_EDGE_ZONE;

    for (const candidate of candidates) {
      const edges = edgesAt(
        candidate.getBoundingClientRect(),
        event.clientX,
        event.clientY,
        zone
      );
      if (edges) return { tile: candidate, edges };
    }
    return undefined;
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
