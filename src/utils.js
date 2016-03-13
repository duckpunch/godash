import {tail, fromPairs, map, slice, forEach, isNumber, trim} from 'lodash';


/**
 * @private
 */
export function isPositiveInteger(num) {
    return isNumber(num) && num === parseInt(num) && num > 0;
}


/**
 * @private
 */
export function parseSGF(raw_sgf_string) {
    const moves = tail(raw_sgf_string.split(';'));
    return map(moves, parseMove);
}


/**
 * @private
 */
export function parseMove(move) {
    const token = /[A-Z][A-Z]?\[[^\]]+\]/g;
    const move_tokens = move.match(token);

    if (move_tokens) {
        const key_value = /([A-Z][A-Z]?)\[([\s\S]+)\]/;
        const pairs = map(move_tokens, token => slice(key_value.exec(token), 1, 3));
        return fromPairs(pairs);
    } else {
        return {};
    }
}
