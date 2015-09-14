import assert from 'assert';
import {List, Set} from 'immutable';

import {emptyBoard} from '../src/transforms';
import {adjacentPositions, allPossibleMoves} from '../src/analysis';


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
        const board = emptyBoard(3);
        console.log();
        assert.ok(
            allPossibleMoves(board).equals(
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
