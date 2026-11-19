import { GridArea } from './grid-layout';
import {
  Box,
  EdgeZone,
  edgesAt,
  resizeArea,
  resizeCursor,
} from './grid-resize';

/**
 * Builds an area
 */
function area(col: number, row: number, width = 1, height = 1): GridArea {
  return { col, row, width, height };
}

describe('grid resize', () => {
  describe('edgesAt', () => {
    // a 100 by 100 tile, with bands of 8 pixels inside, 6 outside and 20 along the edges near a corner
    const box: Box = { left: 100, top: 100, right: 200, bottom: 200 };
    const zone: EdgeZone = { inside: 8, outside: 6, corner: 20 };

    it('finds each edge, inside and outside the tile', () => {
      expect(edgesAt(box, 104, 150, zone)).toEqual({ x: -1, y: 0 });
      expect(edgesAt(box, 205, 150, zone)).toEqual({ x: 1, y: 0 });
      expect(edgesAt(box, 150, 96, zone)).toEqual({ x: 0, y: -1 });
      expect(edgesAt(box, 150, 193, zone)).toEqual({ x: 0, y: 1 });
    });

    it('finds nothing in the middle of the tile or past the bands', () => {
      expect(edgesAt(box, 150, 150, zone)).toBeUndefined();
      expect(edgesAt(box, 109, 150, zone)).toBeUndefined();
      expect(edgesAt(box, 93, 150, zone)).toBeUndefined();
      expect(edgesAt(box, 150, 207, zone)).toBeUndefined();
    });

    it('catches a corner from further along the edges', () => {
      expect(edgesAt(box, 196, 185, zone)).toEqual({ x: 1, y: 1 });
      expect(edgesAt(box, 115, 197, zone)).toEqual({ x: -1, y: 1 });
      expect(edgesAt(box, 196, 175, zone)).toEqual({ x: 1, y: 0 });
    });

    it('picks the closer edge on a tile smaller than both bands', () => {
      const small: Box = { left: 0, top: 0, right: 10, bottom: 10 };

      expect(edgesAt(small, 3, 5, zone)?.x).toBe(-1);
      expect(edgesAt(small, 7, 5, zone)?.x).toBe(1);
    });
  });

  describe('resizeArea', () => {
    it('moves the right and bottom edges', () => {
      expect(resizeArea(area(2, 2, 2, 2), { x: 1, y: 1 }, 1, 2, 12)).toEqual(
        area(2, 2, 3, 4)
      );
    });

    it('moves the left and top edges, keeping the opposite ones', () => {
      expect(resizeArea(area(3, 3, 2, 2), { x: -1, y: -1 }, -1, 1, 12)).toEqual(
        area(2, 4, 3, 1)
      );
    });

    it('leaves the axis without a moved edge untouched', () => {
      expect(resizeArea(area(2, 2, 2, 2), { x: 1, y: 0 }, 1, 5, 12)).toEqual(
        area(2, 2, 3, 2)
      );
    });

    it('keeps at least one track on each axis', () => {
      expect(resizeArea(area(2, 2, 3, 3), { x: 1, y: 1 }, -5, -5, 12)).toEqual(
        area(2, 2, 1, 1)
      );
      expect(resizeArea(area(2, 2, 3, 3), { x: -1, y: -1 }, 5, 5, 12)).toEqual(
        area(4, 4, 1, 1)
      );
    });

    it('keeps the columns inside the grid and the rows below the first one', () => {
      expect(resizeArea(area(3, 2, 1, 1), { x: 1, y: 0 }, 5, 0, 4)).toEqual(
        area(3, 2, 2, 1)
      );
      expect(resizeArea(area(2, 2, 1, 1), { x: -1, y: -1 }, -5, -5, 4)).toEqual(
        area(1, 1, 2, 2)
      );
    });

    it('lets the bottom edge go down freely', () => {
      expect(resizeArea(area(1, 1, 1, 1), { x: 0, y: 1 }, 0, 20, 4)).toEqual(
        area(1, 1, 1, 21)
      );
    });
  });

  describe('resizeCursor', () => {
    it('matches the moved edges', () => {
      expect(resizeCursor({ x: 1, y: 0 })).toBe('ew-resize');
      expect(resizeCursor({ x: 0, y: -1 })).toBe('ns-resize');
      expect(resizeCursor({ x: 1, y: 1 })).toBe('nwse-resize');
      expect(resizeCursor({ x: -1, y: -1 })).toBe('nwse-resize');
      expect(resizeCursor({ x: 1, y: -1 })).toBe('nesw-resize');
    });
  });
});
