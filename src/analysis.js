import mori from 'mori';


export const BLACK = 'black';
export const WHITE = 'white';
export const SIZE_KEY = 'size';


export function allPossibleMoves(board) {
    const size = mori.get(board, SIZE_KEY);

    return mori.set(mori.reduce(
        mori.concat,
        mori.map(
            i => mori.map(mori.vector, mori.range(size), mori.repeat(i)),
            mori.range(size)
        )
    ));
}


export function emptySpaces(board) {
    return mori.difference(mori.keys(board), allPossibleMoves(board));
}


export function adjacentPositions(board, position) {
    const size = mori.get(board, SIZE_KEY);
    const [x, y] = [mori.first(v), mori.last(v)];
    const vector_xform = [
        [mori.identity, mori.inc],
        [mori.identity, mori.dec],
        [mori.inc, mori.identity],
        [mori.dec, mori.identity],
    ];
    const check = mori.comp(
        mori.curry(Math.min, size),
        mori.curry(Math.max, 0)
    );

    return mori.set(mori.map(
        ([first, last]) => mori.vector(check(first(x)), check(last(x))),
        vector_xform
    ));
}


export function connected(board, position, callback) {
    let queue = mori.queue(position);
    let visited = mori.set();

    while (mori.count(queue) > 0) {
        const current = mori.peek(queue);
        queue = mori.pop(queue);
    }
}
