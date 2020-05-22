import { Coordinate } from '../src/board'

type JSr = { [key: string]: string } | JSr[];
type JS = JSr[];
type Token = string | [string, string];

export declare const START_MOVE: string;
export declare const START: string;
export declare const END: string;

export declare function coordinateToSgfPoint(coordinate: Coordinate): string;

export declare function sgfPointToCoordinate(sgfPoint: string): Coordinate;

export declare function sgfToJS(sgf: string): JS;

export declare function compactMoves(
  tokens: Token[]
): (Token | { [key: string]: string })[];

export declare function tokenize(rawSgf: string): Token[];

export declare function nextToken(partialSgf: string): [Token, string];
