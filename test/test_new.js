import assert from 'assert';
import {Set} from 'immutable';
import _ from 'lodash';
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
    removeStone,
    removeStones,
    addMove,
    placeStone,
    placeStones,
    toAsciiBoard,
    constructBoard,
    compactMoves,
    tokenize,
    sgfToJS,
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
    it('yields the correct 4 when coordinate is in center', function() {
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

    it('yields the correct 3 when coordinate is on side', function() {
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

    it('yields the correct 2 when coordinate is corner', function() {
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
    const board = new Board(19,
        new Coordinate(9, 8), BLACK,
        new Coordinate(9, 10), WHITE,
        new Coordinate(8, 9), WHITE,
    );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), BLACK,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), WHITE,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), BLACK,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), WHITE,
        );

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
        const board = new Board(5,
            new Coordinate(2, 2), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(3, 2), BLACK,
        );

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
        const board = new Board(3,
            new Coordinate(1, 0), BLACK,
            new Coordinate(0, 1), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
        );

        assert.ok(!isLegalMove(board, new Coordinate(1, 1), WHITE));
    });

    it('allows filling in a ponnuki', function() {
        const board = new Board(3,
            new Coordinate(1, 0), BLACK,
            new Coordinate(0, 1), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
        );

        assert.ok(isLegalMove(board, new Coordinate(1, 1), BLACK));
    });

    it('marks suicide in corner as invalid', function() {
        const board = new Board(3,
            new Coordinate(2, 0), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
        );

        assert.ok(!isLegalMove(board, new Coordinate(2, 2), WHITE));
    });

    it('marks suicide in corner that kills first as valid', function() {
        const board = new Board(3,
            new Coordinate(2, 0), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
            new Coordinate(1, 0), WHITE,
            new Coordinate(1, 1), WHITE,
        );

        assert.ok(isLegalMove(board, new Coordinate(2, 2), WHITE));
    });
});

describe('removeStone', function() {
    it('can remove a specified stone', function() {
        const board = new Board(19,
            new Coordinate(9, 9), BLACK,
        );

        const updatedBoard = removeStone(board, new Coordinate(9,9));

        assert.equal(
            updatedBoard.moves.get(new Coordinate(9, 9)),
            EMPTY,
        );
    });

    it('does not blow up even if a coordinate is not there', function() {
        const board = new Board();

        const updatedBoard = removeStone(board, new Coordinate(9,9));

        assert.equal(
            updatedBoard.moves.get(new Coordinate(9, 9)),
            EMPTY,
        );
    });
});

describe('removeStones', function() {
    it('can remove a bunch of stones', function() {
        const board = new Board(19,
            new Coordinate(9, 9), BLACK,
            new Coordinate(3, 4), WHITE,
            new Coordinate(9, 10), BLACK,
            new Coordinate(5, 9), WHITE,
            new Coordinate(3, 9), BLACK,
        );

        const updatedBoard = removeStones(
            board,
            Set.of(
                new Coordinate(9, 9),
                new Coordinate(3, 9),
                new Coordinate(5, 9),
            ),
        );

        assert.equal(updatedBoard.moves.get(new Coordinate(9, 9)), EMPTY);
        assert.equal(updatedBoard.moves.get(new Coordinate(3, 9)), EMPTY);
        assert.equal(updatedBoard.moves.get(new Coordinate(5, 9)), EMPTY);

        assert.equal(updatedBoard.moves.get(new Coordinate(3, 4)), WHITE);
        assert.equal(updatedBoard.moves.get(new Coordinate(9, 10)), BLACK);
    });
});

