import {curry, compose, map, fill, zip, range, identity, flatten} from 'lodash';
import {List, Set} from 'immutable';


export const BLACK = 'black';
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
 * A set of all possible moves on the board, even the occupied ones.
 *
 * @param {Map} board
 * @returns {Set}
 */
export function allPossibleMoves(board) {
    const size = board.get(SIZE_KEY);

    return Set(flatten(map(
        range(size),
        i => map(
            zip(range(size), fill(Array(size), i)),
            List
        )
    )));
}


export function emptyPositions(board) {
    return allPossibleMoves(board).subtract(board.keys());
}


/**
 * Gets the spaces immediately touching the passed position.
 *
 * Considers the board size and acts correctly on sides and corners.
 *
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


export function matchingAdjacentPositions(board, position, state) {
    if (state === undefined) {
        state = board.get(position, EMPTY);
    }

    return adjacentPositions(board, position)
        .filter(pos => board.get(pos, EMPTY) === state);
}


/**
 * Gets a set of positions of the logical group associated with the given position.
 *
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


export function oppositeColor(color) {
    return color === BLACK ? WHITE : BLACK;
}


export function isValidPosition(board, position, color) {
    const will_have_liberty = matchingAdjacentPositions(board, position, EMPTY).size > 0;
    const will_kill_something = matchingAdjacentPositions(board, position, oppositeColor(color))
        .some(pos => liberties(board, pos) === 1);
    const wont_suicide = liberties(board.set(position, color), position) !== 0;

    return wont_suicide && (will_have_liberty || will_kill_something);
}


export default {
    isValidPosition, oppositeColor, liberties, group
};
