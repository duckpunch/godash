import {List} from 'immutable';
import {isPositiveInteger} from './utils';


/**
 * Returns a coordinate type compatible with the rest of godash.
 *
 * @param {number} x
 * @param {number} y
 * @returns {List} representing a possible coordinate on the board
 * @throws {TypeError} arguments are not integers greater than or equal to 0
 */
export function position(x, y) {
    const valid_x = x === 0 || isPositiveInteger(x);
    const valid_y = y === 0 || isPositiveInteger(y);

    if (!valid_x || !valid_y) {
        throw TypeError('Both passed arguments must be integers greater than or equal to 0');
    }

    return List.of(x, y);
}


/**
 * Validates a position with a board size.
 */
export function isValidPosition(position, board_size) {
}
