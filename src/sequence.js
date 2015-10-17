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
        Exactly('last_move'), matchesPositionType,
        Exactly('metadata'), Map.isMap
    )
);


export class Node {
    constructor(nodeData) {
        this.board = new Board(nodeData.get('board'));
        this.metadata = new Board(nodeData.get('metadata'));
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

    getSequence(...path) {
        return new Sequence(this.variationData.get(path));
    }

    // addMove(position, color, path)
    // getSequence(...path):List
    // backed by a map, index by path
    // e.g. [move_number, paths, to, take]
}


export class Sequence {
}
