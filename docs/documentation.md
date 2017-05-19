## Board

Utilities surrounding the board centering around an immutable [Board](#board_1)
object.

### Coordinate

---

```javascript
new godash.Coordinate(x, y)
```

Class representing a single location on a Go board.  Inherits from
[`Immutable.Record`][imm-record].

#### Arguments

* `x` `(number)`: Location on one axis.
* `y` `(number)`: Location on the other axis.

#### Properties

* `x` `(number)`: Location on one axis.
* `y` `(number)`: Location on the other axis.

#### Example

```javascript
var tengen = new Coordinate(9, 9);

tengen.toString();
// => Coordinate { "x": 9, "y": 9 }

tengen.x;
// => 9
```

### Board

---

```javascript
new godash.Board(dimensions = 19, ...moves)
```

Class representing a Go board.  Inherits from [`Immutable.Record`][imm-record].

#### Arguments

* `dimensions` `(number)`: Size of the board, defaulted to 19x19.
* `...moves` `(Coordinate, string)`: Moves to be placed on the board.  They
  should be provided in pairs of arguments - Coordinate and color.

#### Properties

* `dimensions` `(number)`: Size of the board.
* `moves` [`(Immutable.Map)`][imm-map]: Moves on this board, keyed by
  [Coordinate](#coordinate) with either [BLACK](#black) or [WHITE](#white) as
  the value.

#### Example

```javascript
var board = new Board();

board.toString();
// => Board { "dimensions": 19, "moves": Map {} }
```

```javascript
var smallBoard = new Board(5, new Coordinate(2, 2), BLACK);

smallBoard.toString();
// => Board { "dimensions": 5, "moves": Map { {"x":2,"y":2}: "black" } }
```

### addMove

---

```javascript
godash.addMove(board, coordinate, color)
```

Function to add a move onto a board while respecting the rules.  Since no
sequence information is available, this function does not respect
[ko][ko-rule].  Use [`followupKo()`](#followupko) if you want to do
[ko][ko-rule]-related things.

#### Arguments

* `board` [`(Board)`](#board_1): Board from which to add the move.
* `coordinate` [`(Coordinate)`](#coordinate): Location to add the move.
* `color` `(string)`: Color of the move - [`BLACK`](#black) or
  [`WHITE`](#white).

#### Returns

[`(Board)`](#board_1): New board with the move added.

#### Example

```javascript
var atari = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(1, 1), WHITE
);

toAsciiBoard(atari);
// => +O+
//    OXO
//    +++

var killed = addMove(
    atari,
    new Coordinate(2, 1),
    BLACK
);

toAsciiBoard(killed);
// => +O+
//    O+O
//    +O+
```

### constructBoard

---

```javascript
godash.constructBoard(coordinates, board = null, startColor = godash.BLACK)
```

Constructs a board for an array of coordinates.  This function iteratively
calls [`addMove`](#addmove) while alternating colors.

#### Arguments

* `coordinates` [`(Array)`][array]: Members of this array should be of type
  [Coordinate](#coordinate).
* `board` [`(Board)`](#board_1): Optional starting board.  If omitted, a
  default [`Board`](#board_1) is created - 19x19 and empty.
* `startColor` `(string)`: Optional starting color, defaulted to [`BLACK`](#black).

#### Returns

[`(Board)`](#board_1): New board constructed from the coordinates.

#### Example

```javascript
var tigersMouth = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK
);

toAsciiBoard(tigersMouth);
// => +O+
//    O+O
//    +++

var selfAtari = new Coordinate(1, 1);
var killingMove = new Coordinate(2, 1);

var ponnuki = constructBoard(
    [selfAtari, killingMove],
    tigersMouth,
    WHITE
);

toAsciiBoard(ponnuki);
// => +O+
//    O+O
//    +O+
```

### difference

---

```javascript
godash.difference(board1, board2)
```

Finds the moves on the first board that are not on the second board.

#### Arguments

* `board1` [`(Board)`](#board_1): First board.
* `board2` [`(Board)`](#board_1): Board with moves to subtract from first board.

#### Returns

[`(Immutable.Set)`][imm-set]: Set containing [`Immutable.List`][imm-list] of
[`Coordinate`](#coordinate) and color (`string`).

#### Example

```javascript
var atari = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(1, 1), WHITE,
);

toAsciiBoard(atari);
// => +O+
//    OXO
//    +++

var captured = difference(atari, addMove(atari, new Coordinate(2, 1), BLACK));

captured.toString();
// 'Set { List [ Coordinate { "x": 1, "y": 1 }, "white" ] }'
```

### followupKo

---

```javascript
godash.followupKo(board, coordinate, color)
```

Determines move that would be illegal under the [ko rule][ko-rule].

#### Arguments

* `board` [`(Board)`](#board_1): Starting board.
* `coordinate` [`(Coordinate)`](#Coordinate): Intended placement of stone.
* `color` `(string)`: Stone color - [`BLACK`](#black) or [`WHITE`](#white).

#### Returns

[`(Coordinate)`](#Coordinate): Position of illegal followup or `null` if none
exists.

#### Example

```javascript
const koPosition = new Board(4,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(1, 1), WHITE,
    new Coordinate(2, 0), WHITE,
    new Coordinate(2, 2), WHITE,
    new Coordinate(3, 1), WHITE,
);

toAsciiBoard(koPosition);
// => +O++
//    OXO+
//    X+X+
//    +X++

const koStart = new Coordinate(2, 1);

followupKo(koPosition, koStart, BLACK).toString();
// => 'Coordinate { "x": 1, "y": 1 }'
```

### group

---

```javascript
godash.group(board, coordinate)
```

Finds the set of coordinates which identifies the fully connected group for the
given location.

#### Arguments

* `board` [`(Board)`](#board_1): Board to inspect.
* `coordinate` [`(Coordinate)`](#coordinate): Location to inspect.

#### Returns

[`(Immutable.Set)`][imm-set]: Set containing [`Coordinate`](#coordinate)
members for the group.

#### Example

```javascript
var board = new Board(3,
    new Coordinate(1, 0), WHITE,
    new Coordinate(0, 2), WHITE,
    new Coordinate(1, 2), BLACK,
    new Coordinate(2, 2), BLACK,
    new Coordinate(2, 1), BLACK
);

toAsciiBoard(board);
// => ++X
//    X+O
//    +OO

group(board, new Coordinate(2, 1)).toString();
// => Set {
//      Coordinate { "x": 2, "y": 1 },
//      Coordinate { "x": 2, "y": 2 },
//      Coordinate { "x": 1, "y": 2 }
//    }
```

### isLegalMove

---

```javascript
godash.isLegalMove(board, coordinate, color)
```

Determine whether the coordinate-color combination provided is a legal move for
the board.  [Ko][ko-rule] is not considered.  Use [`followupKo()`](#followupko)
if you want to do [ko][ko-rule]-related things.

#### Arguments

* `board` [`(Board)`](#board_1): Board to inspect.
* `coordinate` [`(Coordinate)`](#coordinate): Location to check.
* `color` `(string)`: Color to check - [`BLACK`](#black) or [`WHITE`](#white).

#### Returns

`(boolean)`: Whether the move is legal.

#### Example

```javascript
var ponnuki = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(2, 1), BLACK
);

toAsciiBoard(ponnuki);
// => +O+
//    O+O
//    +O+

isLegalMove(ponnuki, new Coordinate(1, 1), BLACK)
// => true

isLegalMove(ponnuki, new Coordinate(1, 1), WHITE)
// => false
```

### liberties

---

```javascript
godash.liberties(board, coordinate)
```

Finds the set of all liberties for the given coordinate.  If the coordinate is
part of a group, the set of liberties are the liberties for that group.

#### Arguments

* `board` [`(Board)`](#board_1): Board to inspect.
* `coordinate` [`(Coordinate)`](#coordinate): Coordinate to inspect.

#### Returns

[`(Immutable.Set)`][imm-set]: Set containing [`Coordinate`](#coordinate)
members for the liberties of the passed coordinate.

#### Example

```javascript
var board = new Board(3, new Coordinate(1, 1), BLACK);
var collectedLiberties = liberties(board, new Coordinate(1, 1));

Immutable.Set.of(
    new Coordinate(1, 0),
    new Coordinate(0, 1),
    new Coordinate(1, 2),
    new Coordinate(2, 1)
).equals(collectedLiberties);
// => true
```

### libertyCount

---

```javascript
godash.libertyCount(board, coordinate)
```

Counts the liberties for the given coordinate.  If the coordinate is
part of a group, liberties for the entire group is counted.

#### Arguments

* `board` [`(Board)`](#board_1): Board to inspect.
* `coordinate` [`(Coordinate)`](#coordinate): Coordinate to inspect.

#### Returns

`(number)`: Count of liberties for the passed coordinate.

#### Example

```javascript
var board = new Board(3, new Coordinate(1, 1), BLACK);

libertyCount(board, new Coordinate(1, 1)) === 4;
// => true
```

### oppositeColor

---

```javascript
godash.oppositeColor(color)
```

Toggles the passed color.

#### Arguments

* `color` `(string)`: [`BLACK`](#black) or [`WHITE`](#white).

#### Returns

`(string)`: Color opposite of the one provided.

#### Example

```javascript
oppositeColor(BLACK) === WHITE
// => true

oppositeColor(WHITE) === BLACK
// => true
```

### placeStone

---

```javascript
godash.placeStone(board, coordinate, color, force = false)
```

Places a stone on the board, ignoring the rules of Go.

#### Arguments

* `board` [`(Board)`](#board_1): Board to add stone.
* `coordinate` [`(Coordinate)`](#coordinate): Location to add stone.
* `color` `(string)`: Stone color - [`BLACK`](#black) or [`WHITE`](#white).
* `force` `(boolean)`: Optionally allow placement over existing stones.

#### Returns

[`(Board)`](#board_1): New board with the stone placed.

#### Example

```javascript
var ponnuki = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(2, 1), BLACK
);

toAsciiBoard(ponnuki);
// => +O+
//    O+O
//    +O+

toAsciiBoard(
    placeStone(ponnuki, new Coordinate(1, 1), WHITE)
);
// => +O+
//    OXO
//    +O+
```

### placeStones

---

```javascript
godash.placeStones(board, coordinates, color, force = false)
```

Places a set of stones onto the board, ignoring the rules of Go.

#### Arguments

* `board` [`(Board)`](#board_1): Board to add stone.
* `coordinate` [`(Array)`][array]: Stones to place.
* `color` `(string)`: Stone color - [`BLACK`](#black) or [`WHITE`](#white).
* `force` `(boolean)`: Optionally allow placement over existing stones.

#### Returns

[`(Board)`](#board_1): New board with the stones placed.

#### Example

```javascript
var board = new Board(3, new Coordinate(1, 1), WHITE);

toAsciiBoard(board);
// => +++
//    +X+
//    +++

toAsciiBoard(
    placeStones(board, [
        new Coordinate(1, 0),
        new Coordinate(0, 1),
        new Coordinate(1, 2),
        new Coordinate(2, 1)
    ], BLACK)
);
// => +O+
//    OXO
//    +O+
```

### removeStone

---

```javascript
godash.removeStone(board, coordinate)
```

Make a given coordinate empty on the board.

#### Arguments

* `board` [`(Board)`](#board_1): Board from which to remove the stone.
* `coordinate` [`(Coordinate)`](#coordinate): Location of the stone.

#### Returns

[`(Board)`](#board_1): New board with the stone removed.

#### Example

```javascript
var board = new Board(3, new Coordinate(1, 1), WHITE);

toAsciiBoard(board);
// => +++
//    +X+
//    +++

toAsciiBoard(
    removeStone(board, new Coordinate(1, 1))
);
// => +++
//    +++
//    +++
```

### removeStones

---

```javascript
godash.removeStones(board, coordinates)
```

Makes several coordinates empty on the board.

#### Arguments

* `board` [`(Board)`](#board_1): Board from which to remove the stones.
* `coordinate` [`(Array)`][array]: Location of the stones.

#### Returns

[`(Board)`](#board_1): New board with the stones removed.

#### Example

```javascript
var board = new Board(3,
    new Coordinate(1, 0), WHITE,
    new Coordinate(1, 1), WHITE,
    new Coordinate(1, 2), BLACK
);

toAsciiBoard(board);
// => +++
//    XXO
//    +++

toAsciiBoard(
    removeStones(board, [
        new Coordinate(1, 1),
        new Coordinate(1, 2)
    ])
);
// => +++
//    X++
//    +++
```

### toAsciiBoard

---

```javascript
godash.toAsciiBoard(board)
```

Constructs an ASCII representation of the board.

#### Arguments

* `board` [`(Board)`](#board_1): Board from which to add the move.

#### Returns

`(string)`: ASCII representation of the board.

#### Example

```javascript
var board = new Board(3,
    new Coordinate(1, 0), BLACK,
    new Coordinate(0, 1), BLACK,
    new Coordinate(1, 2), BLACK,
    new Coordinate(1, 1), WHITE
);

toAsciiBoard(board);
// => +O+
//    OXO
//    +++
```

### BLACK

---

```javascript
godash.BLACK = 'black'
```

Constant representing the stone color black.

### WHITE

---

```javascript
godash.WHITE = 'white'
```

Constant representing the stone color white.

### EMPTY

---

```javascript
godash.EMPTY = null
```

Constant representing an empty space.

## SGF

Utilities to support [SGF][sgf] ingestion.

### coordinateToSgfPoint

---

```javascript
godash.coordinateToSgfPoint(coordinate)
```

Converts a [`Coordinate`](#coordinate) to an [SGF Point][sgf-point] in the form
of a Javascript `String`.

#### Arguments

* `coordinate` `(Coordinate)`: godash [`Coordinate`](#coordinate)

#### Returns

`(string)`: 2-character string representing an [SGF Point][sgf-point]

#### Example

```javascript
coordinateToSgfPoint(new Coordinate(0, 0))
// => "aa"
```

### sgfPointToCoordinate

---

```javascript
godash.sgfPointToCoordinate(sgfPoint)
```

Converts an [SGF Point][sgf-point] to a [`Coordinate`](#coordinate).

#### Arguments

* `sgfPoint` `(string)`: 2-character string representing an [SGF
  Point][sgf-point].

#### Returns

[`(Coordinate)`](#coordinate): Coordinate for the passed string.

#### Example

```javascript
sgfPointToCoordinate('hi').toString();
// => Coordinate { "x": 7, "y": 8 }
```

### sgfToJS

---

```javascript
godash.sgfToJS(sgf)
```

Converts a raw [SGF][sgf] string into a plain Javascript array.  Note that
unlike [`Board`](#board_1), the results of this function is a mutable object.

#### Arguments

* `sgf` `(string)`: Raw [SGF][sgf] string to be parsed.

#### Returns

[`(Array)`][array]: Plain Javascript array that breaks down SGF variations and
turns moves into objects.

#### Example

```javascript
var rawSgf = `(
    ;FF[4]GM[1]SZ[19];B[aa];W[bb]
        (;B[cc];W[dd];B[ad];W[bd])
        (;B[hh];W[hg]C[what a move!])
        (;B[gg];W[gh];B[hh]
            (;W[hg];B[kk])
            (;W[kl])
        )
)`;

sgfToJS(rawSgf);
// => [
//        {FF: '4', GM: '1', SZ: '19'}, {B: 'aa'}, {W: 'bb'},
//        [
//            [{B: 'cc'}, {W: 'dd'}, {B: 'ad'}, {W: 'bd'}],
//            [{B: 'hh'}, {W: 'hg', C: 'what a move!'}],
//            [
//                {B: 'gg'}, {W: 'gh'}, {B: 'hh'},
//                [
//                    [{W: 'hg'}, {B: 'kk'}],
//                    [{W: 'kl'}]
//                ]
//            ]
//        ]
//    ];
```

[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[imm-list]: https://facebook.github.io/immutable-js/docs/#/List
[imm-map]: https://facebook.github.io/immutable-js/docs/#/Map
[imm-record]: https://facebook.github.io/immutable-js/docs/#/Record
[imm-set]: https://facebook.github.io/immutable-js/docs/#/Set
[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko
[sgf]: http://www.red-bean.com/sgf/index.html
[sgf-point]: http://www.red-bean.com/sgf/go.html
