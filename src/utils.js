import {isNumber} from 'lodash';

/**
 * @private
 */
export function isPositiveInteger(num) {
    return isNumber(num) && num === parseInt(num) && num > 0;
}