describe('addMove', function() {
    it('adds a move to simple empty board', function() {
        const board = new Board();

        assert.equal(
            addMove(board, new Coordinate(9, 9), BLACK).moves.get(new Coordinate(9, 9)),
            BLACK
        );
    });

    it('throws if adding same move twice', function() {
        const board = new Board();

        assert.throws(function() {
            const coordinate = new Coordinate(9, 9);

            addMove(
                addMove(board, coordinate, BLACK),
                coordinate,
                WHITE,
            );
        });
    });

    it('kills groups that run out of liberties', function() {
        const board = new Board(3,
            new Coordinate(1, 0), WHITE,
            new Coordinate(1, 1), WHITE,
            new Coordinate(2, 0), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(1, 2), BLACK,
        );

        const newBoard = addMove(board, new Coordinate(2, 2), WHITE);

        assert.ok(
            Set.of(
                new Coordinate(1, 0),
                new Coordinate(1, 1),
                new Coordinate(2, 2),
                new Coordinate(1, 2),
            ).equals(Set(newBoard.moves.keys()))
        );
    });

    it('can kill 3 stone groups', function() {
        const board = new Board(5,
            new Coordinate(0, 0), BLACK,
            new Coordinate(0, 1), BLACK,
            new Coordinate(0, 2), BLACK,
            new Coordinate(1, 0), WHITE,
            new Coordinate(1, 1), WHITE,
            new Coordinate(1, 2), WHITE,
            new Coordinate(2, 0), BLACK,
            new Coordinate(2, 1), BLACK,
            new Coordinate(2, 2), BLACK,
        );

        const newBoard = addMove(board, new Coordinate(1, 3), BLACK);

        assert.ok(
            Set.of(
                new Coordinate(0, 0),
                new Coordinate(0, 1),
                new Coordinate(0, 2),
                new Coordinate(2, 0),
                new Coordinate(2, 1),
                new Coordinate(2, 2),
                new Coordinate(1, 3),
            ).equals(Set(newBoard.moves.keys()))
        );
    });
});

describe('placeStone', function() {
    it('can place a stone on an empty board', function() {
        const board = new Board();

        assert.equal(
            placeStone(board, new Coordinate(9, 9), BLACK).moves.get(new Coordinate(9, 9)),
            BLACK
        );
    });

    it('throws if placing onto a coordinate with an opposite stone color', function() {
        const board = new Board();

        assert.throws(function() {
            const coordinate = new Coordinate(9, 9);

            placeStone(
                placeStone(board, coordinate, BLACK),
                coordinate,
                WHITE,
            );
        });
    });

    it('can force an existing opposite color stone placement', function() {
        const board = new Board();
        const coordinate = new Coordinate(9, 9);

        const blackStoneBoard = placeStone(board, coordinate, BLACK);
        const whiteStoneBoard = placeStone(blackStoneBoard, coordinate, WHITE, true);

        assert.equal(whiteStoneBoard.moves.get(coordinate), WHITE);
    });

    it('can place a stone that breaks the rules', function() {
        const board = new Board(5,
            new Coordinate(2, 1), BLACK,
            new Coordinate(2, 3), BLACK,
            new Coordinate(1, 2), BLACK,
            new Coordinate(3, 2), BLACK,
        );
        const coordinate = new Coordinate(2, 2);

        const newBoard = placeStone(board, coordinate, WHITE);

        assert.equal(newBoard.moves.get(coordinate), WHITE);
    });
});

describe('placeStones', function() {
    it('can place a bunch of stones', function() {
        const coordinates = Set.of(
            new Coordinate(2, 1),
            new Coordinate(2, 3),
            new Coordinate(1, 2),
            new Coordinate(3, 2),
        );
        const board = placeStones(new Board(), coordinates, BLACK);

        assert.ok(
            Set.of(
                new Coordinate(2, 1),
                new Coordinate(2, 3),
                new Coordinate(1, 2),
                new Coordinate(3, 2),
            ).equals(
                Set(board.moves.keys())
            )
        );
    });
});

describe('toAsciiBoard', function() {
    it('can produce a simple empty board', function() {
        assert.equal(
            toAsciiBoard(new Board(3)),
            '+++\n' +
            '+++\n' +
            '+++\n'
        );
    });

    it('can produce a board with one move', function() {
        assert.equal(
            toAsciiBoard(new Board(3,
                new Coordinate(1, 1), WHITE
            )),
            '+++\n' +
            '+X+\n' +
            '+++\n'
        );
    });
});

