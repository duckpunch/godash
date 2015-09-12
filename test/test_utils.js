import assert from 'assert';
import mori from 'mori';

import {emptyBoard} from '../src/transforms';
import {adjacentPositions} from '../src/analysis';


describe('empty board', function() {
    it('has the size that is passed in and nothing else', function() {
        const size = 19;
        const board = emptyBoard(19);

        assert.ok(mori.hasKey(board, 'size'));
        assert.ok(mori.isEmpty(mori.dissoc(board, 'size')));
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


describe('adjacent positions', function() {
    it('yields the correct 4 when position is in center', function() {
        const position = mori.vector(9, 9);
        const board = emptyBoard(19);

        assert.ok(mori.equals(
            adjacentPositions(board, position),
            mori.set([
                mori.vector(9, 8),
                mori.vector(9, 10),
                mori.vector(8, 9),
                mori.vector(10, 9),
            ])
        ));
    });

    it('yields the correct 3 when position is on side', function() {
        const position = mori.vector(0, 9);
        const board = emptyBoard(19);

        assert.ok(mori.equals(
            adjacentPositions(board, position),
            mori.set([
                mori.vector(0, 8),
                mori.vector(0, 10),
                mori.vector(1, 9),
            ])
        ));
    });

    it('yields the correct 2 when position is corner', function() {
        const position = mori.vector(18, 18);
        const board = emptyBoard(19);

        assert.ok(mori.equals(
            adjacentPositions(board, position),
            mori.set([
                mori.vector(18, 17),
                mori.vector(17, 18),
            ])
        ));
    });
});
