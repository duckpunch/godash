/**
 * Utilities for an immutable Board object.
 *
 * @module Board
 */

/**
 * @external Record
 * @see https://immutable-js.github.io/immutable-js/docs/#/Record
 */

/**
 * @external Set
 */
import {
  Set,
  Map,
  List,
  Record,
} from 'immutable';
import {
  concat,
  flatMap,
  inRange,
  isInteger,
  take,
  hasIn,
} from 'lodash';

/**
 * The color black.
 *
 * @type {string}
 */
export const BLACK = 'black';

/**
 * The color white.
 *
 * @type {string}
 */
export const WHITE = 'white';

/** An empty space. */
export const EMPTY = null;

/**
 * ```javascript
 * godash.Board(dimensions = 19, ...moves)
 * ```
 *
 * Representation of a board position.
 *
 * Extends [`Immutable.Record`][imm-record].
 *
 * [imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record
 *
 * !!! tldr "Constructor Arguments"
 *     * `dimensions` `(number)` - Size of the board, defaulted to 19.
 *     * `...moves` `(Move)` - Moves to be placed on the board.
 *
 * !!! tldr "Properties"
 *     * `dimensions` `(number)` - Size of the board.
 *     * `moves` [`(Immutable.Map)`][imm-map] - Stones present on this board.
 *     [`Coordinate`](#coordinate) keys with either [`BLACK`](#black) or
 *     [`WHITE`](#white) values.
 *
 * [imm-map]: https://immutable-js.github.io/immutable-js/docs/#/Map
 *
 * ??? example "Examples"
 *     ```javascript
 *     var board = Board();
 *
 *     board.toString();
 *     // => Board { "dimensions": 19, "moves": Map {} }
 *     ```
 *
 *     ```javascript
 *     var smallBoard = Board(5, Move(Coordinate(2, 2), BLACK));
 *
 *     smallBoard.toString();
 *     // => Board { "dimensions": 5, "moves": Map { {"x":2,"y":2}: "black" } }
 *     ```
 *
 *     ```javascript
 *     var smallBoard = Board(5, Move(Coordinate(2, 2), BLACK));
 *
 *     smallBoard.toString();
 *     // => Board { "dimensions": 5, "moves": Map { {"x":2,"y":2}: "black" } }
 *     ```
 *
 * @extends Record
 */
class _Board extends Record({dimensions: 19, moves: Map()}, 'Board') {
  constructor(dimensions = 19, ...moves) {
    super({
      dimensions,
      moves: Map.of(...flatMap(
        moves.map(move => [move.coordinate, move.color])
      )),
    });
  }

  toMap() {
    return Array(this.dimensions).fill(EMPTY).map(
      (_, row) => Array(this.dimensions).fill(EMPTY).map(
        (_, col) => this.moves.get(Coordinate(col, row), EMPTY)
      )
    );
  }
}

export function Board(...args) {
  return Reflect.construct(_Board, args);
}
Board.prototype = _Board.prototype;

/**
 * ```javascript
 * godash.Coordinate(x, y)
 * ```
 *
 * A zero-based tuple representing a single location on a Go board.
 *
 * Extends [`Immutable.Record`][imm-record].
 *
 * [imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record
 *
 * !!! tldr "Constructor Arguments"
 *     * `x` `(number)` - Location on the X-axis.
 *     * `y` `(number)` - Location on the Y-axis.
 *
 * !!! tldr "Properties"
 *     * `x` `(number)` - Location on the X-axis.
 *     * `y` `(number)` - Location on the Y-axis.
 *
 * ??? example "Examples"
 *     ```javascript
 *     var tengen = Coordinate(9, 9);
 *
 *     tengen.toString();
 *     // => Coordinate { "x": 9, "y": 9 }
 *
 *     tengen.x;
 *     // => 9
 *     ```
 *
 * @extends Record
 */
class _Coordinate extends Record({x: 0, y: 0}, 'Coordinate') {
  constructor(x, y) {
    super({x, y});
  }
}

export function Coordinate(...args) {
  return Reflect.construct(_Coordinate, args);
}
Coordinate.prototype = _Coordinate.prototype;

