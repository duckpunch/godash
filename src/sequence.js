import {tail, isNumber, reduce} from 'lodash';
import {Map} from 'immutable';
import {MapSchema, ListSchema, Exactly} from 'immutable-schema';

import {isValidBoardMap, Board} from './board';
import {matchesPositionType} from './position';
import {parseSGF} from './utils';


// This schema isn't as thorough as it can be.
// The keys must be sequential
const isValidVariationMap = MapSchema(
    ListSchema(isNumber),
    MapSchema(
        Exactly('board'), isValidBoardMap,
        Exactly('last_move'), matchesPositionType,
        Exactly('metadata'), Map.isMap
    )
);


/**
 * Node represents a Board in a Variation.  That is, the board state along with any metadata
 * like annotations.
 *
 * This class is not intended to be instantiated by public consumers.
 */
export class Node {
    /**
     * @private
     */
    constructor(board, variation) {
        this._board = board;
        this._variation = variation;
    }

    /**
     * Board state at this node
     *
     * @returns {Board}
     */
    get board() {
        return this._board;
    }

    /**
     * Variation for this Node
     *
     * @returns {Variation}
     */
    get variation() {
        return this._variation;
    }
}


/**
 * Tree of moves, represented by Nodes.
 */
export class Variation {
    /**
     * Create a Variation.
     *
     * @param {number} boardSize optional board size, defaults to 19
     */
    constructor(boardSize) {
        if (!boardSize) {
            boardSize = 19;
        }
        this._root = new Node(new Board(boardSize), this);
    }

    /**
     * Root node of this variation tree.
     *
     * @returns {Node}
     */
    get root() {
        this._root;
    }
}


export function sgfToVariation(rawSgf) {
    const [infoMove, ...gameSequence] = parseSGF(rawSgf);
    const boardSequence = [];

    let board = Board(parseInt(infoMove.SZ));
    boardSequence.push(board);
    for (let i = 0; i < gameSequence.length; i++) {

    }
}







