declare module 'godash' {
  import { Set, Map, List, Record, Iterable } from 'immutable';
  // yarn add @types/lodash

  type Color = string | null;
  class Coordinate extends Record({ x: 0, y: 0 }, 'Coordinate') {
    constructor(x: number, y: number);
  }
  class Board extends Record(
    { dimensions: 19, moves: Map<Coordinate, Color>() },
    'Board'
  ) {
    constructor(dimensions: number, ...moves: (Coordinate | Color)[]);
  }
  type JSr = { [key: string]: string } | JSr[];
  type JS = JSr[];
  // type Token = string | [string, string];

  const godash: {
    default: {
      // board.js
      BLACK: Color;
      WHITE: Color;
      EMPTY: Color;
      Board: typeof Board;
      Coordinate: typeof Coordinate;
      TENGEN_13: Coordinate;
      TENGEN_19: Coordinate;
      TENGEN_9: Coordinate;
      // adjacentCoordinates: (
      //   board: Board,
      //   coordinate: Coordinate
      // ) => Set<Coordinate>;
      difference: (
        board1: Board,
        board2: Board
      ) => Set<List<Coordinate | Color>>;
      followupKo: (
        board: Board,
        coordinate: Coordinate,
        color: Color
      ) => Coordinate | null;
      // matchingAdjacentCoordinates: (
      //   board: Board,
      //   coordinate: Coordinate,
      //   color: Color
      // ) => Set<Coordinate>;
      group: (board: Board, coordinate: Coordinate) => Set<Coordinate>;
      oppositeColor: (color: Color) => Color;
      liberties: (board: Board, coordinate: Coordinate) => Set<Coordinate>;
      libertyCount: (board: Board, coordinate: Coordinate) => number;
      isLegalMove: (
        board: Board,
        coordinate: Coordinate,
        color: Color
      ) => boolean;
      // isLegalBlackMove: (board: Board, coordinate: Coordinate) => boolean;
      // isLegalWhiteMove: (board: Board, coordinate: Coordinate) => boolean;
      removeStone: (board: Board, coordinate: Coordinate) => Board;
      removeStones: (board: Board, coordinates: Coordinate[]) => Board;
      addMove: (board: Board, coordinate: Coordinate, color: Color) => Board;
      placeStone: (
        board: Board,
        coordinate: Coordinate,
        color: Color,
        force?: boolean
      ) => Board;
      placeStones: (
        board: Board,
        coordinates: Coordinate[],
        color: Color,
        force?: boolean
      ) => Board;
      toAsciiBoard: (board: Board) => string;
      constructBoard: (
        coordinates: Coordinate[],
        board?: Board,
        startColor?: Color
      ) => Board;
      handicapBoard: (size: number, handicap: number) => Board;
      // sgf.js
      // START_MOVE: string;
      // START: string;
      // END: string;
      coordinateToSgfPoint: (coordinate: Coordinate) => string;
      sgfPointToCoordinate: (sgfPoint: string) => Coordinate;
      sgfToJS: (sgf: string) => JS;
      // compactMoves: (tokens: Token[]) => (Token | { [key: string]: string })[];
      // tokenize: (rawSgf: string) => Token[];
      // nextToken: (partialSgf: string) => [Token, string];
    };
  };
  export = godash.default;
}