/**
 * ```javascript
 * godash.Move(coordinate, color)
 * ```
 *
 * Representation of a move, composed of a [`Coordinate`](#coordinate) and a
 * color.
 *
 * Extends [`Immutable.Record`][imm-record].
 *
 * [imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record
 *
 * !!! tldr "Constructor Arguments"
 *     * `coordinate` ([`Coordinate`](#coordinate)) - Location of the move.
 *     * `color` `(string)` - [`BLACK`](#black), [`WHITE`](#white), or
 *     [`EMPTY`](#empty).
 *
 * !!! tldr "Properties"
 *     * `coordinate` ([`Coordinate`](#coordinate)) - Location of the move.
 *     * `color` `(string)` - [`BLACK`](#black), [`WHITE`](#white), or
 *     [`EMPTY`](#empty).
 *
 * ??? example "Examples"
 *     ```javascript
 *     var tengen = Move(Coordinate(9, 9), BLACK);
 *     ```
 *
 * @extends Record
 */
class _Move extends Record({coordinate: Coordinate(), color: EMPTY}, 'Move') {
  constructor(coordinate, color) {
    super({coordinate, color});
  }
}

export function Move(...args) {
  return Reflect.construct(_Move, args);
}
Move.prototype = _Move.prototype;

/**
 * Center point on a 9x9 board.
 *
 * @type {Coordinate}
 */
export const TENGEN_9 = Coordinate(4, 4);

/**
 * Center point on a 13x13 board.
 *
 * @type {Coordinate}
 */
export const TENGEN_13 = Coordinate(6, 6);

/**
 * Center point on a 19x19 board.
 *
 * @type {Coordinate}
 */
export const TENGEN_19 = Coordinate(9, 9);

export function adjacentCoordinates(board, coordinate) {
  const {x, y} = coordinate;
  const validRange = n => inRange(n, board.dimensions);

  return Set.of(
    Coordinate(x, y + 1),
    Coordinate(x, y - 1),
    Coordinate(x + 1, y),
    Coordinate(x - 1, y),
  ).filter(c => validRange(c.x) && validRange(c.y));
}

/**
 * Finds the moves on the first board that are not on the second board.
 *
 * @example
 * var atari = Board(3,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(1, 1), WHITE),
 * );
 *
 * toAsciiBoard(atari);
 * // => +O+
 * //    OXO
 * //    +++
 *
 * var captured = difference(
 *     atari, addMove(atari, Move(Coordinate(2, 1), BLACK))
 * );
 *
 * captured.toString();
 * // 'Set { List [ Coordinate { "x": 1, "y": 1 }, "white" ] }'
 *
 * @param {Board} board1 - First board.
 * @param {Board} board2 - Board with moves to subtract from first board.
 * @returns {Set} Set containing pairs of `Coordinate` and color remaining in
 * the difference.
 */
export function difference(board1, board2) {
  if (board1.dimensions !== board2.dimensions) {
    throw new Error('board sizes do not match');
  }

  const board1Set = Set(board1.moves.entrySeq().map(a => List(a)));
  const board2Set = Set(board2.moves.entrySeq().map(a => List(a)));

  return board1Set.subtract(board2Set);
}

/**
 * Determines move that would be illegal under the [ko
 * rule](https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko)
 *
 * @example
 * const koPosition = Board(4,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(1, 1), WHITE),
 *     Move(Coordinate(2, 0), WHITE),
 *     Move(Coordinate(2, 2), WHITE),
 *     Move(Coordinate(3, 1), WHITE),
 * );
 *
 * toAsciiBoard(koPosition);
 * // => +O++
 * //    OXO+
 * //    X+X+
 * //    +X++
 *
 * const koStart = Coordinate(2, 1);
 *
 * followupKo(koPosition, koStart, BLACK).toString();
 * // => 'Coordinate { "x": 1, "y": 1 }'
 *
 * @param {Board} board - Starting board.
 * @param {Move} move - Intended `Move`.
 * @returns {Coordinate} Position of illegal followup or `null` if
 * none exists.
 */
export function followupKo(board, move) {
  if (!isLegalMove(board, move)) {
    return null;
  }

  const postMoveBoard = addMove(board, move);
  const capturedStones = difference(board, postMoveBoard);

  if (capturedStones.size === 0 || capturedStones.size > 1) {
    return null;
  }

  const capturedMove = capturedStones.first();
  const capturedCoordinate = capturedMove.get(0);
  const capturedColor = capturedMove.get(1);

  // The situation is ko if the board returns to the original state.

  if (isLegalMove(postMoveBoard, Move(capturedCoordinate, capturedColor))) {
    if (board.equals(
      addMove(postMoveBoard, Move(capturedCoordinate, capturedColor))
    )) {
      return capturedCoordinate;
    }
  }

  return null;
}

