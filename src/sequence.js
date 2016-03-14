import {forEach} from 'lodash';
import {Map, List} from 'immutable';

import {Board} from './board';
import {Position, sgfToXY} from './position';
import {parseSGF} from './utils';


/**
 * Tree of moves, represented by Nodes.
 */
export class Variation {
    /**
     * Create a Variation.
     *
     * @param {number} boardSize optional board size, defaults to 19
     */
    constructor(boardSize) {
        if (!boardSize) {
            boardSize = 19;
        }
        this._variation = Map().set(List.of(0), (new Board(boardSize))._position);
    }

    /**
     * Get the board at provided index.
     *
     * @param {number} index index to fetch
     */
    getBoardAt(index) {
        const key = List.of(index);
        if (this._variation.has(key)) {
            return new Board(this._variation.get(key));
        } else {
            return null;
        }
    }
}


/**
 * Convert raw SGF into Variation
 *
 * @param {string} rawSgf SGF string to convert
 */
export function sgfToVariation(rawSgf) {
    const [infoMove, ...gameSequence] = parseSGF(rawSgf);
    const variation = new Variation(parseInt(infoMove.SZ));

    let rawVariation = variation._variation;
    let board = variation.getBoardAt(0);

    // TODO: Use actual position methods after they're written instead of building
    // raw immutable data
    forEach(gameSequence, (move, index) => {
        if (move.B) {
            board = board.addBlackMove(Position(...sgfToXY(move.B)));
            rawVariation = rawVariation.set(List.of(index + 1), board._position);
        } else if (move.W) {
            board = board.addWhiteMove(Position(...sgfToXY(move.W)));
            rawVariation = rawVariation.set(List.of(index + 1), board._position);
        } else {
            throw Error('Something broken - missing move?');
        }
    });

    variation._variation = rawVariation;
    return variation;
}
