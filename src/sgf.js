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

export function coordinateToSgfPoint(coordinate) {
    return String.fromCharCode(97 + coordinate.x) + String.fromCharCode(97 + coordinate.y);
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

export function sgfToJS(sgf) {
    let mainLine = null;
    const variationStack = [];
    const tokens = compactMoves(tokenize(sgf));

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
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
        throw 'broken thing with too few ENDs';
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
                throw 'Invalid SGF';
            }

            const key = partialSgf.match(keyPattern)[0];
            const rest = partialSgf.substr(key.length).trim();
            const valueMatch = rest.match(valuePattern);

            if (!startsWith(rest, '[') || valueMatch === null) {
                throw 'Invalid SGF';
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
