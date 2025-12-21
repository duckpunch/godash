# API Documentation

## Classes

### _Board

```javascript
godash.Board(dimensions = 19, ...moves)
```

Representation of a board position.

Extends [`Immutable.Record`][imm-record].

[imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record

!!! tldr "Constructor Arguments"
    * `dimensions` `(number)` - Size of the board, defaulted to 19.
    * `...moves` `(Move)` - Moves to be placed on the board.

!!! tldr "Properties"
    * `dimensions` `(number)` - Size of the board.
    * `moves` [`(Immutable.Map)`][imm-map] - Stones present on this board.
    [`Coordinate`](#coordinate) keys with either [`BLACK`](#black) or
    [`WHITE`](#white) values.

[imm-map]: https://immutable-js.github.io/immutable-js/docs/#/Map

??? example "Examples"
    ```javascript
    var board = Board();

    board.toString();
    // => Board { "dimensions": 19, "moves": Map {} }
    ```

    ```javascript
    var smallBoard = Board(5, Move(Coordinate(2, 2), BLACK));

    smallBoard.toString();
    // => Board { "dimensions": 5, "moves": Map { {"x":2,"y":2}: "black" } }
    ```

    ```javascript
    var smallBoard = Board(5, Move(Coordinate(2, 2), BLACK));

    smallBoard.toString();
    // => Board { "dimensions": 5, "moves": Map { {"x":2,"y":2}: "black" } }
    ```

### _Coordinate

```javascript
godash.Coordinate(x, y)
```

A zero-based tuple representing a single location on a Go board.

Extends [`Immutable.Record`][imm-record].

[imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record

!!! tldr "Constructor Arguments"
    * `x` `(number)` - Location on the X-axis.
    * `y` `(number)` - Location on the Y-axis.

!!! tldr "Properties"
    * `x` `(number)` - Location on the X-axis.
    * `y` `(number)` - Location on the Y-axis.

??? example "Examples"
    ```javascript
    var tengen = Coordinate(9, 9);

    tengen.toString();
    // => Coordinate { "x": 9, "y": 9 }

    tengen.x;
    // => 9
    ```

### _Move

```javascript
godash.Move(coordinate, color)
```

Representation of a move, composed of a [`Coordinate`](#coordinate) and a
color.

Extends [`Immutable.Record`][imm-record].

[imm-record]: https://immutable-js.github.io/immutable-js/docs/#/Record

!!! tldr "Constructor Arguments"
    * `coordinate` ([`Coordinate`](#coordinate)) - Location of the move.
    * `color` `(string)` - [`BLACK`](#black), [`WHITE`](#white), or
    [`EMPTY`](#empty).

!!! tldr "Properties"
    * `coordinate` ([`Coordinate`](#coordinate)) - Location of the move.
    * `color` `(string)` - [`BLACK`](#black), [`WHITE`](#white), or
    [`EMPTY`](#empty).

??? example "Examples"
    ```javascript
    var tengen = Move(Coordinate(9, 9), BLACK);
    ```


## Constants

### BLACK

```javascript
godash.BLACK
```

The color black.

### EMPTY

```javascript
godash.EMPTY
```

An empty space.

### TENGEN_13

```javascript
godash.TENGEN_13
```

Center point on a 13x13 board.

### TENGEN_19

```javascript
godash.TENGEN_19
```

Center point on a 19x19 board.

### TENGEN_9

```javascript
godash.TENGEN_9
```

Center point on a 9x9 board.

### WHITE

```javascript
godash.WHITE
```

The color white.



## Board utilities

### addMove

```javascript
godash.addMove(board, move)
```

Function to add a move onto a board while respecting the rules.  Since no
sequence information is available, this function does not respect
[ko][ko-rule].  Use `followupKo` if you want to do [ko][ko-rule]-related
things.

[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko

!!! tldr "Arguments"
    * `board` `(Board)` - Board from which to add the move.

    * `move` `(Move)` - Move or location of the move.


!!! tldr "Returns"
    `Board` - New board with the move played.


??? example "Examples"
    ```javascript
    var atari = Board(3,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(1, 1), WHITE),
    );
    
    toAsciiBoard(atari);
    // => +O+
    //    OXO
    //    +++
    
    var killed = addMove(
        atari,
        Move(Coordinate(2, 1), BLACK)
    );
    
    toAsciiBoard(killed);
    // => +O+
    //    O+O
    //    +O+
    ```

---

### constructBoard

```javascript
godash.constructBoard(coordinates, board, startColor)
```

Constructs a board for an array of coordinates.  This function iteratively
calls `addMove` while alternating colors.

!!! tldr "Arguments"
    * `coordinates` `(Array)` - Ordered `Coordinate` moves.

    * `board` `(Board)` - Optional starting board.  Empty 19x19, if omitted.

    * `startColor` `(string)` - Optional starting color, defaulted to `BLACK`.


!!! tldr "Returns"
    `Board` - New board constructed from the coordinates.


??? example "Examples"
    ```javascript
    var tigersMouth = Board(3,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
    );
    
    toAsciiBoard(tigersMouth);
    // => +O+
    //    O+O
    //    +++
    
    var selfAtari = Coordinate(1, 1);
    var killingMove = Coordinate(2, 1);
    
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

---

### difference

```javascript
godash.difference(board1, board2)
```

Finds the moves on the first board that are not on the second board.

!!! tldr "Arguments"
    * `board1` `(Board)` - First board.

    * `board2` `(Board)` - Board with moves to subtract from first board.


!!! tldr "Returns"
    `Set` - Set containing pairs of `Coordinate` and color remaining in
    the difference.

??? example "Examples"
    ```javascript
    var atari = Board(3,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(1, 1), WHITE),
    );
    
    toAsciiBoard(atari);
    // => +O+
    //    OXO
    //    +++
    
    var captured = difference(
        atari, addMove(atari, Move(Coordinate(2, 1), BLACK))
    );
    
    captured.toString();
    // 'Set { List [ Coordinate { "x": 1, "y": 1 }, "white" ] }'
    ```

---

### followupKo

```javascript
godash.followupKo(board, move)
```

Determines move that would be illegal under the [ko
rule](https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko)

!!! tldr "Arguments"
    * `board` `(Board)` - Starting board.

    * `move` `(Move)` - Intended `Move`.


!!! tldr "Returns"
    `Coordinate` - Position of illegal followup or `null` if
    none exists.

??? example "Examples"
    ```javascript
    const koPosition = Board(4,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(1, 1), WHITE),
        Move(Coordinate(2, 0), WHITE),
        Move(Coordinate(2, 2), WHITE),
        Move(Coordinate(3, 1), WHITE),
    );
    
    toAsciiBoard(koPosition);
    // => +O++
    //    OXO+
    //    X+X+
    //    +X++
    
    const koStart = Coordinate(2, 1);
    
    followupKo(koPosition, koStart, BLACK).toString();
    // => 'Coordinate { "x": 1, "y": 1 }'
    ```

---

### fromA1Coordinate

```javascript
godash.fromA1Coordinate(raw)
```

Construct a Coordinate from an A1-style coordinate string.

An [A1-style coordinate][a1-style] is given in the form A1 to T19 with I
omitted to avoid confusion with J.

This function accepts raw coordinates from A-Z.

[a1-style]: https://senseis.xmp.net/?Coordinates#toc2

!!! tldr "Arguments"
    * `raw` `(string)` - A1-style coordinate to convert.


!!! tldr "Returns"
    `Coordinate` - Coordinate representation of A1-style input.


??? example "Examples"

---

### group

```javascript
godash.group(board, coordinate)
```

Finds the set of coordinates which identifies the fully connected group for
the given location.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Location to inspect.


!!! tldr "Returns"
    `Set` - Containing `Coordinate` for the members of the group.


??? example "Examples"
    ```javascript
    var board = Board(3,
        Move(Coordinate(1, 0), WHITE),
        Move(Coordinate(0, 2), WHITE),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(2, 2), BLACK),
        Move(Coordinate(2, 1), BLACK),
    );
    
    toAsciiBoard(board);
    // => ++X
    //    X+O
    //    +OO
    
    group(board, Coordinate(2, 1)).toString();
    // => Set {
    //      Coordinate { "x": 2, "y": 1 },
    //      Coordinate { "x": 2, "y": 2 },
    //      Coordinate { "x": 1, "y": 2 }
    //    }
    ```

---

### handicapBoard

```javascript
godash.handicapBoard(size, handicap)
```

Creates a `Board` with the correct number of handicap stones placed.
Only standard board sizes (9, 13, 19) are allowed.

!!! tldr "Arguments"
    * `size` `(number)` - Size of board, must be 9, 13, or 19.

    * `handicap` `(number)` - Number of handicaps, must be 0-9.


!!! tldr "Returns"
    `Board` - New board with handicaps placed.


??? example "Examples"
    ```javascript
    var board = handicapBoard(9, 4);
    
    toAsciiBoard(board);
    // => +++++++++
    //    +++++++++
    //    ++O+++O++
    //    +++++++++
    //    +++++++++
    //    +++++++++
    //    ++O+++O++
    //    +++++++++
    //    +++++++++
    ```

---

### isLegalBlackMove

```javascript
godash.isLegalBlackMove(board, coordinate)
```

Partial application of `isLegalMove`, fixing the color to `BLACK`.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Location to check.


!!! tldr "Returns"
    `boolean` - Whether the move is legal.


??? example "Examples"

---

### isLegalMove

```javascript
godash.isLegalMove(board, move)
```

Determine whether the coordinate-color combination provided is a legal move
for the board.  [Ko][ko-rule] is not considered.  Use `followupKo` if you
want to do [ko][ko-rule]-related things.

[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `move` `(Move)` - Move to check.


!!! tldr "Returns"
    `boolean` - Whether the move is legal.


??? example "Examples"
    ```javascript
    var ponnuki = Board(3,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(2, 1), BLACK),
    );
    
    toAsciiBoard(ponnuki);
    // => +O+
    //    O+O
    //    +O+
    
    isLegalMove(ponnuki, Move(Coordinate(1, 1), BLACK))
    // => true
    
    isLegalMove(ponnuki, Move(Coordinate(1, 1), WHITE))
    // => false
    ```

---

### isLegalWhiteMove

```javascript
godash.isLegalWhiteMove(board, coordinate)
```

Partial application of `isLegalMove`, fixing the color to `WHITE`.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Location to check.


!!! tldr "Returns"
    `boolean` - Whether the move is legal.


??? example "Examples"

---

### liberties

```javascript
godash.liberties(board, coordinate)
```

Finds the set of all liberties for the given coordinate.  If the coordinate
is part of a group, the set of liberties are the liberties for that group.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Coordinate to inspect.


!!! tldr "Returns"
    `Set` - Containing `Coordinate` members for the liberties of the
    passed coordinate.

??? example "Examples"
    ```javascript
    var board = Board(3, Move(Coordinate(1, 1), BLACK));
    var collectedLiberties = liberties(board, Coordinate(1, 1));
    
    Immutable.Set.of(
        Coordinate(1, 0),
        Coordinate(0, 1),
        Coordinate(1, 2),
        Coordinate(2, 1)
    ).equals(collectedLiberties);
    // => true
    ```

---

### libertyCount

```javascript
godash.libertyCount(board, coordinate)
```

Counts the liberties for the given coordinate.  If the coordinate is part of
a group, liberties for the entire group is counted.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Coordinate to inspect.


!!! tldr "Returns"
    `number` - Count of liberties for the coordinate on the board.


??? example "Examples"
    ```javascript
    var board = Board(3, Coordinate(1, 1), BLACK);
    
    libertyCount(board, Coordinate(1, 1)) === 4;
    // => true
    ```

---

### oppositeColor

```javascript
godash.oppositeColor(color)
```

Toggles the passed color.

!!! tldr "Arguments"
    * `color` `(string)` - `godash.BLACK` or `godash.WHITE`


!!! tldr "Returns"
    `string` - Color opposite of the one provided.


??? example "Examples"
    ```javascript
    oppositeColor(BLACK) === WHITE
    // => true
    
    oppositeColor(WHITE) === BLACK
    // => true
    ```

---

### placeStone

```javascript
godash.placeStone(board, coordinate, color, force)
```

Places a stone on the board, ignoring the rules of Go.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to add stone.

    * `coordinate` `(Coordinate)` - Location to add stone.

    * `color` `(string)` - Stone color - `BLACK` or `WHITE`.

    * `force` `(boolean)` - Optionally allow placement over existing stones.


!!! tldr "Returns"
    `Board` - New board with the move placed.


??? example "Examples"
    ```javascript
    var ponnuki = Board(3,
        Move(Coordinate(1, 0), BLACK),
        Move(Coordinate(0, 1), BLACK),
        Move(Coordinate(1, 2), BLACK),
        Move(Coordinate(2, 1), BLACK),
    );
    
    toAsciiBoard(ponnuki);
    // => +O+
    //    O+O
    //    +O+
    
    toAsciiBoard(
        placeStone(ponnuki, Coordinate(1, 1), WHITE)
    );
    // => +O+
    //    OXO
    //    +O+
    ```

---

### placeStones

```javascript
godash.placeStones(board, coordinates, color, force)
```

Places a set of stones onto the board, ignoring the rules of Go.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to add stones.

    * `coordinates` `(Array)` - Stones to place.

    * `color` `(string)` - Stone color - `BLACK` or `WHITE`.

    * `force` `(boolean)` - Optionally allow placement over existing stones.


!!! tldr "Returns"
    `Board` - New board with the moves placed.


??? example "Examples"
    ```javascript
    var board = Board(3, Coordinate(1, 1), WHITE);
    
    toAsciiBoard(board);
    // => +++
    //    +X+
    //    +++
    
    toAsciiBoard(
        placeStones(board, [
            Coordinate(1, 0),
            Coordinate(0, 1),
            Coordinate(1, 2),
            Coordinate(2, 1)
        ], BLACK)
    );
    // => +O+
    //    OXO
    //    +O+
    ```

---

### removeStone

```javascript
godash.removeStone(board, coordinate)
```

Make a given coordinate empty on the board.

!!! tldr "Arguments"
    * `board` `(Board)` - Board from which to remove the stone.

    * `coordinate` `(Coordinate)` - Location of the stone.


!!! tldr "Returns"
    `Board` - New board with the stone removed.


??? example "Examples"
    ```javascript
    var board = Board(3, Move(Coordinate(1, 1), WHITE));
    
    toAsciiBoard(board);
    // => +++
    //    +X+
    //    +++
    
    toAsciiBoard(
        removeStone(board, Coordinate(1, 1))
    );
    // => +++
    //    +++
    //    +++
    ```

---

### removeStones

```javascript
godash.removeStones(board, coordinates)
```

Makes several coordinates empty on the board.

!!! tldr "Arguments"
    * `board` `(Board)` - Board from which to remove the stone.

    * `coordinates` `(Coordinate)` - Location of the stones.


!!! tldr "Returns"
    `Board` - New board with the stones removed.


??? example "Examples"
    ```javascript
    var board = Board(3,
        Move(Coordinate(1, 0), WHITE),
        Move(Coordinate(1, 1), WHITE),
        Move(Coordinate(1, 2), BLACK),
    );
    
    toAsciiBoard(board);
    // => +++
    //    XXO
    //    +++
    
    toAsciiBoard(
        removeStones(board, [
            Coordinate(1, 1),
            Coordinate(1, 2)
        ])
    );
    // => +++
    //    X++
    //    +++
    ```

---

### toA1Coordinate

```javascript
godash.toA1Coordinate(coordinate)
```

Construct an A1-style coordinate string from a Coordinate.

An [A1-style coordinate][a1-style] is given in the form A1 to T19 with I
omitted to avoid confusion with J.

This function accepts coordinates in the range 0-24, mapping from A-Z.

[a1-style]: https://senseis.xmp.net/?Coordinates#toc2

!!! tldr "Arguments"
    * `coordinate` `(Coordinate)` - Coordinate to convert.


!!! tldr "Returns"
    `string` - String A1-style coordinate.


??? example "Examples"

---

### toAsciiBoard

```javascript
godash.toAsciiBoard(board)
```

Constructs an ASCII representation of the board.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to represent.


!!! tldr "Returns"
    `string` - ASCII representation of the board.


??? example "Examples"
    ```javascript
    var board = Board(3,
        Coordinate(1, 0), BLACK,
        Coordinate(0, 1), BLACK,
        Coordinate(1, 2), BLACK,
        Coordinate(1, 1), WHITE
    );
    
    toAsciiBoard(board);
    // => +O+
    //    OXO
    //    +++
    ```

---

### toString

```javascript
godash.toString(board, overrides)
```

Constructs a string representation of the board.

!!! tldr "Arguments"
    * `board` `(Board)` - Board to represent.

    * `overrides` `(Object)` - Overrides print characters, indexed by color
    constants.

!!! tldr "Returns"
    `string` - String representation of the board.


??? example "Examples"
    ```javascript
    var board = Board(3,
        Coordinate(1, 0), BLACK,
        Coordinate(0, 1), BLACK,
        Coordinate(1, 2), BLACK,
        Coordinate(1, 1), WHITE
    );
    
    toString(board, {[BLACK]: 'B', [WHITE]: 'W"});
    // => +B+
    //    BWB
    //    +++
    ```

---


## SGF utilities

### coordinateToSgfPoint

```javascript
godash.coordinateToSgfPoint(coordinate)
```

Converts a [`Coordinate`](#coordinate) to an [SGF Point][sgf-point] in the
form of a Javascript `String`.

[sgf-point]: http://www.red-bean.com/sgf/go.html

!!! tldr "Arguments"
    * `coordinate` `(Coordinate)` - Coordinate to convert.


!!! tldr "Returns"
    `string` - 2-character string representing an [SGF Point][sgf-point]


??? example "Examples"
    ```javascript
    coordinateToSgfPoint(Coordinate(0, 0))
    // => "aa"
    ```

---

### sgfPointToCoordinate

```javascript
godash.sgfPointToCoordinate(sgfPoint)
```

Converts an [SGF Point][sgf-point] to a [`Coordinate`](#coordinate).

[sgf-point]: http://www.red-bean.com/sgf/go.html

!!! tldr "Arguments"
    * `sgfPoint` `(string)` - 2-character string representing an [SGF
    Point][sgf-point]

!!! tldr "Returns"
    `Coordinate` - Corresponding [`Coordinate`](#coordinate).


??? example "Examples"
    ```javascript
    sgfPointToCoordinate('hi').toString();
    // => Coordinate { "x": 7, "y": 8 }
    ```

---

### sgfToJS

```javascript
godash.sgfToJS(sgf)
```

Converts a raw [SGF][sgf] string into a plain Javascript array.  Note that
unlike [`Board`](#board), the results of this function is a mutable object.

[sgf]: http://www.red-bean.com/sgf/index.html

!!! tldr "Arguments"
    * `sgf` `(string)` - Raw [SGF][sgf] string to be parsed.


!!! tldr "Returns"
    `Array` - Unpacked SGF in plain Javascript objects.


??? example "Examples"
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

---

