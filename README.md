# Utilities for the game of Go

[![npm](https://img.shields.io/npm/v/godash.svg)][npm]
[![Build Status](https://travis-ci.org/duckpunch/godash.svg)][ci]

Data structures and utilities to represent the [game of Go][go].

This library depends on [Immutable.js][immutable] and [lodash][lodash].

## Getting Started

Install `godash` via [npm][npm].

    npm install godash

`require` and use it in your modules.

```javascript
var go = require('godash');
var board = new godash.Board(19);
var tengen = new godash.Coordinate(9, 9); // 0-based

board.moves.has(tengen); // false

var standardOpening = placeStone(
    board,
    tengen,
    godash.BLACK
);
standardOpening.moves.has(tengen); // true
```

## Roadmap

Godash doesn't currently do very much parameter checking.  It'd probably be
nice to add that.

There also isn't much support for writing SGFs.  This, too, might be added in
the future.  Further, reading SGFs is a bit brittle at the moment since the
full SGF spec is not implemented.

[go]: https://en.wikipedia.org/wiki/Go_%28game%29
[immutable]: http://facebook.github.io/immutable-js/
[lodash]: https://lodash.com/
[npm]: https://www.npmjs.com/package/godash
[ci]: https://travis-ci.org/duckpunch/godash
