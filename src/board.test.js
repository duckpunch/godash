import assert from 'assert';
import {Set, List} from 'immutable';
import {
  BLACK,
  Board,
  Coordinate,
  EMPTY,
  Move,
  WHITE,
  addMove,
  adjacentCoordinates,
  constructBoard,
  difference,
  followupKo,
  group,
  handicapBoard,
  isLegalMove,
  isLegalBlackMove,
  isLegalWhiteMove,
  liberties,
  libertyCount,
  matchingAdjacentCoordinates,
  oppositeColor,
  placeStone,
  placeStones,
  removeStone,
  removeStones,
  toAsciiBoard,
  toString,
} from './board';

describe('Board constructor', () => {
  it('can be constructed with and without new', () => {
    assert.ok(new Board() instanceof Board);
    assert.ok(Board() instanceof Board);
  });

  it('can take Move as parameters', () => {
    const board = Board(
      19,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 5), WHITE),
    );

    assert.ok(board.moves.has(Coordinate(2, 2)));
    assert.ok(board.moves.has(Coordinate(2, 5)));
    assert.ok(board.moves.get(Coordinate(2, 2)) === BLACK);
    assert.ok(board.moves.get(Coordinate(2, 5)) === WHITE);
  });
});

describe('Board toMap', () => {
  it('can generate an empty map', () => {
    assert.deepEqual(
      Board().toMap(),
      Array(19).fill(null).map(() => Array(19).fill(EMPTY)),
    );
  });

  it('can generate from a board with stones', () => {
    assert.deepEqual(
      Board(
        5,
        Move(Coordinate(2, 2), BLACK),
        Move(Coordinate(1, 2), WHITE),
      ).toMap(),
      [
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, WHITE, BLACK, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      ]
    );
  });
});

describe('Coordinate constructor', () => {
  it('can be constructed with and without new', () => {
    assert.ok(new Coordinate() instanceof Coordinate);
    assert.ok(Coordinate() instanceof Coordinate);
  });
});

describe('Move constructor', () => {
  it('can be constructed with and without new', () => {
    assert.ok(new Move() instanceof Move);
    assert.ok(Move() instanceof Move);
  });
});

describe('adjacentCoordinates', () => {
  it('yields the correct 4 when coordinate is in center', () => {
    const coordinate = Coordinate(9, 9);
    const board = Board();

    assert.ok(
      adjacentCoordinates(board, coordinate).equals(
        Set.of(
          Coordinate(9, 8),
          Coordinate(9, 10),
          Coordinate(8, 9),
          Coordinate(10, 9),
        )
      )
    );
  });

  it('yields the correct 3 when coordinate is on side', () => {
    const coordinate = Coordinate(0, 9);
    const board = Board();

    assert.ok(
      adjacentCoordinates(board, coordinate).equals(
        Set.of(
          Coordinate(0, 8),
          Coordinate(0, 10),
          Coordinate(1, 9),
        )
      )
    );
  });

  it('yields the correct 2 when coordinate is corner', () => {
    const coordinate = Coordinate(18, 18);
    const board = Board();

    assert.ok(
      adjacentCoordinates(board, coordinate).equals(
        Set.of(
          Coordinate(18, 17),
          Coordinate(17, 18),
        )
      )
    );
  });
});

describe('matchingAdjacentCoordinates', () => {
  const coordinate = Coordinate(9, 9);
  const board = Board(19,
    Move(Coordinate(9, 8), BLACK),
    Move(Coordinate(9, 10), WHITE),
    Move(Coordinate(8, 9), WHITE),
  );

  it('yields correct matches for white', () => {
    assert.ok(
      matchingAdjacentCoordinates(board, coordinate, WHITE).equals(
        Set.of(
          Coordinate(9, 10),
          Coordinate(8, 9),
        )
      )
    );
  });

  it('yields correct matches for black', () => {
    assert.ok(
      matchingAdjacentCoordinates(board, coordinate, BLACK).equals(
        Set.of(
          Coordinate(9, 8),
        )
      )
    );
  });

  it('yields correct matches for empty', () => {
    assert.ok(
      matchingAdjacentCoordinates(board, coordinate, EMPTY).equals(
        Set.of(
          Coordinate(10, 9),
        )
      )
    );
  });
});

