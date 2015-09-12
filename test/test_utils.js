import assert from 'assert';
import mori from 'mori';

import {emptyBoard} from '../src/transforms';


describe('empty board', function() {
    it('has the size that is passed in and nothing else', function() {
        const size = 19;
        const board = emptyBoard(19);

        assert.ok(mori.hasKey(board, 'size'));
        assert.ok(mori.isEmpty(mori.dissoc(board, 'size')));

        console.log(mori.vector(1, 2));
        let v = mori.vector(2, 2);
        let [x, y] = [mori.first(v), mori.last(v)];
        let vector_xform = [
            [mori.identity, mori.inc],
            [mori.identity, mori.dec],
            [mori.inc, mori.identity],
            [mori.dec, mori.identity],
        ];
        let check = mori.comp(
            mori.curry(Math.min, 5),
            mori.curry(Math.max, 0)
        );
        console.log(
            mori.set(mori.map(
                ([first, last]) => mori.vector(check(first(x)), check(last(x))),
                vector_xform
            ))
        );
    });

    it('only takes positive integers as size', function() {
        assert.throws(function() {
            emptyBoard('hi');
        });

        assert.throws(function() {
            emptyBoard(-5);
        });

        assert.throws(function() {
            emptyBoard(5.5);
        });
    });
});
