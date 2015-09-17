import _ from 'lodash';

import analysis from './analysis';
import transforms from './transforms';
import {Board} from './board';


/**
 * @external {Map} http://facebook.github.io/immutable-js/docs/#/Map
 */

/**
 * @external {List} http://facebook.github.io/immutable-js/docs/#/List
 */

/**
 * @external {Set} http://facebook.github.io/immutable-js/docs/#/Set
 */


export default _.merge(analysis, transforms, {Board});
