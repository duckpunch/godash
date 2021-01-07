# API Documentation

## Classes

### Board
### Coordinate

## Constants

### BLACK

```javascript
godash.BLACK
```

The color black.

### WHITE

```javascript
godash.WHITE
```

The color white.

### EMPTY

```javascript
godash.EMPTY
```

An empty space.

### TENGEN_9

```javascript
godash.TENGEN_9
```

Center point on a 9x9 board.

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



## Board utilities

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

---

### followupKo

```javascript
godash.followupKo(board, coordinate, color)
```

Determines move that would be illegal under the [ko
rule](https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko)

!!! tldr "Arguments"
    * `board` `(Board)` - Starting board.

    * `coordinate` `(Coordinate)` - Intended placement of stone.

    * `color` `(string)` - Stone color.


!!! tldr "Returns"
    `Coordinate` - Position of illegal followup or `null` if
    none exists.

??? example "Examples"
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
    var board = new Board(3, new Coordinate(1, 1), BLACK);
    
    libertyCount(board, new Coordinate(1, 1)) === 4;
    // => true
    ```

---

### isLegalMove

```javascript
godash.isLegalMove(board, coordinate, color)
```

Determine whether the coordinate-color combination provided is a legal move
for the board.  [Ko][ko-rule] is not considered.  Use `followupKo` if you
want to do [ko][ko-rule]-related things.

[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko

!!! tldr "Arguments"
    * `board` `(Board)` - Board to inspect.

    * `coordinate` `(Coordinate)` - Location to check.

    * `color` `(string)` - Color to check - `BLACK` or `WHITE`.


!!! tldr "Returns"
    `boolean` - Whether the move is legal.


??? example "Examples"
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

---

### addMove

```javascript
godash.addMove(board, coordinates, color)
```

Function to add a move onto a board while respecting the rules.  Since no
sequence information is available, this function does not respect
[ko][ko-rule].  Use `followupKo` if you want to do [ko][ko-rule]-related
things.

[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko

!!! tldr "Arguments"
    * `board` `(Board)` - Board from which to add the move.

    * `coordinates` `(Coordinate)` - Location to add the move.

    * `color` `(string)` - Color of the move.


!!! tldr "Returns"
    `Board` - New board with the move played.


??? example "Examples"
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

---

### handicapBoard

```javascript
godash.handicapBoard(size, handicap)
```

Creates a new `Board` with the correct number of handicap stones placed.
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
    coordinateToSgfPoint(new Coordinate(0, 0))
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
    * `sgfPoint` `(string)` - 2-character string representing an [SGF Point][sgf-point]


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

