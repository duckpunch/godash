import {
    BLACK,
    Board,
    Coordinate,
    Move,
    EMPTY,
    WHITE,
    TENGEN_9,
    TENGEN_13,
    TENGEN_19,
    addMove,
    constructBoard,
    difference,
    followupKo,
    group,
    handicapBoard,
    isLegalMove,
    liberties,
    libertyCount,
    oppositeColor,
    placeStone,
    placeStones,
    removeStone,
    removeStones,
    toAsciiBoard,
} from './board';

import {
    coordinateToSgfPoint,
    sgfPointToCoordinate,
    sgfToJS,
} from './sgf';

declare const godash: {
    BLACK: typeof BLACK;
    WHITE: typeof WHITE;
    EMPTY: typeof EMPTY;
    Board: typeof Board;
    Coordinate: typeof Coordinate;
    Move: typeof Move;
    TENGEN_13: typeof TENGEN_13;
    TENGEN_19: typeof TENGEN_19;
    TENGEN_9: typeof TENGEN_9;
    difference: typeof difference;
    followupKo: typeof followupKo;
    group: typeof group;
    oppositeColor: typeof oppositeColor;
    liberties: typeof liberties;
    libertyCount: typeof libertyCount;
    isLegalMove: typeof isLegalMove;
    removeStone: typeof removeStone;
    removeStones: typeof removeStones;
    addMove: typeof addMove;
    placeStone: typeof placeStone;
    placeStones: typeof placeStones;
    toAsciiBoard: typeof toAsciiBoard;
    constructBoard: typeof constructBoard;
    handicapBoard: typeof handicapBoard;
    coordinateToSgfPoint: typeof coordinateToSgfPoint;
    sgfPointToCoordinate: typeof sgfPointToCoordinate;
    sgfToJS: typeof sgfToJS;
};

export = godash;
