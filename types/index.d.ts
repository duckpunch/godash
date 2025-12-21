/**
 * TypeScript definitions for godash
 *
 * NOTE: These type definitions are manually maintained.
 * Auto-generation from JSDoc doesn't work well with:
 * - Factory function patterns (Board, Coordinate, Move)
 * - Immutable.js Record types
 *
 * When adding new exports to src/, remember to update these files.
 */

// Export all board types and functions
export {
    BLACK,
    Board,
    Coordinate,
    Move,
    EMPTY,
    WHITE,
    TENGEN_9,
    TENGEN_13,
    TENGEN_19,
    adjacentCoordinates,
    addMove,
    constructBoard,
    difference,
    followupKo,
    fromA1Coordinate,
    group,
    handicapBoard,
    isLegalBlackMove,
    isLegalMove,
    isLegalWhiteMove,
    liberties,
    libertyCount,
    matchingAdjacentCoordinates,
    oppositeColor,
    placeStone,
    placeStones,
    removeStone,
    removeStones,
    toA1Coordinate,
    toAsciiBoard,
    toString,
} from './board';

export type { Color } from './board';

// Export all SGF types and functions
export {
    coordinateToSgfPoint,
    sgfPointToCoordinate,
    sgfToJS,
    compactMoves,
    tokenize,
    nextToken,
    START_MOVE,
    START,
    END,
} from './sgf';
