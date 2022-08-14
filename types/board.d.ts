import {
    Set,
    Map,
    List,
    Record,
} from 'immutable';

type Color = string | null;

export declare const BLACK: Color;
export declare const WHITE: Color;
export declare const EMPTY: Color;

export declare class Board extends Record({dimensions: 19, moves: Map<Coordinate, Color>()}, 'Board') {
    constructor(dimensions: number, ...moves: Move[]);
}

export declare class Coordinate extends Record({x: 0, y: 0}, 'Coordinate') {
    constructor(x: number, y: number);
}

export declare class Move extends Record({coordinate: Coordinate(), color: EMPTY}, 'Move') {
    constructor(coordinate: Coordinate, color: Color);
}

export declare const TENGEN_13: Coordinate;
export declare const TENGEN_19: Coordinate;
export declare const TENGEN_9: Coordinate;

export declare function adjacentCoordinates(board: Board, coordinate: Coordinate): Set<Coordinate>;

export declare function difference(board1: Board, board2: Board): Set<List<Coordinate | Color>>;

export declare function followupKo(board: Board, move: Move): Coordinate | null;

export declare function matchingAdjacentCoordinates(board: Board, coordinate: Coordinate, color: Color): Set<Coordinate>;

export declare function group(board: Board, coordinate: Coordinate): Set<Coordinate>;

export declare function oppositeColor(color: Color): Color;

export declare function liberties(board: Board, coordinate: Coordinate): Set<Coordinate>;

export declare function libertyCount(board: Board, coordinate: Coordinate): number;

export declare function isLegalMove(board: Board, move: Move): boolean;

export declare function isLegalBlackMove(board: Board, coordinate: Coordinate): boolean;

export declare function isLegalWhiteMove(board: Board, coordinate: Coordinate): boolean;

export declare function removeStone(board: Board, coordinate: Coordinate): Board;

export declare function removeStones(board: Board, coordinates: Coordinate[]): Board;

export declare function addMove(board: Board, move: Move): Board;

export declare function placeStone(board: Board, coordinate: Coordinate, color: Color, force?: boolean): Board;

export declare function placeStones(board: Board, coordinates: Coordinate[], color: Color, force?: boolean): Board;

export declare function toAsciiBoard(board: Board): string;

export declare function constructBoard(coordinates: Coordinate[], board?: Board, startColor?: Color): Board;

export declare function handicapBoard(size: number, handicap: number): Board;
