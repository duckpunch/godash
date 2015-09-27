import {Map} from 'immutable';


function isValidVariationMap(variation) {
    //MapSchema(
        //ListSchema(),  // should match variation key sequence - need to extend schema lib to take variable length list
        //MapSchema(
            //KeyMatches('board'), isBoard,  // need to add this API to schema lib
            //KeyMatches('last_move'), isValidPosition,
            //KeyMatches('meta_stuff'), Something  // not ready for this yet, but should look like this
        //)
    //);
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
