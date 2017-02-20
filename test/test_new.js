import assert from 'assert';
import {
    Set,
    Map,
} from 'immutable';
import {
    WHITE,
    BLACK,
    EMPTY,
    Board,
    Coordinate,
    sgfPointToCoordinate,
    adjacentCoordinates,
    matchingAdjacentCoordinates,
    group,
    oppositeColor,
    liberties,
    libertyCount,
    isLegalMove,
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

describe('matchingAdjacentCoordinates', function() {
    const coordinate = new Coordinate(9, 9);
    const board = new Board({
        moves: Map.of(
            new Coordinate(9, 8), BLACK,
            new Coordinate(9, 10), WHITE,
            new Coordinate(8, 9), WHITE,
        )
    });

    it('yields correct matches for white', function() {
        assert.ok(
            matchingAdjacentCoordinates(board, coordinate, WHITE).equals(
                Set.of(
                    new Coordinate(9, 10),
                    new Coordinate(8, 9),
                )
            )
        );
    });

    it('yields correct matches for black', function() {
        assert.ok(
            matchingAdjacentCoordinates(board, coordinate, BLACK).equals(
                Set.of(
                    new Coordinate(9, 8),
                )
            )
        );
    });

    it('yields correct matches for empty', function() {
        assert.ok(
            matchingAdjacentCoordinates(board, coordinate, EMPTY).equals(
                Set.of(
                    new Coordinate(10, 9),
                )
            )
        );
    });
});

describe('group', function() {
    it('finds a group of 1', function() {
        const coordinate = new Coordinate(2, 2);
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
            )
        });

        assert.ok(
            group(board, coordinate).equals(
                Set.of(
                    new Coordinate(2, 2),
                )
            )
        );
    });

    it('finds a group of 2', function() {
        const coordinate = new Coordinate(2, 2);
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), BLACK,
            )
        });

        assert.ok(
            group(board, coordinate).equals(
                Set.of(
                    new Coordinate(2, 2),
                    new Coordinate(2, 1),
                )
            )
        );
    });

    it('finds a group of 1 with adjacent opposite color', function() {
        const coordinate = new Coordinate(2, 2);
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), WHITE,
            )
        });

        assert.ok(
            group(board, coordinate).equals(
                Set.of(
                    new Coordinate(2, 2),
                )
            )
        );
    });

    it('finds empty triangle', function() {
        const coordinate = new Coordinate(2, 2);
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(1, 2), BLACK,
            )
        });

        assert.ok(
            group(board, coordinate).equals(
                Set.of(
                    new Coordinate(2, 2),
                    new Coordinate(2, 1),
                    new Coordinate(1, 2),
                )
            )
        );
    });
});

describe('oppositeColor', function() {
    it('returns opposite of black', function() {
        assert.equal(
            oppositeColor(BLACK),
            WHITE,
        );
    });

    it('returns opposite of white', function() {
        assert.equal(
            oppositeColor(WHITE),
            BLACK,
        );
    });

    it('returns empty for random strings', function() {
        assert.equal(
            oppositeColor('derp'),
            EMPTY,
        );
    });
});

describe('liberties and libertyCount', function() {
    it('find values for 1 stone', function() {
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
            )
        });

        assert.ok(liberties(board, new Coordinate(2, 2)).equals(
            Set.of(
                new Coordinate(2, 1),
                new Coordinate(1, 2),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
            )
        ));
        assert.equal(libertyCount(board, new Coordinate(2, 2)), 4);
    });

    it('find values for group of 2', function() {
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), BLACK,
            )
        });

        assert.ok(liberties(board, new Coordinate(2, 2)).equals(
            Set.of(
                new Coordinate(1, 2),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
                new Coordinate(2, 0),
                new Coordinate(1, 1),
                new Coordinate(3, 1),
            )
        ));
        assert.equal(libertyCount(board, new Coordinate(2, 2)), 6);
    });

    it('properly decrement liberty with opposite color adjacent', function() {
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), WHITE,
            )
        });

        assert.ok(liberties(board, new Coordinate(2, 2)).equals(
            Set.of(
                new Coordinate(1, 2),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
            )
        ));
        assert.equal(libertyCount(board, new Coordinate(2, 2)), 3);
    });

    it('count shared liberties in empty triangle', function() {
        const board = new Board({
            dimensions: 5,
            moves: Map.of(
                new Coordinate(2, 2), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(3, 2), BLACK,
            )
        });

        assert.ok(liberties(board, new Coordinate(2, 2)).equals(
            Set.of(
                new Coordinate(1, 2),
                new Coordinate(2, 3),
                new Coordinate(4, 2),
                new Coordinate(2, 0),
                new Coordinate(1, 1),
                new Coordinate(3, 1),
                new Coordinate(3, 3),
            )
        ));
        assert.equal(libertyCount(board, new Coordinate(2, 2)), 7);
    });
});

describe('isLegalMove', function() {
    it('identifies suicide moves as invalid', function() {
        const board = new Board({
            dimensions: 3,
            moves: Map.of(
                new Coordinate(1, 0), BLACK,
                new Coordinate(0, 1), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(1, 2), BLACK,
            )
        });

        assert.ok(!isLegalMove(board, new Coordinate(1, 1), WHITE));
    });

    it('allows filling in a ponnuki', function() {
        const board = new Board({
            dimensions: 3,
            moves: Map.of(
                new Coordinate(1, 0), BLACK,
                new Coordinate(0, 1), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(1, 2), BLACK,
            )
        });

        assert.ok(isLegalMove(board, new Coordinate(1, 1), BLACK));
    });

    it('marks suicide in corner as invalid', function() {
        const board = new Board({
            dimensions: 3,
            moves: Map.of(
                new Coordinate(2, 0), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(1, 2), BLACK,
            )
        });

        assert.ok(!isLegalMove(board, new Coordinate(2, 2), WHITE));
    });

    it('marks suicide in corner that kills first as valid', function() {
        const board = new Board({
            dimensions: 3,
            moves: Map.of(
                new Coordinate(2, 0), BLACK,
                new Coordinate(2, 1), BLACK,
                new Coordinate(1, 2), BLACK,
                new Coordinate(1, 0), WHITE,
                new Coordinate(1, 1), WHITE,
            )
        });

        assert.ok(isLegalMove(board, new Coordinate(2, 2), WHITE));
    });
});
