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
} from './board';

describe('Board constructor', function() {
  it('can take move pairs as parameters', function() {
    const board = new Board(
      19,
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 5), WHITE],
    );

    assert.ok(board.moves.has(new Coordinate(2, 2)));
    assert.ok(board.moves.has(new Coordinate(2, 5)));
    assert.ok(board.moves.get(new Coordinate(2, 2)) === BLACK);
    assert.ok(board.moves.get(new Coordinate(2, 5)) === WHITE);
  });

  it('can take Move as parameters', function() {
    const board = new Board(
      19,
      new Move(new Coordinate(2, 2), BLACK),
      new Move(new Coordinate(2, 5), WHITE),
    );

    assert.ok(board.moves.has(new Coordinate(2, 2)));
    assert.ok(board.moves.has(new Coordinate(2, 5)));
    assert.ok(board.moves.get(new Coordinate(2, 2)) === BLACK);
    assert.ok(board.moves.get(new Coordinate(2, 5)) === WHITE);
  });

  it('can take Move and pairs as parameters', function() {
    const board = new Board(
      19,
      new Move(new Coordinate(2, 2), BLACK),
      [new Coordinate(2, 5), WHITE],
    );

    assert.ok(board.moves.has(new Coordinate(2, 2)));
    assert.ok(board.moves.has(new Coordinate(2, 5)));
    assert.ok(board.moves.get(new Coordinate(2, 2)) === BLACK);
    assert.ok(board.moves.get(new Coordinate(2, 5)) === WHITE);
  });

  it('does not tolerate invalid parameters', function() {
    assert.throws(function() {
      new Board(
        19,
        'bad time',
      );
    });
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
    [new Coordinate(9, 8), BLACK],
    [new Coordinate(9, 10), WHITE],
    [new Coordinate(8, 9), WHITE],
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
      [new Coordinate(2, 2), BLACK],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), BLACK],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), WHITE],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
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
      [new Coordinate(2, 2), BLACK],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), BLACK],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), WHITE],
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
      [new Coordinate(2, 2), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(3, 2), BLACK],
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
      [new Coordinate(1, 0), BLACK],
      [new Coordinate(0, 1), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
    );

    assert.ok(!isLegalMove(board, new Coordinate(1, 1), WHITE));
    assert.ok(!isLegalWhiteMove(board, new Coordinate(1, 1)));
  });

  it('allows filling in a ponnuki', function() {
    const board = new Board(3,
      [new Coordinate(1, 0), BLACK],
      [new Coordinate(0, 1), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
    );

    assert.ok(isLegalMove(board, new Coordinate(1, 1), BLACK));
    assert.ok(isLegalBlackMove(board, new Coordinate(1, 1)));
  });

  it('marks suicide in corner as invalid', function() {
    const board = new Board(3,
      [new Coordinate(2, 0), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
    );

    assert.ok(!isLegalMove(board, new Coordinate(2, 2), WHITE));
  });

  it('marks suicide in corner that kills first as valid', function() {
    const board = new Board(3,
      [new Coordinate(2, 0), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
      [new Coordinate(1, 0), WHITE],
      [new Coordinate(1, 1), WHITE],
    );

    assert.ok(isLegalMove(board, new Coordinate(2, 2), WHITE));
  });
});

describe('removeStone', function() {
  it('can remove a specified stone', function() {
    const board = new Board(19,
      [new Coordinate(9, 9), BLACK],
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
      [new Coordinate(9, 9), BLACK],
      [new Coordinate(3, 4), WHITE],
      [new Coordinate(9, 10), BLACK],
      [new Coordinate(5, 9), WHITE],
      [new Coordinate(3, 9), BLACK],
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

  it('throws if move is illegal', function() {
    assert.throws(function() {
      addMove(new Board(5), new Coordinate(9, 9), BLACK);
    });
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
      [new Coordinate(1, 0), WHITE],
      [new Coordinate(1, 1), WHITE],
      [new Coordinate(2, 0), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
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
      [new Coordinate(0, 0), BLACK],
      [new Coordinate(0, 1), BLACK],
      [new Coordinate(0, 2), BLACK],
      [new Coordinate(1, 0), WHITE],
      [new Coordinate(1, 1), WHITE],
      [new Coordinate(1, 2), WHITE],
      [new Coordinate(2, 0), BLACK],
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(2, 2), BLACK],
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
      [new Coordinate(2, 1), BLACK],
      [new Coordinate(2, 3), BLACK],
      [new Coordinate(1, 2), BLACK],
      [new Coordinate(3, 2), BLACK],
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

  it('can produce a board with one white move', function() {
    assert.equal(
      toAsciiBoard(new Board(3,
        [new Coordinate(1, 1), WHITE],
      )),
      '+++\n' +
      '+X+\n' +
      '+++\n'
    );
  });

  it('can produce a board with one black move', function() {
    assert.equal(
      toAsciiBoard(new Board(3,
        [new Coordinate(1, 1), BLACK],
      )),
      '+++\n' +
      '+O+\n' +
      '+++\n'
    );
  });
});

describe('constructBoard', function() {
  it('can be created with a board passed', function() {
    constructBoard([new Coordinate(9, 9)], new Board());
  });

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

  it('can kill a stone without actual Coordinate', function() {
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

  it('throws when coordinates are not parseable', function() {
    assert.throws(function() {
      constructBoard([
        new Coordinate(9, 9),
        new Coordinate(9, 10),
        {x: 5},
      ]);
    });

  });
});

describe('difference', function() {
  it('can produce a simple difference', function() {
    const board1 = new Board(5,
      [new Coordinate(3, 2), BLACK],
      [new Coordinate(4, 2), BLACK],
    );

    const board2 = new Board(5,
      [new Coordinate(2, 2), BLACK],
    );

    assert.ok(
      difference(board1, board2)
        .equals(Set.of(
          List.of(new Coordinate(3, 2), BLACK),
          List.of(new Coordinate(4, 2), BLACK),
        ))
    );
  });

  it('throws when board sizes are different', function() {
    assert.throws(function() {
      difference(new Board(5), new Board(10));
    });
  });

  it('returns empty set when both boards are equal', function() {
    const board1 = new Board(5,
      [new Coordinate(2, 2), BLACK],
    );

    const board2 = new Board(5,
      [new Coordinate(2, 2), BLACK],
    );

    assert.ok(
      difference(board1, board2).equals(Set())
    );
  });

  it('successfully finds the captured stone', function() {
    const atari = new Board(3,
      [new Coordinate(1, 0), BLACK],
      [new Coordinate(0, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
      [new Coordinate(1, 1), WHITE],
    );
    const captured = difference(
      atari,
      addMove(atari, new Coordinate(2, 1), BLACK)
    );

    assert.ok(
      Set.of(
        List.of(new Coordinate(1, 1), WHITE)
      ).equals(captured)
    );
  });
});

describe('followupKo', function() {
  it('can detect ko', function() {
    const koPosition = new Board(4,
      [new Coordinate(1, 0), BLACK],
      [new Coordinate(0, 1), BLACK],
      [new Coordinate(1, 2), BLACK],
      [new Coordinate(1, 1), WHITE],
      [new Coordinate(2, 0), WHITE],
      [new Coordinate(2, 2), WHITE],
      [new Coordinate(3, 1), WHITE],
    );
    const koStart = new Coordinate(2, 1);

    assert.ok(
      (new Coordinate(1, 1)).equals(
        followupKo(koPosition, koStart, BLACK)
      )
    );
  });

  it('returns null when the move is purely additive', function() {
    assert.ok(
      followupKo(new Board(3), new Coordinate(1, 1), BLACK) === null
    );
  });

  it('returns null when the new move is out of bounds', function() {
    assert.ok(
      followupKo(new Board(3), new Coordinate(10, 10), BLACK) === null
    );
  });

  it('returns null when snapback happens', function() {
    // x++++
    // ox+++
    // ox+++
    // +o+++
    // o++++
    const board = placeStones(
      placeStones(
        new Board(5),
        [
          new Coordinate(0, 0),
          new Coordinate(1, 1),
          new Coordinate(1, 2),
        ],
        BLACK,
      ),
      [
        new Coordinate(0, 1),
        new Coordinate(0, 2),
        new Coordinate(1, 3),
        new Coordinate(0, 4),
      ],
      WHITE,
    );

    const captureCoordinate = new Coordinate(0, 3);

    assert.ok(
      followupKo(board, captureCoordinate, BLACK) === null
    );
  });

  it('returns null when move gets snapped back', function() {
    // ox+++
    // +o+++
    // xo+++
    // o++++
    // +++++
    const board = placeStones(
      placeStones(
        new Board(5),
        [
          new Coordinate(0, 1),
          new Coordinate(2, 0),
        ],
        BLACK,
      ),
      [
        new Coordinate(0, 0),
        new Coordinate(1, 1),
        new Coordinate(2, 1),
        new Coordinate(3, 0),
      ],
      WHITE,
    );

    const captureCoordinate = new Coordinate(1, 0);

    assert.ok(
      followupKo(board, captureCoordinate, BLACK) === null
    );
  });

  it('returns null recapture move is illegal', function() {
    // x++++
    // ox+++
    // +++++
    // +++++
    // +++++
    const board = placeStones(
      placeStones(
        new Board(5),
        [
          new Coordinate(0, 0),
          new Coordinate(1, 1),
        ],
        BLACK,
      ),
      [
        new Coordinate(0, 1),
      ],
      WHITE,
    );

    const captureCoordinate = new Coordinate(0, 2);

    assert.ok(
      followupKo(board, captureCoordinate, BLACK) === null
    );
  });
});

describe('Move', function() {
  it('can be instantiated', function() {
    new Move(new Coordinate(), BLACK);
  });
});

describe('handicapBoard', function() {
  it('disallows non 9, 13, 19 board sizes', function() {
    assert.throws(function() {
      handicapBoard(10, 5);
    });
  });

  it('disallows very high handicaps', function() {
    assert.throws(function() {
      handicapBoard(9, 15);
    });
  });

  it('can create various handicap boards', function() {
    const oneToNine = Array(9).fill(0).map((_, i) => i + 1);
    for (const size of [9, 13, 19]) {
      for (const handicaps of oneToNine) {
        assert.ok(Boolean(handicapBoard(size, handicaps)));
      }
    }
  });
});
