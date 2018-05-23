import {
    Set,
    Map,
    List,
    Record,
} from "immutable";
import {
    concat,
    inRange,
    isInteger,
    take,
} from 'lodash';

export const BLACK = 'black';
export const WHITE = 'white';
export const EMPTY = null;

export class Board extends Record({dimensions: 19, moves: Map()}, "Board") {
    constructor(dimensions = 19, ...moves) {
        super({
            dimensions,
            moves: Map.of(...moves),
        });
    }
}

export class Coordinate extends Record({x: 0, y: 0}, "Coordinate") {
    constructor(x, y) {
        super({x, y});
    }
}

export const TENGEN_9 = new Coordinate(4, 4);
export const TENGEN_13 = new Coordinate(6, 6);
export const TENGEN_19 = new Coordinate(9, 9);

export function adjacentCoordinates(board, coordinate) {
    const {x, y} = coordinate;
    const validRange = n => inRange(n, board.dimensions);

    return Set.of(
        new Coordinate(x, y + 1),
        new Coordinate(x, y - 1),
        new Coordinate(x + 1, y),
        new Coordinate(x - 1, y),
    ).filter(c => c.every(validRange));
}

export function difference(board1, board2) {
    if (board1.dimensions !== board2.dimensions) {
        throw 'board sizes do not match';
    }

    const board1Set = Set(board1.moves.entrySeq().map(a => List(a)));
    const board2Set = Set(board2.moves.entrySeq().map(a => List(a)));

    return board1Set.subtract(board2Set);
}

export function followupKo(board, coordinate, color) {
    if (!isLegalMove(board, coordinate, color)) {
        return null;
    }

    const postMoveBoard = addMove(board, coordinate, color);
    const capturedStones = difference(board, postMoveBoard);

    if (capturedStones.size === 0 || capturedStones.size > 1) {
        return null;
    }

    const capturedMove = capturedStones.first();
    const capturedCoordinate = capturedMove.get(0);
    const capturedColor = capturedMove.get(1);

    // The situation is ko if playing the next move captures only the move that
    // was played here.

    if (isLegalMove(postMoveBoard, capturedCoordinate, capturedColor)) {
        const koTest = difference(
            postMoveBoard,
            addMove(postMoveBoard, capturedCoordinate, capturedColor)
        );

        if (koTest.size === 1) {
            const koTestCoordinate = koTest.first().get(0);
            if (koTestCoordinate.equals(coordinate)) {
                return capturedCoordinate;
            }
        }
    }

    return null;
}

export function matchingAdjacentCoordinates(board, coordinate, color) {
    const colorToMatch = color === undefined ? board.moves.get(coordinate, EMPTY) : color;

    return adjacentCoordinates(board, coordinate)
        .filter(c => board.moves.get(c, EMPTY) === colorToMatch);
}

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

export function oppositeColor(color) {
    if (color === BLACK) {
        return WHITE;
    } else if (color === WHITE) {
        return BLACK;
    } else {
        return EMPTY;
    }
}

export function liberties(board, coordinate) {
    return group(board, coordinate).reduce(
        (acc, coord) => acc.union(matchingAdjacentCoordinates(board, coord, EMPTY)),
        Set(),
    );
}

export function libertyCount(board, coordinate) {
    return liberties(board, coordinate).size;
}

export function isLegalMove(board, coordinate, color) {
    const will_have_liberties = libertyCount(
        board.setIn(['moves', coordinate], color),
        coordinate,
    ) > 0;

    const will_kill_something = matchingAdjacentCoordinates(
        board, coordinate, oppositeColor(color)
    ).some(coord => libertyCount(board, coord) === 1);

    return will_have_liberties || will_kill_something;
}

export function isLegalBlackMove(board, coordinate) {
    return isLegalMove(board, coordinate, BLACK)
}

export function isLegalWhiteMove(board, coordinate) {
    return isLegalMove(board, coordinate, WHITE)
}

export function removeStone(board, coordinate) {
    return board.set('moves', board.moves.delete(coordinate));
}

