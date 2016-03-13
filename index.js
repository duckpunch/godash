import {BLACK, WHITE} from './src/analysis';
import {Board} from './src/board';
import {Position, sgfToXY} from './src/position';
import {Variation, sgfToVariation} from './src/sequence';


/**
 * @external {Map} http://facebook.github.io/immutable-js/docs/#/Map
 */

/**
 * @external {List} http://facebook.github.io/immutable-js/docs/#/List
 */

/**
 * @external {Set} http://facebook.github.io/immutable-js/docs/#/Set
 */


function _Board(...args) {
    return new Board(...args);
}


_Board.prototype = Board.prototype;


function _Variation(...args) {
    return new Variation(...args);
}


_Variation.prototype = Variation.prototype;


export default {
    Board: _Board,
    Variation: _Variation,
    Position,
    BLACK,
    WHITE,
    sgfToXY,
    sgfToVariation,
};
