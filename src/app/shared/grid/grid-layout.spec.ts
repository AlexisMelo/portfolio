import {
  areasOverlap,
  compactUp,
  GridArea,
  moveArea,
  rearrange,
} from './grid-layout';

/**
 * Builds an area
 */
function area(col: number, row: number, width = 1, height = 1): GridArea {
  return { col, row, width, height };
}

describe('grid layout', () => {
  describe('areasOverlap', () => {
    it('detects areas sharing a cell', () => {
      expect(areasOverlap(area(1, 1, 2, 2), area(2, 2))).toBeTrue();
    });

    it('treats touching areas as apart', () => {
      expect(areasOverlap(area(1, 1, 2, 1), area(3, 1))).toBeFalse();
      expect(areasOverlap(area(1, 1, 1, 2), area(1, 3))).toBeFalse();
    });
  });

  describe('moveArea', () => {
    it('moves a tile to free cells without touching the others', () => {
      const areas = [area(1, 1), area(2, 1)];

      expect(moveArea(areas, 0, area(3, 2))).toEqual([area(3, 2), area(2, 1)]);
    });

    it('pushes a tile it lands on just below it', () => {
      const areas = [area(1, 1, 2, 2), area(3, 1)];

      expect(moveArea(areas, 0, area(2, 1, 2, 2))).toEqual([
        area(2, 1, 2, 2),
        area(3, 3),
      ]);
    });

    it('pushes the tiles below in a cascade', () => {
      const areas = [area(1, 5, 4, 1), area(1, 1, 2, 1), area(1, 2, 4, 2)];

      const result = moveArea(areas, 0, area(1, 1, 4, 1));

      expect(result[1]).toEqual(area(1, 2, 2, 1));
      expect(result[2]).toEqual(area(1, 3, 4, 2));
    });

    it('keeps the empty cells the moved tile leaves', () => {
      const areas = [area(1, 1, 2, 2), area(3, 1, 2, 1)];

      expect(moveArea(areas, 0, area(1, 4, 2, 2))).toEqual([
        area(1, 4, 2, 2),
        area(3, 1, 2, 1),
      ]);
    });

    it('never pushes the moved tile, and leaves no overlap with it', () => {
      const areas = [area(2, 3, 2, 2), area(1, 1, 4, 3), area(1, 4, 1, 1)];

      const result = moveArea(areas, 0, area(2, 2, 2, 2));

      expect(result[0]).toEqual(area(2, 2, 2, 2));
      result
        .slice(1)
        .forEach(other => expect(areasOverlap(other, result[0])).toBeFalse());
    });

    it('puts a tile it lands on just above it when that space is free', () => {
      const areas = [area(1, 1), area(1, 2)];

      expect(moveArea(areas, 0, area(1, 2))).toEqual([area(1, 2), area(1, 1)]);
    });

    it('does not change the areas it is given', () => {
      const areas = [area(1, 1), area(1, 2)];

      moveArea(areas, 0, area(1, 2));

      expect(areas).toEqual([area(1, 1), area(1, 2)]);
    });
  });

  describe('compactUp', () => {
    it('makes tiles rise into the empty rows above them', () => {
      const areas = [area(1, 1, 2, 1), area(2, 4), area(1, 6, 2, 2)];

      expect(compactUp(areas)).toEqual([
        area(1, 1, 2, 1),
        area(2, 2),
        area(1, 3, 2, 2),
      ]);
    });

    it('keeps a wide tile under a small tile above one of its columns', () => {
      const areas = [area(1, 1), area(1, 2, 2, 2)];

      expect(compactUp(areas)).toEqual(areas);
    });

    it('lets a tile rise past the column of a tile beside it', () => {
      const areas = [area(1, 1), area(2, 3)];

      expect(compactUp(areas)).toEqual([area(1, 1), area(2, 1)]);
    });

    it('moves overlapping tiles below each other', () => {
      const areas = [area(1, 1, 1, 2), area(1, 2)];

      expect(compactUp(areas)).toEqual([area(1, 1, 1, 2), area(1, 3)]);
    });
  });

  describe('rearrange', () => {
    // 2 columns: a 1x1 tile above a 2x2 tile, which cannot rise past it
    const smallAboveWide = [area(1, 1), area(1, 2, 2, 2)];

    it('lets the wide tile rise once the small tile is dropped below it', () => {
      expect(rearrange(smallAboveWide, 0, area(1, 5))).toEqual([
        area(1, 3),
        area(1, 1, 2, 2),
      ]);
    });

    it('swaps the tiles when the small one is dropped on the wide one', () => {
      expect(rearrange(smallAboveWide, 0, area(2, 3))).toEqual([
        area(2, 3),
        area(1, 1, 2, 2),
      ]);
    });

    it('leaves no empty row above a tile', () => {
      const areas = [area(1, 1, 2, 1), area(1, 2), area(2, 2)];

      const result = rearrange(areas, 0, area(1, 6, 2, 1));

      expect(result).toEqual([area(1, 2, 2, 1), area(1, 1), area(2, 1)]);
    });
  });
});
