/**
 * Area of a tile in a grid, in tracks counted from 1 like the CSS grid lines
 */
export interface GridArea {
  /**
   * First column
   */
  col: number;

  /**
   * First row
   */
  row: number;

  /**
   * Number of columns
   */
  width: number;

  /**
   * Number of rows
   */
  height: number;
}

/**
 * Most moves made while settling a layout, a guard against an endless cascade
 */
const MAX_MOVES = 10_000;

/**
 * Whether two areas share at least one cell
 */
export function areasOverlap(a: GridArea, b: GridArea): boolean {
  return (
    a.col < b.col + b.width &&
    b.col < a.col + a.width &&
    a.row < b.row + b.height &&
    b.row < a.row + a.height
  );
}

/**
 * Whether two areas are the same
 */
export function sameArea(a: GridArea, b: GridArea): boolean {
  return (
    a.col === b.col &&
    a.row === b.row &&
    a.width === b.width &&
    a.height === b.height
  );
}

/**
 * Puts a tile on a new area. Each tile it lands on goes just above it when that space is free, which
 * swaps the two tiles, otherwise just below it. Tiles pushed below push the tiles they land on below
 * them in turn. The cells left empty stay empty: compactUp fills them.
 * @param areas area of every tile before the move
 * @param moved index of the moved tile in areas
 * @param target new area of the moved tile
 * @returns the new area of every tile, in the same order as areas
 */
export function moveArea(
  areas: readonly GridArea[],
  moved: number,
  target: GridArea
): GridArea[] {
  const result = areas.map(area => ({ ...area }));
  result[moved] = { ...target };

  result.forEach((area, index) => {
    if (index === moved || !areasOverlap(area, target)) return;

    const above = { ...area, row: target.row - area.height };
    const aboveIsFree =
      above.row >= 1 &&
      result.every(
        (other, otherIndex) =>
          otherIndex === index || !areasOverlap(other, above)
      );
    if (aboveIsFree) area.row = above.row;
  });

  const queue = [moved];
  let moves = 0;

  while (queue.length > 0 && moves < MAX_MOVES) {
    const pusher = result[queue.shift()!];

    // top to bottom, then left to right, so the pushed tiles keep their order
    const pushed = result
      .map((area, index) => ({ area, index }))
      .filter(
        ({ area, index }) =>
          index !== moved && area !== pusher && areasOverlap(area, pusher)
      )
      .sort((a, b) => a.area.row - b.area.row || a.area.col - b.area.col);

    for (const { area, index } of pushed) {
      area.row = pusher.row + pusher.height;
      queue.push(index);
      moves++;
    }
  }

  return result;
}

/**
 * Makes every tile rise as far as it can, top to bottom then left to right. A tile stops under the
 * first tile above it that shares one of its columns, so a wide tile stays under a small one.
 * Tiles that overlap are moved below each other.
 * @param areas area of every tile
 * @returns the new area of every tile, in the same order as areas
 */
export function compactUp(areas: readonly GridArea[]): GridArea[] {
  const result = areas.map(area => ({ ...area }));
  const order = result
    .map((_, index) => index)
    .sort(
      (a, b) => result[a].row - result[b].row || result[a].col - result[b].col
    );
  const placed: GridArea[] = [];

  for (const index of order) {
    const area = result[index];
    while (
      area.row > 1 &&
      !placed.some(other => areasOverlap(other, { ...area, row: area.row - 1 }))
    ) {
      area.row--;
    }

    let collision = placed.find(other => areasOverlap(other, area));
    while (collision) {
      area.row = collision.row + collision.height;
      collision = placed.find(other => areasOverlap(other, area));
    }
    placed.push(area);
  }

  return result;
}

/**
 * Moves a tile to a new area, then makes every tile rise as far as it can, the moved one included
 * @param areas area of every tile before the move
 * @param moved index of the moved tile in areas
 * @param target area the moved tile is dropped on
 * @returns the new area of every tile, in the same order as areas
 */
export function rearrange(
  areas: readonly GridArea[],
  moved: number,
  target: GridArea
): GridArea[] {
  return compactUp(moveArea(areas, moved, target));
}
