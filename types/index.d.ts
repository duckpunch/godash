import { coordinateToSgfPoint, sgfPointToCoordinate, sgfToJS } from '../src/sgf';

import {
  BLACK,
  Board,
  Coordinate,
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
} from '../src/board';

const godash: {
  default: {
    BLACK: Color;
    WHITE: Color;
    EMPTY: Color;
    Board: typeof Board;
    Coordinate: typeof Coordinate;
    TENGEN_13: Coordinate;
    TENGEN_19: Coordinate;
    TENGEN_9: Coordinate;
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
};

export = godash.default;
