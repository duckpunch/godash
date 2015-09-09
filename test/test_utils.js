import assert from 'assert';
import mori from 'mori';

import goban from '../src/utils';


describe('empty board', function() {
    it('has the size that is passed in and nothing else', function() {
        let size = 19;
        let board = goban.emptyBoard(19);

        assert.ok(mori.hasKey(board, 'size'));
        assert.ok(mori.isEmpty(mori.dissoc(board, 'size')));
    });

    it('only takes positive integers as size', function() {
        assert.throws(function() {
            goban.emptyBoard('hi');
        });

        assert.throws(function() {
            goban.emptyBoard(-5);
        });

        assert.throws(function() {
            goban.emptyBoard(5.5);
        });
    });
});
