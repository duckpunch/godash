import {Map, List} from 'immutable';
import {MapSchema, FixedListSchema, OneOf, Exactly} from 'immutable-schema';

import {isPositiveInteger} from './utils';
import {
    SIZE_KEY, allPossibleMoves, group, liberties, isLegalMove,
    BLACK, WHITE, EMPTY, prettyString,
} from './analysis';
import {
    emptyBoard, addBlackMove, addWhiteMove, addMove, removeMoves,
} from './transforms';


const isValidBoardMap = MapSchema(
    FixedListSchema(isNumber, isNumber), OneOf(BLACK, WHITE),
    Exactly(SIZE_KEY), isPositiveInteger
);


/**
 * Represents a board state.
 * @example
 * var Immutable = require('immutable');
 *
 * var board1 = Board(19);
 * var board2_data = Immutable.Map().set('size', 19);
 * var board2 = Board(board2_data);
 *
 * assert(board1.equals(board2));
 */
export class Board {
    /**
     * @param {Map} board_data argument specifying either the backing Map or the size
     * @throws {TypeError} when board_data is neither a proper board Map or a positive integer
     */
    constructor(board_data) {
        if (isValidBoardMap(board_data)) {
            this._positions = board_data;
        } else if (isPositiveInteger(board_data)) {
            this._positions = emptyBoard(board_data);
        } else {
            throw TypeError('Instantiate a Board with a Map or a positive integer');
        }
    }

    /**
     * Immutable data structure holding the positions in a {@link Map}.
     *
     * @returns {Map}
     */
    get positions() {
        return this._positions;
    }

    /**
     * Positive integer representing the size of the board.
     *
     * @returns {number}
     */
    get board_size() {
        return this.positions.get(SIZE_KEY);
    }

    /**
     * Adds a black move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @throws {string} when the move is not valid
     * @returns {Board}
     * @see {@link addMove}
     */
    addBlackMove(position) {
        return new Board(addBlackMove(this.positions, position));
    }

    /**
     * Adds a white move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @throws {string} when the move is not valid
     * @returns {Board}
     * @see {@link addMove}
     */
    addWhiteMove(position) {
        return new Board(addWhiteMove(this.positions, position));
    }

    /**
     * Adds a move at the specified position.  Follows the rules of go
     * which means dead stones will be removed.
     *
     * @param {List} position
     * @param {string} color
     * @throws {string} when the move is not valid
     * @returns {Board}
     * @example
     * var board = Board(3);
     * var new_board = board.addBlackMove(position(1, 0));
     *
     * console.log(board.toPrettyString());
     * // +++
     * // +++
     * // +++
     * console.log(new_board.toPrettyString());
     * // +++
     * // O++
     * // +++
     *
     * @example
     * var board = Board(3)
     *     .addBlackMove(position(0, 1))
     *     .addBlackMove(position(2, 1))
     *     .addBlackMove(position(1, 2))
     *     .addWhiteMove(position(1, 1));
     * var new_board.addBlackMove(position(1, 0));
     *
     * console.log(board.toPrettyString());
     * // +O+
     * // +XO
     * // +O+
     * console.log(new_board.toPrettyString());
     * // +O+
     * // O+O
     * // +O+
     */
    addMove(position, color) {
        return new Board(addMove(this.positions, position, color));
    }

    /**
     * Removes positions.  Positions that are not on the board are ignored.
     *
     * @param {Set} positions
     * @returns {Board}
     */
    removeMoves(positions) {
        return new Board(removeMoves(this.positions, positions));
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
        return group(this.positions, position);
    }

    /**
     * Check if a move is legal for black
     *
     * @param {List} position
     * @returns {boolean}
     */
    isLegalBlackMove(position) {
        return isLegalMove(this.positions, position, BLACK);
    }

    /**
     * Check if a move is legal for white
     *
     * @param {List} position
     * @returns {boolean}
     */
    isLegalWhiteMove(position) {
        return isLegalMove(this.positions, position, WHITE);
    }

    /**
     * Counts liberties for the stone at the given position.
     *
     * @param {List} position
     * @returns {number}
     */
    liberties(position) {
        return liberties(this.positions, position);
    }

    /**
     * Compare with another board.
     *
     * @param {*} other_board Board or Board.positions
     * @returns {boolean}
     */
    equals(other_board) {
        if (!other_board) {
            throw TypeError('Pass in another board to compare');
        }

        return this.positions.equals(other_board.positions || other_board);
    }

    /**
     * @returns {string} ASCII board
     */
    toPrettyString() {
        return prettyString(this.positions);
    }
}
