import {isNumber} from 'lodash';
import {Map} from 'immutable';

import {
    BLACK, WHITE, SIZE_KEY, isValidPosition, oppositeColor, matchingAdjacentPositions, liberties, group
} from './analysis';


export function emptyBoard(size) {
    if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
        throw 'An empty board must be created from a positive integer.';
    }

    return Map().set(SIZE_KEY, size);
}


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


export function addBlackMove(board, position) {
    return addMove(board, position, BLACK);
}


export function addWhiteMove(board, position) {
    return addMove(board, position, WHITE);
}


export function addBlackMoves(board, positions) {
    // TODO
}


export function addWhiteMoves(board, positions) {
    // TODO
}


export function removeMoves(board, positions) {
    return positions.reduce(
        (acc, position) => acc.delete(position),
        board
    );
}


export default {
    emptyBoard
};
