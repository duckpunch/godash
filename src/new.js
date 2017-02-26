import {Set, Map, Record} from "immutable";
import {isString, inRange} from 'lodash';

export const BLACK = 'black';
export const WHITE = 'white';
export const EMPTY = null;

export class Board extends Record({dimensions: 19, moves: Map()}, "Board") {}
export class Coordinate extends Record({x: 0, y: 0}, "Coordinate") {
    constructor(x, y) {
        super({x, y});
    }
}

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

export function sgfPointToCoordinate(sgfPoint) {
    if (isString(sgfPoint) && sgfPoint.length === 2) {
        return new Coordinate(
            sgfPoint.charCodeAt(0) - 97,
            sgfPoint.charCodeAt(1) - 97,
        );
    } else {
        throw TypeError('Must pass a string of length 2');
    }
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
    console.log(board.toString());
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

export function constructBoard(board, sequence) {}
export function sgfToJS(sgf) {}
