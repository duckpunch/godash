/**
 * Type testing for godash
 *
 * This file verifies that TypeScript definitions match the actual API.
 * It's compiled with `tsc --noEmit` to catch type errors.
 *
 * Run: npm run test:types
 */

import {
    Board,
    Coordinate,
    Move,
    BLACK,
    WHITE,
    EMPTY,
    TENGEN_9,
    TENGEN_13,
    TENGEN_19,
    placeStone,
    placeStones,
    addMove,
    removeStone,
    removeStones,
    toAsciiBoard,
    toString,
    toA1Coordinate,
    fromA1Coordinate,
    adjacentCoordinates,
    matchingAdjacentCoordinates,
    difference,
    followupKo,
    group,
    oppositeColor,
    liberties,
    libertyCount,
    isLegalMove,
    isLegalBlackMove,
    isLegalWhiteMove,
    constructBoard,
    handicapBoard,
    coordinateToSgfPoint,
    sgfPointToCoordinate,
    sgfToJS,
    compactMoves,
    tokenize,
    nextToken,
    START_MOVE,
    START,
    END,
    Color,
} from '../types/index';

// Test factory functions are callable without 'new'
const board: Board = Board();
const board19: Board = Board(19);
const coord: Coordinate = Coordinate(9, 9);
const move: Move = Move(coord, BLACK);

// Test constants
const color1: Color = BLACK;
const color2: Color = WHITE;
const color3: Color = EMPTY;
const c1: Coordinate = TENGEN_9;
const c2: Coordinate = TENGEN_13;
const c3: Coordinate = TENGEN_19;

// Test property access (Record types)
const x: number = coord.x;
const y: number = coord.y;
const dims: number = board.dimensions;
const moveCoord: Coordinate = move.coordinate;
const moveColor: Color = move.color;

// Test board manipulation functions
const newBoard1: Board = placeStone(board, coord, BLACK);
const newBoard2: Board = placeStone(board, coord, BLACK, true);
const newBoard3: Board = placeStones(board, [coord], WHITE);
const newBoard4: Board = placeStones(board, [coord], WHITE, false);
const newBoard5: Board = addMove(board, move);
const newBoard6: Board = removeStone(board, coord);
const newBoard7: Board = removeStones(board, [coord]);

// Test board query functions
const ascii: string = toAsciiBoard(board);
const str1: string = toString(board);
const str2: string = toString(board, { black: 'X' });
const str3: string = toString(board, null);
const a1: string = toA1Coordinate(coord);
const fromA1: Coordinate = fromA1Coordinate('K10');

// Test Set-returning functions
const adjacent = adjacentCoordinates(board, coord);
const matching = matchingAdjacentCoordinates(board, coord, BLACK);
const diff = difference(board, newBoard1);
const grp = group(board, coord);
const libs = liberties(board, coord);

// Test other functions
const ko: Coordinate | null = followupKo(board, move);
const opposite: Color = oppositeColor(BLACK);
const libCount: number = libertyCount(board, coord);
const legal1: boolean = isLegalMove(board, move);
const legal2: boolean = isLegalBlackMove(board, coord);
const legal3: boolean = isLegalWhiteMove(board, coord);
const constructed: Board = constructBoard([coord]);
const constructed2: Board = constructBoard([coord], board);
const constructed3: Board = constructBoard([coord], board, WHITE);
const constructed4: Board = constructBoard([coord], null, BLACK);
const handicap: Board = handicapBoard(19, 4);

// Test SGF functions
const sgfPoint: string = coordinateToSgfPoint(coord);
const coordFromSgf: Coordinate = sgfPointToCoordinate('aa');
const js = sgfToJS('(;FF[4]CA[UTF-8]SZ[19])');
const compact = compactMoves([['B', 'aa']]);
const tokens = tokenize('(;B[aa])');
const [token, remaining] = nextToken('B[aa]');

// Test SGF constants
const sm: string = START_MOVE;
const s: string = START;
const e: string = END;

// Type assertions to verify inference
type AssertBoard = typeof board extends Board ? true : never;
type AssertCoordinate = typeof coord extends Coordinate ? true : never;
type AssertMove = typeof move extends Move ? true : never;

// These should compile without errors
const _assertBoard: AssertBoard = true;
const _assertCoord: AssertCoordinate = true;
const _assertMove: AssertMove = true;

// Verify Record methods work (from Immutable.js)
const withDims = board.set('dimensions', 13);
const getDims = board.get('dimensions');
const updatedBoard = board.update('dimensions', d => d + 1);
