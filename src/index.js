import _ from 'lodash';

import analysis from './analysis';
import transforms from './transforms';


export default _.merge(analysis, transforms);
