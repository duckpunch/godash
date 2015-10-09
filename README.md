godash
======

[![npm](https://img.shields.io/npm/v/godash.svg)](https://www.npmjs.com/package/godash)
[![Build Status](https://travis-ci.org/duckpunch/godash.svg)](https://travis-ci.org/duckpunch/godash)
[![Document](http://duckpunch.github.io/godash/badge.svg)](http://duckpunch.github.io/godash/)
[![Dependencies](https://david-dm.org/duckpunch/godash.svg)](https://david-dm.org/duckpunch/godash)

A Javascript utility library to handle go board manipulations in immutable data structures.

This library is entirely frontend agnostic and strives only to represent the rules of [Go](https://en.wikipedia.org/wiki/Go_%28game%29) and corresponding basic analysis.  Immutability is delivered by [ImmutableJS](http://facebook.github.io/immutable-js/) and other basic javascript manipulations are done with [lodash](https://lodash.com/), this library's namesake.

Getting Started
---------------

Install `godash` via [npm](https://www.npmjs.com/package/godash).

    npm install godash

`require` and use it in your modules.

```javascript
var godash = require('godash');
var board = godash.Board(19);
var tengen = godash.position(9, 9); // 0-based

board.positions.has(tengen); // false

var standard_opening = board.addBlackMove(tengen);
standard_opening.positions.has(tengen); // true
```

### Browser

Grab the [compiled script](https://github.com/duckpunch/godash/blob/master/dist/godash.min.js) and just use it.

```html
<script src="godash.min.js"></script>
<script>
    godash.Board(19);
</script>
```

Examples
--------

- A [simple goban](http://duckpunch.github.io/react-simple-goban) in [React](https://facebook.github.io/react/)

Roadmap
-------

Sporadically working on sequences and variations API.

Then, in no particular order.

- SGF support (import and export)
- Annotations (comments and marks)
