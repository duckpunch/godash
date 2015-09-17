import {Map} from 'immutable';
import {isNumber} from 'lodash';

import {SIZE_KEY} from './analysis';
import {emptyBoard} from './transforms';


function isPositiveInteger(num) {
    return isNumber(num) && num === parseInt(num) && num > 0;
}


/**
 * Checks for valid backing data structure for {@link Board}.
 *
 * @private
 */
export function isValidBoardMap(board) {
    return Map.isMap(board) && isPositiveInteger(board.get(SIZE_KEY, 0));
}


/**
 * Represents a given board state.
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

    addBlackMove(position) {
    }

    addWhiteMove(position) {
    }

    addMove(position, color) {
    }

    allPossibleMoves() {
    }

    group(position) {
    }

    isValidPosition(position) {
    }

    isValidMove(position) {
    }

    liberties(position) {
    }

    removeMoves(positions) {
    }
}
