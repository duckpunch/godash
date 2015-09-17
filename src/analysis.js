import {curry, compose, map, fill, zip, range, identity, flatten} from 'lodash';
import {List, Set} from 'immutable';


/**
 * Value on a board representing a black stone.
 */
export const BLACK = 'black';


/**
 * Value on a board representing a white stone.
 */
export const WHITE = 'white';


/**
 * @private
 */
export const EMPTY = null;


/**
 * @private
 */
export const SIZE_KEY = 'size';


/**
 * @private
 */
export function allPossibleMoves(size) {
    return Set(flatten(map(
        range(size),
        i => map(
            zip(range(size), fill(Array(size), i)),
            List
        )
    )));
}


/**
 * Returns unoccupied positions on the board.
 *
 * @private
 * @param {Map} board
 * @returns {Set}
 */
export function emptyPositions(board) {
    return allPossibleMoves(board.get(SIZE_KEY)).subtract(board.keys());
}


/**
 * Gets the spaces immediately touching the passed position.
 *
 * Considers the board size and acts correctly on sides and corners.
 *
 * @private
 * @param {Map} board
 * @param {List} position
 * @returns {Set}
 */
export function adjacentPositions(board, position) {
    const inc = i => i + 1;
    const dec = i => i - 1;
    const size = board.get(SIZE_KEY);
    const [x, y] = [position.first(), position.last()];
    const check = compose(
        curry(Math.min, 2)(size - 1),
        curry(Math.max, 2)(0)
    );

    return Set([
        [identity, inc],
        [identity, dec],
        [inc, identity],
        [dec, identity],
    ].map(
        ([first, last]) => List.of(check(first(x)), check(last(y)))
    )).subtract(Set.of(position));
}


/**
 * Similar to {@link adjacentPositions}, but filters on a state.
 *
 * @private
 * @param {Map} board
 * @param {List} position
 * @param {string} color
 * @returns {Set}
 */
export function matchingAdjacentPositions(board, position, color) {
    if (color === undefined) {
        color = board.get(position, EMPTY);
    }

    return adjacentPositions(board, position)
        .filter(pos => board.get(pos, EMPTY) === color);
}


/**
 * Gets a set of positions of the logical group associated with the given position.
 *
 * @private
 * @param {Map} board
 * @param {List} position
 * @returns {Set}
 */
export function group(board, position) {
    let found = Set();
    let queue = Set.of(position);

    while (!queue.isEmpty()) {
        const current = queue.first();
        const more_matching = matchingAdjacentPositions(board, position);

        queue = queue.rest().union(more_matching.subtract(found));
        found = found.add(current);
    }

    return found;
}


/**
 * Counts liberties for the stone at the given position.
 *
 * @private
 * @param {Map} board
 * @param {List} position
 * @returns {number}
 */
export function liberties(board, position) {
    return group(board, position).reduce(
        (acc, pos) => acc.union(matchingAdjacentPositions(board, pos, EMPTY)),
        Set()
    ).size;
}


/**
 * Returns {@link BLACK} if {@link WHITE}, {@link WHITE} if {@link BLACK}.
 *
 * @private
 * @param {string} color
 * @throws {string} when color is neither black nor white
 * @returns {string}
 */
export function oppositeColor(color) {
    if (color !== BLACK && color !== WHITE) {
        throw 'Must pass in a color';
    }
    return color === BLACK ? WHITE : BLACK;
}


/**
 * Checks if given position is a valid play for the given color.
 *
 * @private
 * @param {Map} board
 * @param {List} position
 * @param {List} color
 * @returns {boolean}
 */
export function isValidPosition(board, position, color) {
    const will_have_liberty = liberties(board.set(position, color), position) > 0;
    const will_kill_something = matchingAdjacentPositions(board, position, oppositeColor(color))
        .some(pos => liberties(board, pos) === 1);

    return will_have_liberty || will_kill_something;
}


export default {
    isValidPosition, oppositeColor, liberties, group
};
