import {isNumber} from 'lodash';
import {Map} from 'immutable';
import {MapSchema, ListSchema, Exactly} from 'immutable-schema';

import {isValidBoardMap, Board} from './board';
import {matchesPositionType} from './position';


// This schema isn't as thorough as it can be.
const isValidVariationMap = MapSchema(
    ListSchema(isNumber),
    MapSchema(
        Exactly('board'), isValidBoardMap,
        Exactly('last_move'), matchesPositionType
    )
);


export class Node {
    constructor(node_data) {
        this.board = new Board(node_data.get('board'));
        this.metadata = new Board(node_data.get('metadata'));
    }

    getBoard() {
        return this.board;
    }

    getMetadata() {
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
    constructor(variation_data) {
        if (!isValidVariationMap(variation_data)) {
            throw 'Invalid variation map';
        }

        this.variation_data = variation_data;
    }

    getNodeByPath(path) {
        if (this.variation_data.has(path)) {
            return new Node(this.variation_data.get(path));
        } else {
            throw 'No node at the passed path';
        }
    }

    // addMove(position, color, path)
    // getSequence(...path):List
    // backed by a map, index by path
    // e.g. [move_number, paths, to, take]
}
