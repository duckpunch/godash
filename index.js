import {BLACK, WHITE} from './analysis';
import {Board} from './board';
import {position, isValidPosition} from './position';


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
    position,
    isValidPosition,
    BLACK,
    WHITE,
};
