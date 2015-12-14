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
export function Position(x, y, board_size) {
    const position = List.of(x, y);

    if (matchesPositionType(position)) {
        throw TypeError('Both passed arguments must be integers greater than or equal to 0');
    }

    if (board_size && !isValidPosition(position, board_size)) {
        throw TypeError('Position doesn\'t fit a the passed board size');
    }

    return position;
}


/**
 * @private
 */
function isValidPosition(position, board_size) {
    return matchesPositionType(position) && position.every(val => val < board_size);
}


/**
 * @private
 */
export const matchesPositionType = FixedListSchema(isPositiveInteger, isPositiveInteger);
