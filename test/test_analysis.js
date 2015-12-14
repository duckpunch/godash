import assert from 'assert';
import {List, Set} from 'immutable';

import {
    emptyBoard, adjacentPositions, allPossibleMoves, group,
    WHITE, BLACK, liberties, emptyPositions, isLegalMove
} from '../src/analysis';


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


describe('all possible moves', function() {
    it('correctly calculates all moves for a simple board', function() {
        assert.ok(
            allPossibleMoves(3).equals(
                Set([
                    List.of(0, 0),
                    List.of(1, 0),
                    List.of(2, 0),
                    List.of(0, 1),
                    List.of(1, 1),
                    List.of(2, 1),
                    List.of(0, 2),
                    List.of(1, 2),
                    List.of(2, 2),
                ])
            )
        );
    });
});


describe('group', function() {
    it('finds a group of 1', function() {
        const board = emptyBoard(5).set(List.of(2, 2), BLACK);
        assert.ok(
            group(board, List.of(2, 2)).equals(
                Set([
                    List.of(2, 2),
                ])
            )
        );
    });

    it('finds a group of 2', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), BLACK);

        assert.ok(
            group(board, List.of(2, 2)).equals(
                Set([
                    List.of(2, 2),
                    List.of(2, 1),
                ])
            )
        );
    });

    it('finds a group of 1 with adjacent opposite color', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), WHITE);

        assert.ok(
            group(board, List.of(2, 2)).equals(
                Set([
                    List.of(2, 2),
                ])
            )
        );
    });

    it('finds empty triangle', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.ok(
            group(board, List.of(2, 2)).equals(
                Set([
                    List.of(2, 2),
                    List.of(1, 2),
                    List.of(2, 1),
                ])
            )
        );
    });
});


describe('liberties', function() {
    it('finds liberties for 1 stone', function() {
        const board = emptyBoard(5).set(List.of(2, 2), BLACK);

        assert.equal(liberties(board, List.of(2, 2)), 4);
    });

    it('evaluates for group of 2', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), BLACK);

        assert.equal(liberties(board, List.of(2, 2)), 6);
    });

    it('properly decrements liberty with opposite color adjacent', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), WHITE);

        assert.equal(liberties(board, List.of(2, 2)), 3);
    });

    it('counts shared liberties in empty triangle', function() {
        const board = emptyBoard(5)
            .set(List.of(2, 2), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.equal(liberties(board, List.of(2, 2)), 7);
    });
});


describe('empty positions', function() {
    it('correctly determines empty positions', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 1), BLACK)
            .set(List.of(2, 1), WHITE)
            .set(List.of(1, 2), BLACK);

        assert.ok(emptyPositions(board).equals(
            Set([
                List.of(0, 0),
                List.of(0, 1),
                List.of(0, 2),
                List.of(1, 0),
                List.of(2, 0),
                List.of(2, 2),
            ])
        ));
    });
});


describe('is valid position', function() {
    it('identifies suicide moves as invalid', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 0), BLACK)
            .set(List.of(0, 1), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.ok(!isLegalMove(board, List.of(1, 1), WHITE));
    });

    it('allows filling in a ponnuki', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 0), BLACK)
            .set(List.of(0, 1), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.ok(isLegalMove(board, List.of(1, 1), BLACK));
    });

    it('marks suicide in corner as invalid', function() {
        const board = emptyBoard(3)
            .set(List.of(2, 0), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.ok(!isLegalMove(board, List.of(2, 2), WHITE));
    });

    it('marks suicide in corner that kills first as valid', function() {
        const board = emptyBoard(3)
            .set(List.of(1, 0), WHITE)
            .set(List.of(1, 1), WHITE)
            .set(List.of(2, 0), BLACK)
            .set(List.of(2, 1), BLACK)
            .set(List.of(1, 2), BLACK);

        assert.ok(isLegalMove(board, List.of(2, 2), WHITE));
    });
});
