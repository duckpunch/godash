import {Board} from './board';
import {Position} from './board';


function _Board(...args) {
    return new Board(...args);
}


function _Position(...args) {
    return new Position(...args);
}


_Board.prototype = Board.prototype;
_Position.prototype = Position.prototype;


export default {
    Board: _Board,
    Position: _Position,
};
