import assert from 'assert';
import {List, Set} from 'immutable';

import {emptyBoard} from '../src/transforms';
import {adjacentPositions} from '../src/analysis';


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
