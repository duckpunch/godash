# API Documentation

## Classes

### Board

```javascript
new godash.Board(dimensions = 19, ...moves)
```

??? tldr "Arguments"
    `dimensions`
    :   Size of board.

??? tldr "Properties"
    `dimensions`
    :   Size of board.

??? example "Examples"
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

### Coordinate

```javascript
new godash.Coordinate(x, y)
```

## Constants

### BLACK

```javascript
godash.BLACK
```

## Functions

### addMove

```javascript
godash.addMove(board, coordinate, color)
```

Function to add a move onto a board while respecting the rules.  Since no
sequence information is available, this function does not respect
[ko][ko-rule].  Use `followupKo()` if you want to do [ko][ko-rule]-related
things.

??? tldr "Arguments"
    `dimensions`
    :   Size of board.

??? tldr "Returns"
    `dimensions`
    :   Size of board.

[ko-rule]: https://en.wikipedia.org/wiki/Rules_of_go#Ko_and_Superko