export function matchingAdjacentCoordinates(board, coordinate, color) {
  const colorToMatch = color === undefined ?
    board.moves.get(coordinate, EMPTY) : color;

  return adjacentCoordinates(board, coordinate)
    .filter(c => board.moves.get(c, EMPTY) === colorToMatch);
}

/**
 * Finds the set of coordinates which identifies the fully connected group for
 * the given location.
 *
 * @example
 * var board = Board(3,
 *     Move(Coordinate(1, 0), WHITE),
 *     Move(Coordinate(0, 2), WHITE),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(2, 2), BLACK),
 *     Move(Coordinate(2, 1), BLACK),
 * );
 *
 * toAsciiBoard(board);
 * // => ++X
 * //    X+O
 * //    +OO
 *
 * group(board, Coordinate(2, 1)).toString();
 * // => Set {
 * //      Coordinate { "x": 2, "y": 1 },
 * //      Coordinate { "x": 2, "y": 2 },
 * //      Coordinate { "x": 1, "y": 2 }
 * //    }
 *
 * @param {Board} board - Board to inspect.
 * @param {Coordinate} coordinate - Location to inspect.
 * @returns {Set} Containing `Coordinate` for the members of the group.
 */
export function group(board, coordinate) {
  let found = Set();
  let queue = Set.of(coordinate);

  while (!queue.isEmpty()) {
    const current = queue.first();
    const more_matching = matchingAdjacentCoordinates(board, current);

    found = found.add(current);
    queue = queue.rest().union(more_matching.subtract(found));
  }

  return found;
}

/**
 * Toggles the passed color.
 *
 * @example
 * oppositeColor(BLACK) === WHITE
 * // => true
 *
 * oppositeColor(WHITE) === BLACK
 * // => true
 *
 * @param {string} color - `godash.BLACK` or `godash.WHITE`
 * @return {string} Color opposite of the one provided.
 */
export function oppositeColor(color) {
  if (color === BLACK) {
    return WHITE;
  } else if (color === WHITE) {
    return BLACK;
  } else {
    return EMPTY;
  }
}

/**
 * Finds the set of all liberties for the given coordinate.  If the coordinate
 * is part of a group, the set of liberties are the liberties for that group.
 *
 * @example
 * var board = Board(3, Move(Coordinate(1, 1), BLACK));
 * var collectedLiberties = liberties(board, Coordinate(1, 1));
 *
 * Immutable.Set.of(
 *     Coordinate(1, 0),
 *     Coordinate(0, 1),
 *     Coordinate(1, 2),
 *     Coordinate(2, 1)
 * ).equals(collectedLiberties);
 * // => true
 *
 * @param {Board} board - Board to inspect.
 * @param {Coordinate} coordinate - Coordinate to inspect.
 * @return {Set} Containing `Coordinate` members for the liberties of the
 * passed coordinate.
 */
export function liberties(board, coordinate) {
  return group(board, coordinate).reduce(
    (acc, coord) => acc.union(
      matchingAdjacentCoordinates(board, coord, EMPTY),
    ),
    Set(),
  );
}

/**
 * Counts the liberties for the given coordinate.  If the coordinate is part of
 * a group, liberties for the entire group is counted.
 *
 * @example
 * var board = Board(3, Coordinate(1, 1), BLACK);
 *
 * libertyCount(board, Coordinate(1, 1)) === 4;
 * // => true
 *
 * @param {Board} board - Board to inspect.
 * @param {Coordinate} coordinate - Coordinate to inspect.
 * @return {number} Count of liberties for the coordinate on the board.
 */
export function libertyCount(board, coordinate) {
  return liberties(board, coordinate).size;
}

/**
 * Determine whether the coordinate-color combination provided is a legal move
 * for the board.  [Ko][ko-rule] is not considered.  Use `followupKo` if you
 * want to do [ko][ko-rule]-related things.
 *
 * [ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko
 *
 * @example
 * var ponnuki = Board(3,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(2, 1), BLACK),
 * );
 *
 * toAsciiBoard(ponnuki);
 * // => +O+
 * //    O+O
 * //    +O+
 *
 * isLegalMove(ponnuki, Move(Coordinate(1, 1), BLACK))
 * // => true
 *
 * isLegalMove(ponnuki, Move(Coordinate(1, 1), WHITE))
 * // => false
 *
 * @param {Board} board - Board to inspect.
 * @param {Move} move - Move to check.
 * @return {boolean} Whether the move is legal.
 */
