# API Documentation

## Classes

* module:Board.Board
* module:Board.Coordinate

## Functions


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

