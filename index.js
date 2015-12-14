import {BLACK, WHITE} from './src/analysis';
import {Board} from './src/board';
import {Position} from './src/position';


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


export default {
    Board: _Board,
    Position,
    BLACK,
    WHITE,
};