export function isLegalMove(board, move) {
  const willHaveLiberties = libertyCount(
    board.setIn(['moves', move.coordinate], move.color),
    move.coordinate,
  ) > 0;

  const willKillSomething = matchingAdjacentCoordinates(
    board, move.coordinate, oppositeColor(move.color)
  ).some(coord => libertyCount(board, coord) === 1);

  return willHaveLiberties || willKillSomething;
}

/**
 * Partial application of `isLegalMove`, fixing the color to `BLACK`.
 *
 * @param {Board} board - Board to inspect.
 * @param {Coordinate} coordinate - Location to check.
 * @return {boolean} Whether the move is legal.
 */
export function isLegalBlackMove(board, coordinate) {
  return isLegalMove(board, Move(coordinate, BLACK));
}

/**
 * Partial application of `isLegalMove`, fixing the color to `WHITE`.
 *
 * @param {Board} board - Board to inspect.
 * @param {Coordinate} coordinate - Location to check.
 * @return {boolean} Whether the move is legal.
 */
export function isLegalWhiteMove(board, coordinate) {
  return isLegalMove(board, Move(coordinate, WHITE));
}

/**
 * Make a given coordinate empty on the board.
 *
 * @example
 * var board = Board(3, Move(Coordinate(1, 1), WHITE));
 *
 * toAsciiBoard(board);
 * // => +++
 * //    +X+
 * //    +++
 *
 * toAsciiBoard(
 *     removeStone(board, Coordinate(1, 1))
 * );
 * // => +++
 * //    +++
 * //    +++
 *
 * @param {Board} board - Board from which to remove the stone.
 * @param {Coordinate} coordinate - Location of the stone.
 * @return {Board} New board with the stone removed.
 */
export function removeStone(board, coordinate) {
  return board.set('moves', board.moves.delete(coordinate));
}

/**
 * Makes several coordinates empty on the board.
 *
 * @example
 * var board = Board(3,
 *     Move(Coordinate(1, 0), WHITE),
 *     Move(Coordinate(1, 1), WHITE),
 *     Move(Coordinate(1, 2), BLACK),
 * );
 *
 * toAsciiBoard(board);
 * // => +++
 * //    XXO
 * //    +++
 *
 * toAsciiBoard(
 *     removeStones(board, [
 *         Coordinate(1, 1),
 *         Coordinate(1, 2)
 *     ])
 * );
 * // => +++
 * //    X++
 * //    +++
 *
 * @param {Board} board - Board from which to remove the stone.
 * @param {Coordinate} coordinates - Location of the stones.
 * @return {Board} New board with the stones removed.
 */
export function removeStones(board, coordinates) {
  return board.setIn(['moves'],
    coordinates.reduce(
      (acc, coordinate) => acc.delete(coordinate),
      board.moves,
    )
  );
}

/**
 * Function to add a move onto a board while respecting the rules.  Since no
 * sequence information is available, this function does not respect
 * [ko][ko-rule].  Use `followupKo` if you want to do [ko][ko-rule]-related
 * things.
 *
 * [ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko
 *
 * @example
 * var atari = Board(3,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(1, 1), WHITE),
 * );
 *
 * toAsciiBoard(atari);
 * // => +O+
 * //    OXO
 * //    +++
 *
 * var killed = addMove(
 *     atari,
 *     Move(Coordinate(2, 1), BLACK)
 * );
 *
 * toAsciiBoard(killed);
 * // => +O+
 * //    O+O
 * //    +O+
 *
 * @param {Board} board - Board from which to add the move.
 * @param {Move} move - Move or location of the move.
 * @return {Board} New board with the move played.
 */
export function addMove(board, move) {
  if (!isLegalMove(board, move)) {
    throw new Error('Not a valid position');
  }

  if (board.moves.has(move.coordinate)) {
    throw new Error('There is already a stone there');
  }

  const killed = matchingAdjacentCoordinates(
    board, move.coordinate, oppositeColor(move.color)
  ).reduce(
    (acc, coord) => acc.union(
      libertyCount(board, coord) === 1 ? group(board, coord) : Set()
    ),
    Set(),
  );

  return removeStones(board, killed).setIn(
    ['moves', move.coordinate], move.color,
  );
}

