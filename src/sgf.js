/**
 * @module SGF
 */

import {
  Coordinate,
} from './board';
import {
  fromPairs,
  isArray,
  isString,
  last,
  startsWith,
  trimStart,
} from 'lodash';

export const START_MOVE = ';';
export const START = '(';
export const END = ')';

/**
 * Converts a [`Coordinate`](#coordinate) to an [SGF Point][sgf-point] in the
 * form of a Javascript `String`.
 *
 * [sgf-point]: http://www.red-bean.com/sgf/go.html
 *
 * @example
 * coordinateToSgfPoint(Coordinate(0, 0))
 * // => "aa"
 *
 * @param {Coordinate} coordinate - Coordinate to convert.
 * @return {string} 2-character string representing an [SGF Point][sgf-point]
 */
export function coordinateToSgfPoint(coordinate) {
  return String.fromCharCode(97 + coordinate.x) + String.fromCharCode(
    97 + coordinate.y,
  );
}

/**
 * Converts an [SGF Point][sgf-point] to a [`Coordinate`](#coordinate).
 *
 * [sgf-point]: http://www.red-bean.com/sgf/go.html
 *
 * @example
 * sgfPointToCoordinate('hi').toString();
 * // => Coordinate { "x": 7, "y": 8 }
 *
 * @param {string} sgfPoint - 2-character string representing an [SGF
 * Point][sgf-point]
 * @return {Coordinate} Corresponding [`Coordinate`](#coordinate).
 */
export function sgfPointToCoordinate(sgfPoint) {
  if (isString(sgfPoint) && sgfPoint.length === 2) {
    return Coordinate(
      sgfPoint.charCodeAt(0) - 97,
      sgfPoint.charCodeAt(1) - 97,
    );
  } else {
    throw new TypeError('Must pass a string of length 2');
  }
}

/**
 * Converts a raw [SGF][sgf] string into a plain Javascript array.  Note that
 * unlike [`Board`](#board), the results of this function is a mutable object.
 *
 * [sgf]: http://www.red-bean.com/sgf/index.html
 *
 * @example
 * var rawSgf = `(
 *     ;FF[4]GM[1]SZ[19];B[aa];W[bb]
 *         (;B[cc];W[dd];B[ad];W[bd])
 *         (;B[hh];W[hg]C[what a move!])
 *         (;B[gg];W[gh];B[hh]
 *             (;W[hg];B[kk])
 *             (;W[kl])
 *         )
 * )`;
 *
 * sgfToJS(rawSgf);
 * // => [
 * //        {FF: '4', GM: '1', SZ: '19'}, {B: 'aa'}, {W: 'bb'},
 * //        [
 * //            [{B: 'cc'}, {W: 'dd'}, {B: 'ad'}, {W: 'bd'}],
 * //            [{B: 'hh'}, {W: 'hg', C: 'what a move!'}],
 * //            [
 * //                {B: 'gg'}, {W: 'gh'}, {B: 'hh'},
 * //                [
 * //                    [{W: 'hg'}, {B: 'kk'}],
 * //                    [{W: 'kl'}]
 * //                ]
 * //            ]
 * //        ]
 * //    ];
 *
 * @param {string} sgf - Raw [SGF][sgf] string to be parsed.
 * @return {Array} Unpacked SGF in plain Javascript objects.
 */
export function sgfToJS(sgf) {
  let mainLine = null;
  const variationStack = [];
  const tokens = compactMoves(tokenize(sgf));

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const current = last(variationStack);

    switch(token) {
      case START:
        const nextVariation = [];

        if (mainLine === null) {
          mainLine = nextVariation;
        }

        variationStack.push(nextVariation);

        if (current) {
          if (!isArray(last(current))) {
            current.push([nextVariation]);
          } else {
            last(current).push(nextVariation);
          }
        }
        break;
      case END:
        variationStack.pop();
        break;
      default:
        current.push(token);
        break;
    }
  }

  if (variationStack.length > 0) {
    throw new Error('broken thing with too few ENDs');
  }

  return mainLine;
}

export function compactMoves(tokens) {
  const compacted = [];
  let current = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    switch(token) {
      case START:
      case END:
        if (current !== null) {
          compacted.push(fromPairs(current));
          current = null;
        }

        compacted.push(token);
        break;
      case START_MOVE:
        if (current !== null) {
          compacted.push(fromPairs(current));
          current = null;
        }
        current = [];
        break;
      default:
        current.push(token);
        break;
    }
  }

  return compacted;
}

export function tokenize(rawSgf) {
  const tokens = [];

  let remaining = rawSgf;
  while (remaining) {
    const [next, rest] = nextToken(trimStart(remaining));
    tokens.push(next);

    remaining = rest;
  }

  return tokens;
}

export function nextToken(partialSgf) {
  const keyPattern = /^[a-zA-Z]+/;
  const valuePattern = /[^\\]\]/;
  const first = partialSgf[0];

  switch(first) {
    case START:
    case END:
    case START_MOVE:
      return [first, partialSgf.substr(1)];
    default:
      if (partialSgf.match(keyPattern) === null) {
        throw new Error('Invalid SGF');
      }

      const key = partialSgf.match(keyPattern)[0];
      const rest = partialSgf.substr(key.length).trim();
      const valueMatch = rest.match(valuePattern);

      if (!startsWith(rest, '[') || valueMatch === null) {
        throw new Error('Invalid SGF');
      }

      const backslashSentinel = '@@BACKSLASH@@';
      const value = rest.substr(1, valueMatch.index)
        .replace(/\\\\/g, backslashSentinel)
        .replace(/\\/g, '')
        .replace(backslashSentinel, '\\');

      return [
        [key, value],
        rest.substr(valueMatch.index + 2),
      ];
  }
}

export default {
  coordinateToSgfPoint,
  sgfPointToCoordinate,
  sgfToJS,
};
