godash
======

[![npm](https://img.shields.io/npm/v/godash.svg)](https://www.npmjs.com/package/godash)
[![Build Status](https://travis-ci.org/duckpunch/godash.svg)](https://travis-ci.org/duckpunch/godash)
[![Document](http://duckpunch.github.io/godash/badge.svg)](http://duckpunch.github.io/godash/)
[![Dependencies](https://david-dm.org/duckpunch/godash.svg)](https://david-dm.org/duckpunch/godash)

A Javascript utility library to handle go board manipulations in immutable data structures.

This library strives only to represent the rules of [Go][0] and corresponding basic analysis.
Immutability is delivered by [ImmutableJS][1] and other basic javascript manipulations are done with
[lodash][2], this library's namesake.

Getting Started
---------------

Install `godash` via [npm][3].

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

Grab the [compiled script][4] and just use it.

```html
<script src="godash.min.js"></script>
<script>
    // godash added to the window
    godash.Board(19);
</script>
```

Examples
--------

- A [simple goban][5] in [React][6]

Roadmap
-------

Sporadically working on sequences and variations API.

Then, in no particular order.

- SGF support (import and export)
- Annotations (comments and marks)

[0]: https://en.wikipedia.org/wiki/Go_%28game%29
[1]: http://facebook.github.io/immutable-js/
[2]: https://lodash.com/
[3]: https://www.npmjs.com/package/godash
[4]: https://github.com/duckpunch/godash/blob/master/dist/godash.min.js
[5]: http://duckpunch.github.io/react-simple-goban
[6]: https://facebook.github.io/react/
