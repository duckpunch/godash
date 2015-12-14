import assert from 'assert';
import {List, Set} from 'immutable';

import {emptyBoard, addMove, removeMoves} from '../src/transforms';
import {SIZE_KEY, BLACK, WHITE} from '../src/analysis';


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


describe('add move', function() {
    it('adds a move to simple empty board', function() {
        const board = emptyBoard(19);

        assert.equal(
            addMove(board, List.of(9, 9), BLACK).get(List.of(9, 9)),
            BLACK
        );
    });

    it('throws if adding same move twice', function() {
        const board = emptyBoard(19);

        assert.throws(function() {
            const position = List.of(9, 9);

            addMove(addMove(board, position, BLACK), position, WHITE);
        });
    });

    it('kills groups that run out of liberties', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 0), WHITE)
            .set(List.of(1, 1), WHITE)
            .set(List.of(2, 0), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        const new_board = addMove(board, List.of(2, 2), WHITE);

        assert.ok(
            Set([
                SIZE_KEY,
                List.of(1, 0),
                List.of(1, 1),
                List.of(2, 2),
                List.of(1, 2),
            ]).equals(Set(new_board.keys()))
        );
    });

    it('kills 3 stone group', function() {
        const board = emptyBoard(5)
            .set(List.of(0, 0), BLACK)
            .set(List.of(0, 1), BLACK)
            .set(List.of(0, 2), BLACK)
            .set(List.of(1, 0), WHITE)
            .set(List.of(1, 1), WHITE)
            .set(List.of(1, 2), WHITE)
            .set(List.of(2, 0), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(2, 2), BLACK);

        const new_board = addMove(board, List.of(1, 3), BLACK);

        assert.ok(
            Set([
                SIZE_KEY,
                List.of(0, 0),
                List.of(0, 1),
                List.of(0, 2),
                List.of(2, 0),
                List.of(2, 1),
                List.of(2, 2),
                List.of(1, 3),
            ]).equals(Set(new_board.keys()))
        );
    });
});


describe('remove moves', function() {
    it('removes as expected', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 0), WHITE)
            .set(List.of(1, 1), WHITE)
            .set(List.of(2, 0), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        const new_board = removeMoves(board, Set([
            List.of(1, 1),
            List.of(2, 0),
            List.of(2, 1),
        ]));

        assert.ok(
            Set([
                SIZE_KEY,
                List.of(1, 0),
                List.of(1, 2),
            ]).equals(Set(new_board.keys()))
        );
    });
});
