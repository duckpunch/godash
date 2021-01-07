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