describe('constructBoard', function() {
    it('can add a single stone', function() {
        const board = constructBoard([
            new Coordinate(9, 9)
        ]);

        assert.ok(
            Set.of(
                new Coordinate(9, 9),
            ).equals(
                Set(board.moves.keys())
            )
        );
    });

    it('can kill a stone', function() {
        const stoneToKill = new Coordinate(8, 9);
        const board = constructBoard([
            new Coordinate(9, 9),
            new Coordinate(9, 10),
            new Coordinate(8, 10),
            stoneToKill,
            new Coordinate(8, 8),
            new Coordinate(9, 8),
            new Coordinate(7, 9),
        ]);

        assert.ok(
            Set.of(
                new Coordinate(9, 9),
                new Coordinate(9, 10),
                new Coordinate(8, 10),
                new Coordinate(8, 8),
                new Coordinate(9, 8),
                new Coordinate(7, 9),
            ).equals(
                Set(board.moves.keys())
            )
        );
    });
});

describe('tokenize', function() {
    const testCases = [
        {
            description: 'does tokenizing',
            input: '()',
            expected: ['(', ')'],
        },
        {
            description: 'does basics',
            input: '(;B[aa])',
            expected: ['(', ';', ['B', 'aa'], ')'],
        },
        {
            description: 'handles escapes',
            input: '(;B[aa]C[\\[\\] hello there])',
            expected: ['(', ';', ['B', 'aa'], ['C', '[] hello there'], ')'],
        },
        {
            description: 'handles escaped backslashes',
            input: '(;B[aa]C[\\[\\] \\\\ hello there])',
            expected: ['(', ';', ['B', 'aa'], ['C', '[] \\ hello there'], ')'],
        },
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        it(testCase.description, function() {
            assert.deepEqual(
                tokenize(testCase.input),
                testCase.expected,
            );
        })
    }
});

describe('compactMoves', function() {
    const testCases = [
        {
            description: 'does nothing to starts and stops',
            input: ['(', ')'],
            expected: ['(', ')'],
        },
        {
            description: 'compacts a simple move',
            input: ['(', ';', ['B', 'aa'], ['W', 'bb'], ')'],
            expected: ['(', {B: 'aa', W: 'bb'}, ')'],
        },
        {
            description: 'handles variations',
            input: [
                '(',
                ';', ['B', 'aa'], ['W', 'bb'],
                ';', ['B', 'cc'],
                ';', ['W', 'dd'],
                '(',
                ';', ['B', 'ee'],
                ')',
                '(',
                ';', ['B', 'ff'],
                ')',
                ')',
            ],
            expected: [
                '(',
                {B: 'aa', W: 'bb'},
                {B: 'cc'},
                {W: 'dd'},
                '(',
                {B: 'ee'},
                ')',
                '(',
                {B: 'ff'},
                ')',
                ')',
            ],
        },
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        it(testCase.description, function() {
            assert.deepEqual(
                compactMoves(testCase.input),
                testCase.expected,
            );
        })
    }
});

describe('sgfToJS', function() {
    it('can parse a real looking SGF', function () {
        const rawSgf = `(
            ;FF[4]GM[1]SZ[19];B[aa];W[bb]
                (;B[cc];W[dd];B[ad];W[bd])
                (;B[hh];W[hg]C[what a move!])
                (;B[gg];W[gh];B[hh]
                    (;W[hg];B[kk])
                    (;W[kl])
                )
        )`;

        const expected = [
            {FF: '4', GM: '1', SZ: '19'}, {B: 'aa'}, {W: 'bb'},
            [
                [{B: 'cc'}, {W: 'dd'}, {B: 'ad'}, {W: 'bd'}],
                [{B: 'hh'}, {W: 'hg', C: 'what a move!'}],
                [
                    {B: 'gg'}, {W: 'gh'}, {B: 'hh'},
                    [
                        [{W: 'hg'}, {B: 'kk'}],
                        [{W: 'kl'}],
                    ]
                ]
            ],
        ];

        assert.deepEqual(expected, sgfToJS(rawSgf));
    });
});
