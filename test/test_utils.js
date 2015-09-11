import assert from 'assert';
import mori from 'mori';

import {emptyBoard} from '../src/utils';


describe('empty board', function() {
    it('has the size that is passed in and nothing else', function() {
        let size = 19;
        let board = emptyBoard(19);

        assert.ok(mori.hasKey(board, 'size'));
        assert.ok(mori.isEmpty(mori.dissoc(board, 'size')));

        console.log(
            mori.set(mori.reduce(mori.concat, mori.map(
                function(t) {return mori.map(mori.vector, mori.last(t),mori.repeat(mori.first(t)))},
                mori.seq(mori.zipmap(
                    mori.range(5),
                    mori.repeat(mori.range(5))
                ))
            )))
        );

        let rg = mori.range(5)
        console.log(
            mori.set(mori.reduce(
                mori.concat,
                mori.map(
                    i => mori.map(mori.vector, rg, mori.repeat(i)),
                    rg
                )
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
