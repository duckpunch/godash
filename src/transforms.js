import {isNumber} from 'lodash';
import {Map} from 'immutable';

import {
    BLACK, WHITE, SIZE_KEY, isValidPosition, oppositeColor,
    matchingAdjacentPositions, liberties, group
} from './analysis';


/**
 * Creates an empty board.
 *
 * @param {number} size the size of the board
 * @throws {string} when size is not a positive integer
 * @returns {Map}
 */
export function emptyBoard(size) {
    if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
        throw 'An empty board must be created from a positive integer.';
    }

    return Map().set(SIZE_KEY, size);
}

/**
 * @private
 */
export function addMove(board, position, color) {
    if (!isValidPosition(board, position, color)) {
        throw 'Not a valid position';
    }

    if (board.has(position)) {
        throw 'There is already a stone there';
    }

    const killed = matchingAdjacentPositions(board, position, oppositeColor(color)).reduce(
        (acc, pos) => acc.union(liberties(board, pos) === 1 ? group(pos) : Set()),
        Set()
    );

    return removeMoves(board, killed).set(position, color);
}


/**
 * Adds a black move at the specified position.  Follows the rules of go
 * which means dead stones will be removed.
 *
 * @param {Map} board
 * @param {List} position
 * @throws {string} when the move is not valid
 * @returns {Map} board representing the new state
 */
export function addBlackMove(board, position) {
    return addMove(board, position, BLACK);
}


/**
 * Adds a white move at the specified position.  Follows the rules of go
 * which means dead stones will be removed.
 *
 * @param {Map} board
 * @param {List} position
 * @throws {string} when the move is not valid
 * @returns {Map} board representing the new state
 */
export function addWhiteMove(board, position) {
    return addMove(board, position, WHITE);
}


/**
 * Removes positions.  Positions that are not on the board are ignored.
 *
 * @param {Map} board
 * @param {Set} positions
 * @returns {Map} board representing the new state
 */
export function removeMoves(board, positions) {
    return positions.reduce(
        (acc, position) => acc.delete(position),
        board
    );
}


export default {
    emptyBoard, addBlackMove, addWhiteMove, removeMoves
};
