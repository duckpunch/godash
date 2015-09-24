import {Map} from 'immutable';


function isValidVariationMap(variation) {
    return Map.isMap(variation);
}


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
    }

    // getNodeByPath
    // addMove(position, color, path)
    // getSequence(...path):List
    // backed by a map, index by path
    // e.g. [move_number, paths, to, take]
}