describe('group', () => {
  it('finds a group of 1', () => {
    const coordinate = Coordinate(2, 2);
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
    );

    assert.ok(
      group(board, coordinate).equals(
        Set.of(
          Coordinate(2, 2),
        )
      )
    );
  });

  it('finds a group of 2', () => {
    const coordinate = Coordinate(2, 2);
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), BLACK),
    );

    assert.ok(
      group(board, coordinate).equals(
        Set.of(
          Coordinate(2, 2),
          Coordinate(2, 1),
        )
      )
    );
  });

  it('finds a group of 1 with adjacent opposite color', () => {
    const coordinate = Coordinate(2, 2);
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), WHITE),
    );

    assert.ok(
      group(board, coordinate).equals(
        Set.of(
          Coordinate(2, 2),
        )
      )
    );
  });

  it('finds empty triangle', () => {
    const coordinate = Coordinate(2, 2);
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
    );

    assert.ok(
      group(board, coordinate).equals(
        Set.of(
          Coordinate(2, 2),
          Coordinate(2, 1),
          Coordinate(1, 2),
        )
      )
    );
  });
});

describe('oppositeColor', () => {
  it('returns opposite of black', () => {
    assert.equal(
      oppositeColor(BLACK),
      WHITE,
    );
  });

  it('returns opposite of white', () => {
    assert.equal(
      oppositeColor(WHITE),
      BLACK,
    );
  });

  it('returns empty for random strings', () => {
    assert.equal(
      oppositeColor('derp'),
      EMPTY,
    );
  });
});

describe('liberties and libertyCount', () => {
  it('find values for 1 stone', () => {
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
    );

    assert.ok(liberties(board, Coordinate(2, 2)).equals(
      Set.of(
        Coordinate(2, 1),
        Coordinate(1, 2),
        Coordinate(2, 3),
        Coordinate(3, 2),
      )
    ));
    assert.equal(libertyCount(board, Coordinate(2, 2)), 4);
  });

  it('find values for group of 2', () => {
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), BLACK),
    );

    assert.ok(liberties(board, Coordinate(2, 2)).equals(
      Set.of(
        Coordinate(1, 2),
        Coordinate(2, 3),
        Coordinate(3, 2),
        Coordinate(2, 0),
        Coordinate(1, 1),
        Coordinate(3, 1),
      )
    ));
    assert.equal(libertyCount(board, Coordinate(2, 2)), 6);
  });

  it('properly decrement liberty with opposite color adjacent', () => {
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), WHITE),
    );

    assert.ok(liberties(board, Coordinate(2, 2)).equals(
      Set.of(
        Coordinate(1, 2),
        Coordinate(2, 3),
        Coordinate(3, 2),
      )
    ));
    assert.equal(libertyCount(board, Coordinate(2, 2)), 3);
  });

  it('count shared liberties in empty triangle', () => {
    const board = Board(5,
      Move(Coordinate(2, 2), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(3, 2), BLACK),
    );

    assert.ok(liberties(board, Coordinate(2, 2)).equals(
      Set.of(
        Coordinate(1, 2),
        Coordinate(2, 3),
        Coordinate(4, 2),
        Coordinate(2, 0),
        Coordinate(1, 1),
        Coordinate(3, 1),
        Coordinate(3, 3),
      )
    ));
    assert.equal(libertyCount(board, Coordinate(2, 2)), 7);
  });
});

