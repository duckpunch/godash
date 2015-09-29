import {isNumber} from 'lodash';
import {Map} from 'immutable';
import {MapSchema, ListSchema, Exactly} from 'immutable-schema';

import {isValidBoardMap} from './board';
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
            // go get it
        }
    }

    // addMove(position, color, path)
    // getSequence(...path):List
    // backed by a map, index by path
    // e.g. [move_number, paths, to, take]
}