/**
 * Places a stone on the board, ignoring the rules of Go.
 *
 * @example
 * var ponnuki = Board(3,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 *     Move(Coordinate(2, 1), BLACK),
 * );
 *
 * toAsciiBoard(ponnuki);
 * // => +O+
 * //    O+O
 * //    +O+
 *
 * toAsciiBoard(
 *     placeStone(ponnuki, Coordinate(1, 1), WHITE)
 * );
 * // => +O+
 * //    OXO
 * //    +O+
 *
 * @param {Board} board - Board to add stone.
 * @param {Coordinate} coordinate - Location to add stone.
 * @param {string} color - Stone color - `BLACK` or `WHITE`.
 * @param {boolean} force - Optionally allow placement over existing stones.
 * @return {Board} New board with the move placed.
 */
export function placeStone(board, coordinate, color, force = false) {
  const currentColor = board.moves.get(coordinate, EMPTY);

  if ((!force) && oppositeColor(currentColor) === color) {
    throw new Error(
      'There is already a stone there.  Pass force=true to override.'
    );
  } else {
    return board.setIn(['moves', coordinate], color);
  }
}

/**
 * Places a set of stones onto the board, ignoring the rules of Go.
 *
 * @example
 * var board = Board(3, Coordinate(1, 1), WHITE);
 *
 * toAsciiBoard(board);
 * // => +++
 * //    +X+
 * //    +++
 *
 * toAsciiBoard(
 *     placeStones(board, [
 *         Coordinate(1, 0),
 *         Coordinate(0, 1),
 *         Coordinate(1, 2),
 *         Coordinate(2, 1)
 *     ], BLACK)
 * );
 * // => +O+
 * //    OXO
 * //    +O+
 *
 * @param {Board} board - Board to add stones.
 * @param {Array} coordinates - Stones to place.
 * @param {string} color - Stone color - `BLACK` or `WHITE`.
 * @param {boolean} force - Optionally allow placement over existing stones.
 * @return {Board} New board with the moves placed.
 */
export function placeStones(board, coordinates, color, force = false) {
  return coordinates.reduce(
    (acc, coordinate) => placeStone(acc, coordinate, color, force),
    board,
  );
}

/**
 * Constructs an ASCII representation of the board.
 *
 * @example
 * var board = Board(3,
 *     Coordinate(1, 0), BLACK,
 *     Coordinate(0, 1), BLACK,
 *     Coordinate(1, 2), BLACK,
 *     Coordinate(1, 1), WHITE
 * );
 *
 * toAsciiBoard(board);
 * // => +O+
 * //    OXO
 * //    +++
 *
 * @param {Board} board - Board to represent.
 * @return {string} ASCII representation of the board.
 */
export function toAsciiBoard(board) {
  return toString(board);
}

/**
 * Constructs a string representation of the board.
 *
 * @example
 * var board = Board(3,
 *     Coordinate(1, 0), BLACK,
 *     Coordinate(0, 1), BLACK,
 *     Coordinate(1, 2), BLACK,
 *     Coordinate(1, 1), WHITE
 * );
 *
 * toString(board, {[BLACK]: 'B', [WHITE]: 'W"});
 * // => +B+
 * //    BWB
 * //    +++
 *
 * @param {Board} board - Board to represent.
 * @param {Object} overrides - Overrides print characters, indexed by color
 * constants.
 * @return {string} String representation of the board.
 */
export function toString(board, overrides = null) {
  const dimensions = board.dimensions;
  const defaultMap = {
    [BLACK]: 'O',
    [WHITE]: 'X',
    [EMPTY]: '+',
  };
  const colorMap = overrides || defaultMap;
  let prettyString = '';

  for (var i = 0; i < dimensions; i++) {
    for (var j = 0; j < dimensions; j++) {
      const color = board.moves.get(Coordinate(i, j), EMPTY);
      prettyString += colorMap[color] || defaultMap[color];
    }
    prettyString += '\n';
  }
  return prettyString;
}

/**
 * Constructs a board for an array of coordinates.  This function iteratively
 * calls `addMove` while alternating colors.
 *
 * @example
 * var tigersMouth = Board(3,
 *     Move(Coordinate(1, 0), BLACK),
 *     Move(Coordinate(0, 1), BLACK),
 *     Move(Coordinate(1, 2), BLACK),
 * );
 *
 * toAsciiBoard(tigersMouth);
 * // => +O+
 * //    O+O
 * //    +++
 *
 * var selfAtari = Coordinate(1, 1);
 * var killingMove = Coordinate(2, 1);
 *
 * var ponnuki = constructBoard(
 *     [selfAtari, killingMove],
 *     tigersMouth,
 *     WHITE
 * );
 *
 * toAsciiBoard(ponnuki);
 * // => +O+
 * //    O+O
 * //    +O+
 *
 * @param {Array} coordinates - Ordered `Coordinate` moves.
 * @param {Board} board - Optional starting board.  Empty 19x19, if omitted.
 * @param {string} startColor - Optional starting color, defaulted to `BLACK`.
 * @return {Board} New board constructed from the coordinates.
 */
