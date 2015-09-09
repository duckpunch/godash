import {isNumber} from 'lodash';
import {hashMap} from 'mori';


const BLACK = 'black';
const WHITE = 'white';


export default {
    BLACK, WHITE,

    emptyBoard: function(size) {
        if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
            throw 'An empty board must be created from a positive integer.';
        }

        return hashMap('size', size);
    },

    addBlackMove: function(board, position) {
    },

    addWhiteMove: function(board, position) {
    },

    addBlackMoves: function(board, positions) {
    },

    addWhiteMoves: function(board, positions) {
    },

    removeMoves: function(board, positions) {
    },

    equivalentBoards: function(board, positions) {
    },

    adjacent: function(board, position) {
    },

    illegalMoves: function(board) {
    },

    isValidPosition: function(size, position) {
    },
}
