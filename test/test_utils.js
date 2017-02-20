import assert from 'assert';
import {parseSGF, parseMove} from '../src/utils';

//describe('parseSGF', function() {
    //it('produces a list from an SGF with no variation', function() {
        //const parsed_sequence = parseSGF('(;GM[1];B[ab];W[cd])');
        //assert.deepEqual(parsed_sequence, [
            //{GM: '1'},
            //{B: 'ab'},
            //{W: 'cd'},
        //]);
    //});

    //it('produces a list from an SGF with no variation and multi-attributes', function() {
        //const parsed_sequence = parseSGF('(;GM[1]TM[7200];B[ab];W[cd])');

        //assert.deepEqual(parsed_sequence, [
            //{GM: '1', TM: '7200'},
            //{B: 'ab'},
            //{W: 'cd'},
        //]);
    //});
//});

//describe('parseMove', function() {
    //it('returns an empty object when the move pattern is empty', function() {
        //const empty_parsed_move = parseMove('');
        //assert.deepEqual(empty_parsed_move, {});
    //});

    //it('returns an empty object when the move pattern is not matched', function() {
        //const parsed_move = parseMove('fooo');
        //assert.deepEqual(parsed_move, {});
    //});

    //it('returns an object representing a move with a single attribute', function() {
        //const parsed_move = parseMove('B[ab]');
        //assert.deepEqual(parsed_move, {B: 'ab'});
    //});

    //it('returns an object representing a move with a many attributes', function() {
        //const parsed_move = parseMove('PC[ab]SZ[19]');
        //assert.deepEqual(parsed_move, {PC: 'ab', SZ: '19'});
    //});
    //it('returns an object representing a move with a many attributes and whitespaces', function() {
        //const parsed_move = parseMove('PC[ab]   \nSZ[19]  ');
        //assert.deepEqual(parsed_move, {PC: 'ab', SZ: '19'});
    //});
//});
