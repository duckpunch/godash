import {isNumber} from 'lodash';
import {Map, Set} from 'immutable';

import {
    BLACK, WHITE, SIZE_KEY, isLegalMove, oppositeColor,
    matchingAdjacentPositions, liberties, group
} from './analysis';


/**
 * @private
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
    if (!isLegalMove(board, position, color)) {
        throw 'Not a valid position';
    }

    if (board.has(position)) {
        throw 'There is already a stone there';
    }

    const killed = matchingAdjacentPositions(board, position, oppositeColor(color)).reduce(
        (acc, pos) => acc.union(liberties(board, pos) === 1 ? group(board, pos) : Set()),
        Set()
    );

    return removeMoves(board, killed).set(position, color);
}


/**
 * @private
 */
export function addBlackMove(board, position) {
    return addMove(board, position, BLACK);
}


/**
 * @private
 */
export function addWhiteMove(board, position) {
    return addMove(board, position, WHITE);
}


/**
 * @private
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
