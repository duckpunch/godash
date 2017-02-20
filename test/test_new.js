import assert from 'assert';
import {
    Coordinate,
    sgfPointToCoordinate,
} from '../src/new';


describe('sgfPointToCoordinate', function() {
    it('converts "aa" to (0, 0)', function() {
        assert.ok(
            (new Coordinate(0, 0)).equals(
                sgfPointToCoordinate('aa')
            )
        );
    });

    it('converts "hi" to (7, 8)', function() {
        assert.ok(
            (new Coordinate(7, 8)).equals(
                sgfPointToCoordinate('hi')
            )
        );
    });

    it('raises if passed a non-string', function() {
        assert.throws(function() {
            sgfPointToCoordinate(5);
        }, TypeError);
    });

    it('raises if passed string not length 2', function() {
        assert.throws(function() {
            sgfPointToCoordinate('roar');
        }, TypeError);
    });
});

