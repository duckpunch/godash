godash
======

[![npm](https://img.shields.io/npm/v/godash.svg)][npm]
[![Build Status](https://travis-ci.org/duckpunch/godash.svg)][ci]

Data structures and utilities to represent the [game of Go][go].

This library depends on [Immutable.js][immutable] and [lodash][lodash].

Getting Started
---------------

Install `godash` via [npm][npm].

    npm install godash

`require` and use it in your modules.

```javascript
var godash = require('godash');
var board = new godash.Board(19);
var tengen = new godash.Coordinate(9, 9); // 0-based

board.moves.has(tengen); // false

var standard_opening = placeStone(board, tengen, godash.BLACK);
standard_opening.moves.has(tengen); // true
```

[go]: https://en.wikipedia.org/wiki/Go_%28game%29
[immutable]: http://facebook.github.io/immutable-js/
[lodash]: https://lodash.com/
[npm]: https://www.npmjs.com/package/godash
[ci]: https://travis-ci.org/duckpunch/godash
