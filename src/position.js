import {isString} from 'lodash';
import {List} from 'immutable';
import {FixedListSchema} from 'immutable-schema';

import {isPositiveInteger} from './utils';


/**
 * Returns a coordinate type compatible with the rest of godash.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} board_size optional board size to validate against
 * @returns {List} representing a possible coordinate on the board
 * @throws {TypeError} arguments are not integers greater than or equal to 0
 * @throws {TypeError} first two arguments don't validate against board size
 */
export function Position(x, y, boardSize) {
    const position = List.of(x, y);

    if (!matchesPositionType(position)) {
        throw TypeError('Both passed arguments must be integers greater than or equal to 0');
    }

    if (board_size && !isValidPosition(position, boardSize)) {
        throw TypeError('Position doesn\'t fit a the passed board size');
    }

    return position;
}


/**
 * Convert sgf coordinates to godash coordinates
 */
export function sgfToXY(sgf) {
    if (isString(sgf) && sgf.length == 2) {
        return [sgf.charCodeAt(0) - 97, sgf.charCodeAt(1) - 97];
    } else {
        throw TypeError('Must pass a string of length 2');
    }
}


/**
 * @private
 */
function isValidPosition(position, boardSize) {
    return matchesPositionType(position) && position.every(val => val < boardSize);
}


/**
 * @private
 */
export const matchesPositionType = FixedListSchema(isPositiveInteger, isPositiveInteger);
