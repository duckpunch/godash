import {Set, Map, Record} from "immutable";
import {isString, inRange, trimStart} from 'lodash';

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

export function constructBoard(sequence, board, startColor = BLACK) {
    if (!board) {
        board = new Board();
    }

    const opposite = oppositeColor(startColor);

    return sequence.reduce(
        (acc, coordinate, index) => addMove(
            acc, coordinate,
            index % 2 === 0 ? startColor : opposite,
        ),
        board,
    );
}

export function sgfToJS(sgf) {
    const rawSgf = `(
        ;FF[4]GM[1]SZ[19];B[aa];W[bb]
            (;B[cc];W[dd];B[ad];W[bd])
            (;B[hh];W[hg]C[something interesting here\\(\\]])
            (;B[gg];W[gh];B[hh]
                (;W[hg];B[kk])
                (;W[kl])
            )
    )`;

    //  function breakdownTokens(tokens) => returns tuple of (array of tokens of one sequence, rest of the tokens)
    //
    //  function oneSeqIntoSingleArray(tokens)
    //      remaining = tokens[1:]
    //      doneWithMoves;
    //      seq = null
    //      while remaining
    //          if start
    //              if seq == null
    //                  seq = []
    //              [tokensOfOne, rest] = breakdownTokens(remaining)
    //              seq.push(oneSeqIntoSingleArray(tokensOfOne))
    //              remaining = rest

    //  ret = []
    //  current = null
    //
    //  let level = 0
    //
    //  for token in tokens
    //      if token is start
    //          if current
    //              newCurrent = []
    //          else
    //              current = []
    //
    //          level += 1
    //      if token is end
    //          level -= 1
    //
    //  assert level === 0

    //  current = null
    //  remainingTokens = tokens
    //  while remainingTokens
    //      if start && current is null
    //          current = []

    //  pull off front/back and check it, should be start/end seq
    //  ret = []
    //  moveQueue = null
    //  varStack = null
    //
    //  for token in tokens
    //      if token.type in property/value
    //          add to move queue
    //      else
    //          flush move queue
    //          if new move
    //              restart move queue

    // tokenizer(raw)
    // -> ["(", ";", "FF", "[" ,"....", "]"]

    //  tokens = []
    //  rest = raw
    //  while rest
    //      if char in {(, ), ;}
    //          add to tokens
    //      if char is [
    //          send to function
    //              get back [, stuff, ], rest
    //              put first 3 in tokens, rest is rest
    //      if char is a-z
    //          send to function
    //              get back identifier, rest
    //              put identifier in tokens, rest is rest

    //reduce(
        //(acc, ??) => shortenedAcc,
        //raw,
    //)

    //  seq = []
    //  raw = trim(raw)
    //  check wrapped in ()
    //  raw = raw[1:-2]
    //  current = null
    //  remaining = raw
    //  variations = false
    //  while remaining > 0
    //      if char == ";"
    //          current = {}
    //          seq.push(current)
    //      if char is a-z
    //          find all a-z to "[", store in var A
    //          find all contents to "]", store in var B
    //          current[A] = B
    //          remaining = those parts removed
    //      if char == "("
    //          variations = true
    //          find matching ")", skip over internal variations?

    // -> [
    //      {FF: 4, GM: 1, SZ: 19}, {B: "aa"}, {W: "bb"},
    //      [
    //        [{B: "cc"}, {W: "dd"}, {B: "ad"}, {W: "bd"}]
    //        [{B: "hh"}, {W: "hg"}]
    //        [
    //          {B: "gg"}, {W: "gh"}, {B: "hh"},
    //          [
    //            [{W: "hg"}, {B: "kk"}],
    //            [{W: "kl"}],
    //          ]
    //        ]
    //      ],
    //    ]
}

function tokenize(rawSgf) {
    const tokens = [];

    let remaining = rawSgf;
    while (remaining) {
        const [next, rest] = nextToken(trimStart(remaining));
        tokens.push(next);

        remaining = rest;
    }

    return tokens;
}

function nextToken(partialSgf) {
    const property = /^[a-zA-Z]+/;
    const value = /[^\\]\]/;
    const first = partialSgf[0];

    if (first === ';')
        return [{type: 'new move'}, partialSgf.substr(1)];
    else if (first === '(')
        return [{type: 'start seq'}, partialSgf.substr(1)];
    else if (first === ')')
        return [{type: 'end seq'}, partialSgf.substr(1)];
    else if (first.match(property)) {
        const [match] = partialSgf.match(property);
        return [{name: match, type: 'property'}, partialSgf.substr(match.length)];
    } else if (first === '[' && partialSgf.match(value)) {
        // value matches length 2, get index for closing bracket
        const endIndex = partialSgf.match(value) + 1;
        const propertyValue = partialSgf.substr(1, endIndex - 1).replace('\\', '');
        return [
            {propertyValue, type: 'property value'},
            partialSgf.substr(endIndex + 1),
        ];
    } else {
        throw 'Broken SGF string';
    }
}
