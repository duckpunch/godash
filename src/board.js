import {Map} from 'immutable';

import {isPositiveInteger} from './utils';
import {
    SIZE_KEY, allPossibleMoves, group, liberties, isLegalMove,
} from './analysis';
import {
    emptyBoard, addBlackMove, addWhiteMove, addMove, removeMoves,
} from './transforms';


function isValidBoardMap(board) {
    return Map.isMap(board) && isPositiveInteger(board.get(SIZE_KEY, 0));
}


/**
 * Represents a board state.
 * @example
 * Board(19);
 */
export class Board {
    /**
     * @param {Map} board_data argument specifying either the backing Map or the size
     * @throws {TypeError} when board_data is neither a proper board Map or a positive integer
     */
    constructor(board_data) {
        if (isValidBoardMap(board_data)) {
            this._data = board_data;
        } else if (isPositiveInteger(board_data)) {
            this._data = emptyBoard(board_data);
        } else {
            throw TypeError('Instantiate a Board with a Map or a positive integer');
        }
    }

    /**
     * Underlying data structure for the Board.
     *
     * @returns {Map}
     */
    get data() {
        return this._data;
    }

    /**
     * Positive integer representing the size of the board.
     *
     * @returns {number}
     */
    get board_size() {
        return this.data.get(SIZE_KEY);
    }

    /**
     * Adds a black move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @throws {string} when the move is not valid
     * @returns {Board}
     */
    addBlackMove(position) {
        return new Board(addBlackMove(this.data, position));
    }

    /**
     * Adds a white move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @throws {string} when the move is not valid
     * @returns {Board}
     */
    addWhiteMove(position) {
        return new Board(addWhiteMove(this.data, position));
    }

    /**
     * Adds a move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @param {string} color
     * @throws {string} when the move is not valid
     * @returns {Board}
     */
    addMove(position, color) {
        return new Board(addMove(this.data, position, color));
    }

    /**
     * Removes positions.  Positions that are not on the board are ignored.
     *
     * @param {Set} positions
     * @returns {Board}
     */
    removeMoves(positions) {
        return new Board(removeMoves(this.data, positions));
    }

    /**
     * A set of all possible moves on the board, even the occupied ones.
     *
     * @returns {Set} contains Lists (2-tuples)
     */
    allPossibleMoves() {
        return allPossibleMoves(this.board_size);
    }

    /**
     * Gets a set of positions of the logical group associated with the given position.
     *
     * @param {List} position
     * @returns {Set}
     */
    group(position) {
        return group(this.data, position);
    }

    /**
     * Check if a move is legal for black
     *
     * @param {List} position
     * @returns {boolean}
     */
    isLegalBlackMove(position) {
        return isLegalMove(this.data, position, BLACK);
    }

    /**
     * Check if a move is legal for white
     *
     * @param {List} position
     * @returns {boolean}
     */
    isLegalWhiteMove(position) {
        return isLegalMove(this.data, position, WHITE);
    }

    /**
     * Counts liberties for the stone at the given position.
     *
     * @param {List} position
     * @returns {number}
     */
    liberties(position) {
        return liberties(this.data, position);
    }
}
