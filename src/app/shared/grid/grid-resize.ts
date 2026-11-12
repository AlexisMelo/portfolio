import { GridArea } from './grid-layout';

/**
 * Edges of a tile a resize moves, one per axis at most: two for a corner
 */
export interface ResizeEdges {
  /**
   * Left edge (-1), right edge (1) or neither (0)
   */
  x: -1 | 0 | 1;

  /**
   * Top edge (-1), bottom edge (1) or neither (0)
   */
  y: -1 | 0 | 1;
}

/**
 * Bands along the edges of a tile where a press resizes it instead of moving it, in pixels
 */
export interface EdgeZone {
  /**
   * Width of the band inside the tile
   */
  inside: number;

  /**
   * Width of the band outside the tile, in the gap between two tiles
   */
  outside: number;

  /**
   * Distance from a corner, along the edges, within which the corner is resized instead of a single edge
   */
  corner: number;
}

/**
 * Sides of a rectangle, in pixels
 */
export type Box = Pick<DOMRectReadOnly, 'left' | 'top' | 'right' | 'bottom'>;

/**
 * Edges of a tile a point is on
 * @param box where the tile is displayed
 * @param x horizontal position of the point, in the same coordinates as box
 * @param y vertical position of the point, in the same coordinates as box
 * @param zone bands along the edges
 * @returns the edges the point is on, or undefined when it is outside the bands
 */
export function edgesAt(
  box: Box,
  x: number,
  y: number,
  zone: EdgeZone
): ResizeEdges | undefined {
  if (
    x < box.left - zone.outside ||
    x > box.right + zone.outside ||
    y < box.top - zone.outside ||
    y > box.bottom + zone.outside
  ) {
    return undefined;
  }

  const edgeX = edgeOnAxis(x, box.left, box.right, zone.inside);
  const edgeY = edgeOnAxis(y, box.top, box.bottom, zone.inside);
  if (edgeX === 0 && edgeY === 0) return undefined;

  // near a corner, the other edge is caught from further away, which makes corners easier to grab
  return {
    x: edgeX || edgeOnAxis(x, box.left, box.right, zone.corner),
    y: edgeY || edgeOnAxis(y, box.top, box.bottom, zone.corner),
  };
}

/**
 * Edge of a tile a position is close to on one axis
 * @param position position of the point
 * @param start start of the tile (left or top)
 * @param end end of the tile (right or bottom)
 * @param distance distance from an edge, inside the tile, within which the point is on it
 * @returns -1 for the start edge, 1 for the end edge, 0 for neither. The closer edge wins on a small tile.
 */
function edgeOnAxis(
  position: number,
  start: number,
  end: number,
  distance: number
): -1 | 0 | 1 {
  const fromStart = position - start;
  const fromEnd = end - position;
  if (fromStart <= distance && fromStart <= fromEnd) return -1;
  if (fromEnd <= distance) return 1;
  return 0;
}

/**
 * Moves edges of an area by whole tracks. The opposite edges stay in place, the area keeps at least
 * one track on each axis, and its columns stay inside the grid.
 * @param area area before the resize
 * @param edges edges moved
 * @param cols number of columns the horizontal edge moves by, positive to the right
 * @param rows number of rows the vertical edge moves by, positive downwards
 * @param columns number of columns of the grid
 * @returns the resized area
 */
export function resizeArea(
  area: GridArea,
  edges: ResizeEdges,
  cols: number,
  rows: number,
  columns: number
): GridArea {
  // grid lines, the ends being the lines after the last tracks
  let colStart = area.col;
  let colEnd = area.col + area.width;
  let rowStart = area.row;
  let rowEnd = area.row + area.height;

  if (edges.x < 0) colStart = clamp(colStart + cols, 1, colEnd - 1);
  if (edges.x > 0) {
    colEnd = clamp(
      colEnd + cols,
      colStart + 1,
      Math.max(columns + 1, colStart + 1)
    );
  }
  if (edges.y < 0) rowStart = clamp(rowStart + rows, 1, rowEnd - 1);
  if (edges.y > 0) rowEnd = Math.max(rowEnd + rows, rowStart + 1);

  return {
    col: colStart,
    row: rowStart,
    width: colEnd - colStart,
    height: rowEnd - rowStart,
  };
}

/**
 * CSS cursor showing which edges a resize moves
 */
export function resizeCursor(edges: ResizeEdges): string {
  if (edges.x !== 0 && edges.y !== 0) {
    return edges.x === edges.y ? 'nwse-resize' : 'nesw-resize';
  }
  return edges.x !== 0 ? 'ew-resize' : 'ns-resize';
}

/**
 * Keeps a value between two bounds
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
