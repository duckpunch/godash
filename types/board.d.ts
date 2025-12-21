/**
 * Board module type definitions
 *
 * NOTE: Manually maintained. See types/index.d.ts for details.
 */

import {
    Set,
    Map,
    List,
    RecordOf,
    RecordFactory,
} from 'immutable';

export type Color = string | null;

export declare const BLACK: Color;
export declare const WHITE: Color;
export declare const EMPTY: Color;

// Board is a Record with these properties
interface BoardProps {
    dimensions: number;
    moves: Map<Coordinate, Color>;
}

export type Board = RecordOf<BoardProps>;
export declare const Board: RecordFactory<BoardProps> & ((dimensions?: number, ...moves: Move[]) => Board);

// Coordinate is a Record with these properties
interface CoordinateProps {
    x: number;
    y: number;
}

export type Coordinate = RecordOf<CoordinateProps>;
export declare const Coordinate: RecordFactory<CoordinateProps> & ((x: number, y: number) => Coordinate);

// Move is a Record with these properties
interface MoveProps {
    coordinate: Coordinate;
    color: Color;
}

export type Move = RecordOf<MoveProps>;
export declare const Move: RecordFactory<MoveProps> & ((coordinate: Coordinate, color: Color) => Move);

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

export declare function toString(board: Board, overrides?: {[color: string]: string} | null): string;

export declare function toA1Coordinate(coordinate: Coordinate): string;

export declare function fromA1Coordinate(raw: string): Coordinate;

export declare function constructBoard(coordinates: Coordinate[], board?: Board | null, startColor?: Color): Board;

export declare function handicapBoard(size: number, handicap: number): Board;
