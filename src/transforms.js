import {isNumber} from 'lodash';
import mori from 'mori';

import {SIZE_KEY} from './analysis';


export function emptyBoard(size) {
    if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
        throw 'An empty board must be created from a positive integer.';
    }

    return mori.hashMap(SIZE_KEY, size);
}


export function addBlackMove(board, position) {
    // should be legal position per size

    // should be empty

    // should either be outright legal or can kill

    // remove any dead stones if applicable

    return board.assoc(position, BLACK);
}


export function addWhiteMove(board, position) {
    // TODO
}


export function addBlackMoves(board, positions) {
    // TODO
}


export function addWhiteMoves(board, positions) {
    // TODO
}


export function removeMoves(board, positions) {
    // TODO
}


export default {};
