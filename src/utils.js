import {isNumber} from 'lodash';
import {hashMap} from 'mori';


const BLACK = 'black';
const WHITE = 'white';


export default {
    BLACK, WHITE,
    emptyBoard: function(size) {
        if (!isNumber(size) || size <= 0 || size !== parseInt(size)) {
            throw 'An empty board must be created from a positive integer.';
        }

        return hashMap('size', size);
    },
}
