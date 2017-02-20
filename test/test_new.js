import assert from 'assert';
import {Set} from 'immutable';
import {
    Board,
    Coordinate,
    sgfPointToCoordinate,
    adjacentCoordinates,
} from '../src/new';


describe('sgfPointToCoordinate', function() {
    it('converts "aa" to (0, 0)', function() {
        assert.ok(
            (new Coordinate(0, 0)).equals(
                sgfPointToCoordinate('aa')
            )
        );
    });

    it('converts "hi" to (7, 8)', function() {
        assert.ok(
            (new Coordinate(7, 8)).equals(
                sgfPointToCoordinate('hi')
            )
        );
    });

    it('raises if passed a non-string', function() {
        assert.throws(function() {
            sgfPointToCoordinate(5);
        }, TypeError);
    });

    it('raises if passed string not length 2', function() {
        assert.throws(function() {
            sgfPointToCoordinate('roar');
        }, TypeError);
    });
});

describe('adjacentCoordinates', function() {
    it('yields the correct 4 when position is in center', function() {
        const coordinate = new Coordinate(9, 9);
        const board = new Board();

        assert.ok(
            adjacentCoordinates(board, coordinate).equals(
                Set.of(
                    new Coordinate(9, 8),
                    new Coordinate(9, 10),
                    new Coordinate(8, 9),
                    new Coordinate(10, 9),
                )
            )
        );
    });

    it('yields the correct 3 when position is on side', function() {
        const coordinate = new Coordinate(0, 9);
        const board = new Board();

        assert.ok(
            adjacentCoordinates(board, coordinate).equals(
                Set.of(
                    new Coordinate(0, 8),
                    new Coordinate(0, 10),
                    new Coordinate(1, 9),
                )
            )
        );
    });

    it('yields the correct 2 when position is corner', function() {
        const coordinate = new Coordinate(18, 18);
        const board = new Board();

        assert.ok(
            adjacentCoordinates(board, coordinate).equals(
                Set.of(
                    new Coordinate(18, 17),
                    new Coordinate(17, 18),
                )
            )
        );
    });
});
