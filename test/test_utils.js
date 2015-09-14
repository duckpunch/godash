import assert from 'assert';
import {List, Set} from 'immutable';

import {emptyBoard} from '../src/transforms';
import {adjacentPositions, SIZE_KEY} from '../src/analysis';


describe('empty board', function() {
    it('has the size that is passed in and nothing else', function() {
        const size = 19;
        const board = emptyBoard(19);

        assert.ok(board.has(SIZE_KEY));
        assert.equal(board.get(SIZE_KEY), size);
        assert.ok(board.delete(SIZE_KEY).isEmpty());
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
        const position = List.of(9, 9);
        const board = emptyBoard(19);

        assert.ok(
            adjacentPositions(board, position).equals(
                Set([
                    List.of(9, 8),
                    List.of(9, 10),
                    List.of(8, 9),
                    List.of(10, 9),
                ])
            )
        );
    });

    it('yields the correct 3 when position is on side', function() {
        const position = List.of(0, 9);
        const board = emptyBoard(19);

        assert.ok(
            adjacentPositions(board, position).equals(
                Set([
                    List.of(0, 8),
                    List.of(0, 10),
                    List.of(1, 9),
                ])
            )
        );
    });

    it('yields the correct 2 when position is corner', function() {
        const position = List.of(18, 18);
        const board = emptyBoard(19);

        assert.ok(
            adjacentPositions(board, position).equals(
                Set([
                    List.of(18, 17),
                    List.of(17, 18),
                ])
            )
        );
    });
});