export function removeStones(board, coordinates) {
    return board.setIn(['moves'],
        coordinates.reduce(
            (acc, coordinate) => acc.delete(coordinate),
            board.moves,
        )
    );
}

export function addMove(board, coordinate, color) {
    if (!isLegalMove(board, coordinate, color)) {
        throw 'Not a valid position';
    }

    if (board.moves.has(coordinate)) {
        throw 'There is already a stone there';
    }

    const killed = matchingAdjacentCoordinates(board, coordinate, oppositeColor(color)).reduce(
        (acc, coord) => acc.union(libertyCount(board, coord) === 1 ? group(board, coord) : Set()),
        Set()
    );

    return removeStones(board, killed).setIn(['moves', coordinate], color);
}

export function placeStone(board, coordinate, color, force = false) {
    const currentColor = board.moves.get(coordinate, EMPTY);

    if ((!force) && oppositeColor(currentColor) === color) {
        throw 'There is already a stone there.  Pass force=true to override.';
    } else {
        return board.setIn(['moves', coordinate], color);
    }
}

export function placeStones(board, coordinates, color, force = false) {
    return coordinates.reduce(
        (acc, coordinate) => placeStone(acc, coordinate, color, force),
        board,
    );
}

export function toAsciiBoard(board) {
    const dimensions = board.dimensions;
    let pretty_string = '';

    for (var i = 0; i < dimensions; i++) {
        for (var j = 0; j < dimensions; j++) {
            let color = board.moves.get(new Coordinate(i, j), EMPTY);
            switch(color) {
                case BLACK:
                    pretty_string += 'O';
                    break;
                case WHITE:
                    pretty_string += 'X';
                    break;
                case EMPTY:
                    pretty_string += '+';
                    break;
            }
        }
        pretty_string += '\n';
    }
    return pretty_string;
}

export function constructBoard(coordinates, board = null, startColor = BLACK) {
    if (!board) {
        board = new Board();
    }

    const opposite = oppositeColor(startColor);

    return coordinates.reduce(
        (acc, coordinate, index) => addMove(
            acc, coordinate,
            index % 2 === 0 ? startColor : opposite,
        ),
        board,
    );
}

export function handicapBoard(size, handicap) {
    if (size !== 9 && size !== 13 && size !== 19) {
        throw 'Only 9, 13, 19 allowed - use placeStone for non standard sizes';
    }
    if (!inRange(handicap, 0, 10) || isInteger(handicap)) {
        throw 'Handicap must be an integer between 0 and 9';
    }

    const nonTengenHandicap = {
        9: [
            new Coordinate(2, 2),
            new Coordinate(6, 6),
            new Coordinate(2, 6),
            new Coordinate(6, 2),
            new Coordinate(6, 4),
            new Coordinate(2, 4),
            new Coordinate(4, 2),
            new Coordinate(4, 6),
        ],
        13: [
            new Coordinate(3, 3),
            new Coordinate(9, 9),
            new Coordinate(3, 9),
            new Coordinate(9, 3),
            new Coordinate(9, 6),
            new Coordinate(3, 6),
            new Coordinate(6, 3),
            new Coordinate(6, 9),
        ],
        19: [
            new Coordinate(3, 3),
            new Coordinate(15, 15),
            new Coordinate(15, 3),
            new Coordinate(3, 15),
            new Coordinate(15, 9),
            new Coordinate(3, 9),
            new Coordinate(9, 3),
            new Coordinate(9, 15),
        ],
    }[size];
    const tengen = {
        9: TENGEN_9,
        13: TENGEN_13,
        19: TENGEN_19,
    }[size];
    const board = new Board(size);

    if (handicap < 5) {
        return placeStones(board, take(nonTengenHandicap, handicap), BLACK);
    } else if (handicap === 5) {
        return placeStones(board, concat(take(nonTengenHandicap, 4), tengen), BLACK);
    } else if (handicap === 6) {
        return placeStones(board, take(nonTengenHandicap, 6), BLACK);
    } else {
        return placeStones(board, concat(take(nonTengenHandicap, handicap - 1), tengen), BLACK);
    }
}
