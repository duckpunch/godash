import mori from 'mori';
import {map, fill, zip, range, identity, flatten} from 'lodash';
import {List, Set} from 'immutable';


export const BLACK = 'black';
export const WHITE = 'white';
export const EMPTY = null;
export const SIZE_KEY = 'size';


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


//export function emptySpaces(board) {
    //return mori.difference(mori.keys(board), allPossibleMoves(board));
//}


export function adjacentPositions(board, position) {
    const size = board.get(SIZE_KEY);
    const [x, y] = [position.first(), position.last()];
    const check = mori.comp(
        mori.curry(Math.min, size - 1),
        mori.curry(Math.max, 0)
    );

    return Set([
        [identity, mori.inc],
        [identity, mori.dec],
        [mori.inc, identity],
        [mori.dec, identity],
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


//export function connected(board, position, callback) {
    //let queue = mori.queue(position);
    //let visited = mori.set();

    //const color = mori.get(board, position);

    //while (mori.count(queue) > 0) {
        //const current = mori.peek(queue);
        //const adjacent = mori.filter(
            //adj => mori.get(board, adj, null) === color,
            //adjacentPositions(board, current)
        //);
        //const visited_adjacent = mori.intersection(adjacent, visited);

        //queue = mori.union(
            //mori.pop(queue),
            //mori.difference(visited_adjacent, adjacent)
        //);

        //callback(current);
        //visited = mori.conj(visited, current);
    //}
//}


export function equivalentBoards(board, positions) {
    // TODO
}


export function adjacent(board, position) {
    // TODO
}


export function illegalMoves(board) {
    // TODO
}


export function isValidPosition(size, position) {
    // TODO
}


export default {};