export function constructBoard(coordinates, board = null, startColor = BLACK) {
  if (!board) {
    board = Board();
  }

  const opposite = oppositeColor(startColor);

  return coordinates.reduce(
    (acc, coordinate, index) => {
      const isCoordinate = coordinate instanceof Coordinate;
      const hasXY = hasIn(coordinate, 'x') && hasIn(coordinate, 'y');

      if (!(isCoordinate || hasXY)) {
        throw new Error(
          'You must pass coordinates or coordinate-like objects.'
        );
      }

      const checkedCoordinate = isCoordinate ?
        coordinate : Coordinate(coordinate.x, coordinate.y);

      return addMove(
        acc,
        Move(checkedCoordinate, index % 2 === 0 ? startColor : opposite),
      );
    },
    board,
  );
}

/**
 * Creates a `Board` with the correct number of handicap stones placed.
 * Only standard board sizes (9, 13, 19) are allowed.
 *
 * @example
 * var board = handicapBoard(9, 4);
 *
 * toAsciiBoard(board);
 * // => +++++++++
 * //    +++++++++
 * //    ++O+++O++
 * //    +++++++++
 * //    +++++++++
 * //    +++++++++
 * //    ++O+++O++
 * //    +++++++++
 * //    +++++++++
 *
 * @param {number} size - Size of board, must be 9, 13, or 19.
 * @param {number} handicap - Number of handicaps, must be 0-9.
 * @return {Board} New board with handicaps placed.
 */
export function handicapBoard(size, handicap) {
  if (size !== 9 && size !== 13 && size !== 19) {
    throw new Error(
      'Only 9, 13, 19 allowed - use placeStone for non standard sizes'
    );
  }
  if (!inRange(handicap, 0, 10) || !isInteger(handicap)) {
    throw new Error('Handicap must be an integer between 0 and 9');
  }

  const nonTengenHandicap = {
    9: [
      Coordinate(2, 2),
      Coordinate(6, 6),
      Coordinate(2, 6),
      Coordinate(6, 2),
      Coordinate(6, 4),
      Coordinate(2, 4),
      Coordinate(4, 2),
      Coordinate(4, 6),
    ],
    13: [
      Coordinate(3, 3),
      Coordinate(9, 9),
      Coordinate(3, 9),
      Coordinate(9, 3),
      Coordinate(9, 6),
      Coordinate(3, 6),
      Coordinate(6, 3),
      Coordinate(6, 9),
    ],
    19: [
      Coordinate(3, 3),
      Coordinate(15, 15),
      Coordinate(15, 3),
      Coordinate(3, 15),
      Coordinate(15, 9),
      Coordinate(3, 9),
      Coordinate(9, 3),
      Coordinate(9, 15),
    ],
  }[size];
  const tengen = {
    9: TENGEN_9,
    13: TENGEN_13,
    19: TENGEN_19,
  }[size];
  const board = Board(size);

  if (handicap < 5) {
    return placeStones(board, take(nonTengenHandicap, handicap), BLACK);
  } else if (handicap === 5) {
    return placeStones(
      board, concat(take(nonTengenHandicap, 4), tengen), BLACK,
    );
  } else if (handicap === 6) {
    return placeStones(board, take(nonTengenHandicap, 6), BLACK);
  } else if (handicap === 8) {
    return placeStones(board, nonTengenHandicap, BLACK);
  } else {
    return placeStones(
      board, concat(take(nonTengenHandicap, handicap - 1), tengen), BLACK,
    );
  }
}

export default {
  BLACK,
  Board,
  Coordinate,
  EMPTY,
  Move,
  WHITE,
  TENGEN_9,
  TENGEN_13,
  TENGEN_19,
  addMove,
  constructBoard,
  difference,
  followupKo,
  group,
  handicapBoard,
  isLegalMove,
  liberties,
  libertyCount,
  oppositeColor,
  placeStone,
  placeStones,
  removeStone,
  removeStones,
  toAsciiBoard,
  toString,
};