describe('isLegalMove', () => {
  it('identifies suicide moves as invalid', () => {
    const board = Board(3,
      Move(Coordinate(1, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
    );

    assert.ok(!isLegalMove(board, Move(Coordinate(1, 1), WHITE)));
    assert.ok(!isLegalWhiteMove(board, Coordinate(1, 1)));
  });

  it('allows filling in a ponnuki', () => {
    const board = Board(3,
      Move(Coordinate(1, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
    );

    assert.ok(isLegalMove(board, Move(Coordinate(1, 1), BLACK)));
    assert.ok(isLegalBlackMove(board, Coordinate(1, 1)));
  });

  it('marks suicide in corner as invalid', () => {
    const board = Board(3,
      Move(Coordinate(2, 0), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
    );

    assert.ok(!isLegalMove(board, Move(Coordinate(2, 2), WHITE)));
  });

  it('marks suicide in corner that kills first as valid', () => {
    const board = Board(3,
      Move(Coordinate(2, 0), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
      Move(Coordinate(1, 0), WHITE),
      Move(Coordinate(1, 1), WHITE),
    );

    assert.ok(isLegalMove(board, Move(Coordinate(2, 2), WHITE)));
  });
});

describe('removeStone', () => {
  it('can remove a specified stone', () => {
    const board = Board(19,
      Move(Coordinate(9, 9), BLACK),
    );

    const updatedBoard = removeStone(board, Coordinate(9,9));

    assert.equal(
      updatedBoard.moves.get(Coordinate(9, 9)),
      EMPTY,
    );
  });

  it('does not blow up even if a coordinate is not there', () => {
    const board = Board();

    const updatedBoard = removeStone(board, Coordinate(9,9));

    assert.equal(
      updatedBoard.moves.get(Coordinate(9, 9)),
      EMPTY,
    );
  });
});

describe('removeStones', () => {
  it('can remove a bunch of stones', () => {
    const board = Board(19,
      Move(Coordinate(9, 9), BLACK),
      Move(Coordinate(3, 4), WHITE),
      Move(Coordinate(9, 10), BLACK),
      Move(Coordinate(5, 9), WHITE),
      Move(Coordinate(3, 9), BLACK),
    );

    const updatedBoard = removeStones(
      board,
      Set.of(
        Coordinate(9, 9),
        Coordinate(3, 9),
        Coordinate(5, 9),
      ),
    );

    assert.equal(updatedBoard.moves.get(Coordinate(9, 9)), EMPTY);
    assert.equal(updatedBoard.moves.get(Coordinate(3, 9)), EMPTY);
    assert.equal(updatedBoard.moves.get(Coordinate(5, 9)), EMPTY);

    assert.equal(updatedBoard.moves.get(Coordinate(3, 4)), WHITE);
    assert.equal(updatedBoard.moves.get(Coordinate(9, 10)), BLACK);
  });
});

describe('addMove', () => {
  it('adds a Move to simple empty board', () => {
    const board = Board();

    assert.equal(
      addMove(board, Move(Coordinate(9, 9), BLACK))
        .moves
        .get(Coordinate(9, 9)),
      BLACK
    );
  });

  it('adds a move to simple empty board', () => {
    const board = Board();

    assert.equal(
      addMove(board, Move(Coordinate(9, 9), BLACK))
        .moves
        .get(Coordinate(9, 9)),
      BLACK
    );
  });

  it('throws if move is illegal', () => {
    assert.throws(() => {
      addMove(Board(5), Move(Coordinate(9, 9), BLACK));
    });
  });

  it('throws if adding same move twice', () => {
    const board = Board();

    assert.throws(() => {
      const coordinate = Coordinate(9, 9);

      addMove(
        addMove(board, Move(coordinate, BLACK)),
        Move(coordinate, WHITE),
      );
    });
  });

  it('kills groups that run out of liberties', () => {
    const board = Board(3,
      Move(Coordinate(1, 0), WHITE),
      Move(Coordinate(1, 1), WHITE),
      Move(Coordinate(2, 0), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
    );

    const newBoard = addMove(board, Move(Coordinate(2, 2), WHITE));

    assert.ok(
      Set.of(
        Coordinate(1, 0),
        Coordinate(1, 1),
        Coordinate(2, 2),
        Coordinate(1, 2),
      ).equals(Set(newBoard.moves.keys()))
    );
  });

  it('can kill 3 stone groups', () => {
    const board = Board(5,
      Move(Coordinate(0, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(0, 2), BLACK),
      Move(Coordinate(1, 0), WHITE),
      Move(Coordinate(1, 1), WHITE),
      Move(Coordinate(1, 2), WHITE),
      Move(Coordinate(2, 0), BLACK),
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(2, 2), BLACK),
    );

    const newBoard = addMove(board, Move(Coordinate(1, 3), BLACK));

    assert.ok(
      Set.of(
        Coordinate(0, 0),
        Coordinate(0, 1),
        Coordinate(0, 2),
        Coordinate(2, 0),
        Coordinate(2, 1),
        Coordinate(2, 2),
        Coordinate(1, 3),
      ).equals(Set(newBoard.moves.keys()))
    );
  });
});

describe('placeStone', () => {
  it('can place a stone on an empty board', () => {
    const board = Board();

    assert.equal(
      placeStone(board, Coordinate(9, 9), BLACK).moves.get(Coordinate(9, 9)),
      BLACK
    );
  });

  it('throws if placing onto a coordinate with opposite stone color', () => {
    const board = Board();

    assert.throws(() => {
      const coordinate = Coordinate(9, 9);

      placeStone(
        placeStone(board, coordinate, BLACK),
        coordinate,
        WHITE,
      );
    });
  });

  it('can force an existing opposite color stone placement', () => {
    const board = Board();
    const coordinate = Coordinate(9, 9);

    const blackStoneBoard = placeStone(board, coordinate, BLACK);
    const whiteStoneBoard = placeStone(
      blackStoneBoard, coordinate, WHITE, true,
    );

    assert.equal(whiteStoneBoard.moves.get(coordinate), WHITE);
  });

  it('can place a stone that breaks the rules', () => {
    const board = Board(5,
      Move(Coordinate(2, 1), BLACK),
      Move(Coordinate(2, 3), BLACK),
      Move(Coordinate(1, 2), BLACK),
      Move(Coordinate(3, 2), BLACK),
    );
    const coordinate = Coordinate(2, 2);

    const newBoard = placeStone(board, coordinate, WHITE);

    assert.equal(newBoard.moves.get(coordinate), WHITE);
  });
});

describe('placeStones', () => {
  it('can place a bunch of stones', () => {
    const coordinates = Set.of(
      Coordinate(2, 1),
      Coordinate(2, 3),
      Coordinate(1, 2),
      Coordinate(3, 2),
    );
    const board = placeStones(Board(), coordinates, BLACK);

    assert.ok(
      Set.of(
        Coordinate(2, 1),
        Coordinate(2, 3),
        Coordinate(1, 2),
        Coordinate(3, 2),
      ).equals(
        Set(board.moves.keys())
      )
    );
  });
});

describe('toAsciiBoard', () => {
  it('can produce a simple empty board', () => {
    assert.equal(
      toAsciiBoard(Board(3)),
      '+++\n' +
      '+++\n' +
      '+++\n'
    );
  });

  it('can produce a board with one white move', () => {
    assert.equal(
      toAsciiBoard(Board(3,
        Move(Coordinate(1, 1), WHITE),
      )),
      '+++\n' +
      '+X+\n' +
      '+++\n'
    );
  });

  it('can produce a board with one black move', () => {
    assert.equal(
      toAsciiBoard(Board(3,
        Move(Coordinate(1, 1), BLACK),
      )),
      '+++\n' +
      '+O+\n' +
      '+++\n'
    );
  });
});

describe('toString', () => {
  it('can produce a board with overrides', () => {
    assert.equal(
      toString(
        Board(3,
          Move(Coordinate(1, 1), BLACK),
          Move(Coordinate(1, 2), WHITE),
        ),
        {[BLACK]: 'Q'},
      ),
      '+++\n' +
      '+QX\n' +
      '+++\n'
    );
  });
});

describe('constructBoard', () => {
  it('can be created with a board passed', () => {
    constructBoard([Coordinate(9, 9)], Board());
  });

  it('can add a single stone', () => {
    const board = constructBoard([
      Coordinate(9, 9)
    ]);

    assert.ok(
      Set.of(
        Coordinate(9, 9),
      ).equals(
        Set(board.moves.keys())
      )
    );
  });

  it('can kill a stone', () => {
    const stoneToKill = Coordinate(8, 9);
    const board = constructBoard([
      Coordinate(9, 9),
      Coordinate(9, 10),
      Coordinate(8, 10),
      stoneToKill,
      Coordinate(8, 8),
      Coordinate(9, 8),
      Coordinate(7, 9),
    ]);

    assert.ok(
      Set.of(
        Coordinate(9, 9),
        Coordinate(9, 10),
        Coordinate(8, 10),
        Coordinate(8, 8),
        Coordinate(9, 8),
        Coordinate(7, 9),
      ).equals(
        Set(board.moves.keys())
      )
    );
  });

  it('can kill a stone without actual Coordinate', () => {
    const stoneToKill = {x: 8, y: 9};
    const board = constructBoard([
      {x: 9, y: 9},
      {x: 9, y: 10},
      {x: 8, y: 10},
      stoneToKill,
      {x: 8, y: 8},
      {x: 9, y: 8},
      {x: 7, y: 9},
    ]);

    assert.ok(
      Set.of(
        Coordinate(9, 9),
        Coordinate(9, 10),
        Coordinate(8, 10),
        Coordinate(8, 8),
        Coordinate(9, 8),
        Coordinate(7, 9),
      ).equals(
        Set(board.moves.keys())
      )
    );
  });

  it('throws when coordinates are not parseable', () => {
    assert.throws(() => {
      constructBoard([
        Coordinate(9, 9),
        Coordinate(9, 10),
        {x: 5},
      ]);
    });

  });
});

describe('difference', () => {
  it('can produce a simple difference', () => {
    const board1 = Board(5,
      Move(Coordinate(3, 2), BLACK),
      Move(Coordinate(4, 2), BLACK),
    );

    const board2 = Board(5,
      Move(Coordinate(2, 2), BLACK),
    );

    assert.ok(
      difference(board1, board2)
        .equals(Set.of(
          List.of(Coordinate(3, 2), BLACK),
          List.of(Coordinate(4, 2), BLACK),
        ))
    );
  });

  it('throws when board sizes are different', () => {
    assert.throws(() => {
      difference(Board(5), Board(10));
    });
  });

  it('returns empty set when both boards are equal', () => {
    const board1 = Board(5,
      Move(Coordinate(2, 2), BLACK),
    );

    const board2 = Board(5,
      Move(Coordinate(2, 2), BLACK),
    );

    assert.ok(
      difference(board1, board2).equals(Set())
    );
  });

  it('successfully finds the captured stone', () => {
    const atari = Board(3,
      Move(Coordinate(1, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
      Move(Coordinate(1, 1), WHITE),
    );
    const captured = difference(
      atari,
      addMove(atari, Move(Coordinate(2, 1), BLACK))
    );

    assert.ok(
      Set.of(
        List.of(Coordinate(1, 1), WHITE)
      ).equals(captured)
    );
  });
});

describe('followupKo', () => {
  it('can detect ko with Move parameter', () => {
    const koPosition = Board(4,
      Move(Coordinate(1, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
      Move(Coordinate(1, 1), WHITE),
      Move(Coordinate(2, 0), WHITE),
      Move(Coordinate(2, 2), WHITE),
      Move(Coordinate(3, 1), WHITE),
    );
    const koStart = Coordinate(2, 1);

    assert.ok(
      (Coordinate(1, 1)).equals(
        followupKo(koPosition, Move(koStart, BLACK))
      )
    );
  });

  it('can detect ko', () => {
    const koPosition = Board(4,
      Move(Coordinate(1, 0), BLACK),
      Move(Coordinate(0, 1), BLACK),
      Move(Coordinate(1, 2), BLACK),
      Move(Coordinate(1, 1), WHITE),
      Move(Coordinate(2, 0), WHITE),
      Move(Coordinate(2, 2), WHITE),
      Move(Coordinate(3, 1), WHITE),
    );
    const koStart = Coordinate(2, 1);

    assert.ok(
      (Coordinate(1, 1)).equals(
        followupKo(koPosition, Move(koStart, BLACK))
      )
    );
  });

  it('returns null when the move is purely additive', () => {
    assert.ok(
      followupKo(Board(3), Move(Coordinate(1, 1), BLACK)) === null
    );
  });

  it('returns null when the move is out of bounds', () => {
    assert.ok(
      followupKo(Board(3), Move(Coordinate(10, 10), BLACK)) === null
    );
  });

  it('returns null when snapback happens', () => {
    // x++++
    // ox+++
    // ox+++
    // +o+++
    // o++++
    const board = placeStones(
      placeStones(
        Board(5),
        [
          Coordinate(0, 0),
          Coordinate(1, 1),
          Coordinate(1, 2),
        ],
        BLACK,
      ),
      [
        Coordinate(0, 1),
        Coordinate(0, 2),
        Coordinate(1, 3),
        Coordinate(0, 4),
      ],
      WHITE,
    );

    const captureCoordinate = Coordinate(0, 3);

    assert.ok(
      followupKo(board, Move(captureCoordinate, BLACK)) === null
    );
  });

  it('returns null when move gets snapped back', () => {
    // ox+++
    // +o+++
    // xo+++
    // o++++
    // +++++
    const board = placeStones(
      placeStones(
        Board(5),
        [
          Coordinate(0, 1),
          Coordinate(2, 0),
        ],
        BLACK,
      ),
      [
        Coordinate(0, 0),
        Coordinate(1, 1),
        Coordinate(2, 1),
        Coordinate(3, 0),
      ],
      WHITE,
    );

    const captureCoordinate = Coordinate(1, 0);

    assert.ok(
      followupKo(board, Move(captureCoordinate, BLACK)) === null
    );
  });

  it('returns null recapture move is illegal', () => {
    // x++++
    // ox+++
    // +++++
    // +++++
    // +++++
    const board = placeStones(
      placeStones(
        Board(5),
        [
          Coordinate(0, 0),
          Coordinate(1, 1),
        ],
        BLACK,
      ),
      [
        Coordinate(0, 1),
      ],
      WHITE,
    );

    const captureCoordinate = Coordinate(0, 2);

    assert.ok(
      followupKo(board, Move(captureCoordinate, BLACK)) === null
    );
  });
});

describe('Move', () => {
  it('can be instantiated', () => {
    Move(Coordinate(), BLACK);
  });
});

describe('handicapBoard', () => {
  it('disallows non 9, 13, 19 board sizes', () => {
    assert.throws(() => {
      handicapBoard(10, 5);
    });
  });

  it('disallows very high handicaps', () => {
    assert.throws(() => {
      handicapBoard(9, 15);
    });
  });

  it('can create various handicap boards', () => {
    const oneToNine = Array(9).fill(0).map((_, i) => i + 1);
    for (const size of [9, 13, 19]) {
      for (const handicaps of oneToNine) {
        assert.ok(Boolean(handicapBoard(size, handicaps)));
      }
    }
  });
});
