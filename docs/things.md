# API Documentation

## Classes

* module:Board.Board
* module:Board.Coordinate

## Constants

* module:Board.BLACK
* module:Board.WHITE
* module:Board.EMPTY
* module:Board.TENGEN_9
* module:Board.TENGEN_13
* module:Board.TENGEN_19

## Functions


### difference

```javascript
godash.difference(board1, board2)
```

Finds the moves on the first board that are not on the second board.

!!! tldr "Arguments"
    * `board1` - First board.

    * `board2` - Board with moves to subtract from first board.


!!! tldr "Returns"
    `Set` - Set containing pairs of &#x60;Coordinate&#x60; and color remaining in
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
    * `board` - Starting board.

    * `coordinate` - Intended placement of stone.

    * `color` - Stone color.


!!! tldr "Returns"
    `Coordinate` - Position of illegal followup or &#x60;null&#x60; if
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

