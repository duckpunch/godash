import {isNumber} from 'lodash';
import mori from 'mori';


export const BLACK = 'black';
export const WHITE = 'white';


export function emptyBoard(size) {
    if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
        throw 'An empty board must be created from a positive integer.';
    }

    return mori.hashMap('size', size);
}


export function emptySpaces(board) {
    let size = mori.get(board, 'size');
}


export function addBlackMove(board, position) {
    // should be legal position per size

    // should be empty

    // should either be outright legal or can kill

    // remove any dead stones if applicable

    return board.assoc(position, BLACK);
}


export default {
    addBlackMove: function(board, position) {
        // TODO
    },

    addWhiteMove: function(board, position) {
        // TODO
    },

    addBlackMoves: function(board, positions) {
        // TODO
    },

    addWhiteMoves: function(board, positions) {
        // TODO
    },

    removeMoves: function(board, positions) {
        // TODO
    },

    equivalentBoards: function(board, positions) {
        // TODO
    },

    adjacent: function(board, position) {
        // TODO
    },

    illegalMoves: function(board) {
        // TODO
    },

    isValidPosition: function(size, position) {
        // TODO
    },
}
