import mori from 'mori';
import _ from 'lodash';
import {List, Set} from 'immutable';


export const BLACK = 'black';
export const WHITE = 'white';
export const SIZE_KEY = 'size';


//export function allPossibleMoves(board) {
    //const size = mori.get(board, SIZE_KEY);

    //return mori.set(mori.reduce(
        //mori.concat,
        //mori.map(
            //i => mori.map(mori.vector, mori.range(size), mori.repeat(i)),
            //mori.range(size)
        //)
    //));
//}


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
        [_.identity, mori.inc],
        [_.identity, mori.dec],
        [mori.inc, _.identity],
        [mori.dec, _.identity],
    ].map(
        ([first, last]) => List.of(check(first(x)), check(last(y)))
    )).subtract(Set.of(position));
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
