godash
======

[![npm](https://img.shields.io/npm/v/godash.svg)](https://www.npmjs.com/package/godash)
[![Build Status](https://travis-ci.org/duckpunch/godash.svg)](https://travis-ci.org/duckpunch/godash)
[![Document](http://duckpunch.github.io/godash/badge.svg)](http://duckpunch.github.io/godash/)
[![Dependencies](https://david-dm.org/duckpunch/godash.svg)](https://david-dm.org/duckpunch/godash)

A Javascript utility library to handle go board manipulations in immutable data structures.

This library strives only to represent the rules of [Go][go] and corresponding basic analysis.
Immutability is delivered by [ImmutableJS][immutable] and other basic javascript manipulations are done with
[lodash][lodash], this library's namesake.

Getting Started
---------------

Install `godash` via [npm][npm].

    npm install godash

`require` and use it in your modules.

```javascript
var godash = require('godash');
var board = godash.Board(19);
var tengen = godash.Position(9, 9); // 0-based

board.positions.has(tengen); // false

var standard_opening = board.addBlackMove(tengen);
standard_opening.positions.has(tengen); // true
```

### Browser

Grab the [compiled script][compiled] and just use it.

```html
<script src="godash.min.js"></script>
<script>
    // godash added to the window
    godash.Board(19);
</script>
```

Examples
--------

- A [simple goban][goban] in [React][react]

Roadmap
-------

Sporadically working on sequences and variations API.

Then, in no particular order.

- SGF support (import and export)
- Annotations (comments and marks)

[compiled]: https://github.com/duckpunch/godash/blob/master/dist/godash.min.js
[go]: https://en.wikipedia.org/wiki/Go_%28game%29
[goban]: http://duckpunch.github.io/react-simple-goban
[immutable]: http://facebook.github.io/immutable-js/
[lodash]: https://lodash.com/
[npm]: https://www.npmjs.com/package/godash
[react]: https://facebook.github.io/react/
