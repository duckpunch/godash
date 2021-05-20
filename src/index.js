import board from './board';
import sgf from './sgf';

export const BLACK = board.BLACK;
export const Board = board.Board;
export const Coordinate = board.Coordinate;
export const EMPTY = board.EMPTY;
export const TENGEN_13 = board.TENGEN_13;
export const TENGEN_19 = board.TENGEN_19;
export const TENGEN_9 = board.TENGEN_9;
export const WHITE = board.WHITE;
export const addMove = board.addMove;
export const constructBoard = board.constructBoard;
export const coordinateToSgfPoint = sgf.coordinateToSgfPoint;
export const difference = board.difference;
export const followupKo = board.followupKo;
export const group = board.group;
export const handicapBoard = board.handicapBoard;
export const isLegalMove = board.isLegalMove;
export const liberties = board.liberties;
export const libertyCount = board.libertyCount;
export const oppositeColor = board.oppositeColor;
export const placeStone = board.placeStone;
export const placeStones = board.placeStones;
export const removeStone = board.removeStone;
export const removeStones = board.removeStones;
export const sgfPointToCoordinate = sgf.sgfPointToCoordinate;
export const sgfToJS = sgf.sgfToJS;
export const toAsciiBoard = board.toAsciiBoard;

export default {
    BLACK,
    Board,
    Coordinate,
    EMPTY,
    TENGEN_13,
    TENGEN_19,
    TENGEN_9,
    WHITE,
    addMove,
    constructBoard,
    coordinateToSgfPoint,
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
    sgfPointToCoordinate,
    sgfToJS,
    toAsciiBoard,
};
