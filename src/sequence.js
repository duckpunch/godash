import {isNumber} from 'lodash';
import {Map} from 'immutable';
import {MapSchema, ListSchema, Exactly} from 'immutable-schema';

import {isValidBoardMap, Board} from './board';
import {matchesPositionType} from './position';


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
    constructor(nodeData) {
        this.board = new Board(nodeData.get('board'));
        this.metadata = nodeData.get('metadata', Map());
    }

    /**
     * Represents the board state at this node
     *
     * @returns {Board}
     */
    get board() {
        return this.board;
    }

    get metadata() {
        return this.metadata;
    }

    // id in tree
    // move to get here
    // current board
    // next node(s)
    // prev node
    // has next
    // has lots of next
    // add move, returns tree
}


export class Variation {
    constructor(variationData) {
        if (!isValidVariationMap(variationData)) {
            throw 'Invalid variation map';
        }

        this.variationData = variationData;
    }

    getNodeByPath(path) {
        if (this.variationData.has(path)) {
            return new Node(this.variationData.get(path));
        } else {
            throw 'No node at the passed path';
        }
    }

    // addMove(position, color, path)
    // getSequence(...path):List
    // backed by a map, index by path
    // e.g. [move_number, paths, to, take]
}
