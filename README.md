godash
======

[![Build Status](https://travis-ci.org/duckpunch/godash.svg)](https://travis-ci.org/duckpunch/godash)
[![Document](http://duckpunch.github.io/godash/badge.svg)](http://duckpunch.github.io/godash/)

A Javascript utility library to handle go board manipulations in immutable data structures.

This library is entirely frontend agnostic and strives only to represent the rules of [Go](https://en.wikipedia.org/wiki/Go_%28game%29) and corresponding basic analysis.  Immutability is delivered by [ImmutableJS](http://facebook.github.io/immutable-js/) and other basic javascript manipulations are done with [lodash](https://lodash.com/), this library's namesake.

Getting Started
---------------

Install `godash` via [npm](https://www.npmjs.com/package/godash).

    npm install godash

`require` and use it in your modules.

    var godash = require('godash');
    godash.Board(19);

### Browser

Grab the [compiled script](https://github.com/duckpunch/godash/blob/master/dist/godash.min.js) and just use it.

    <script src="godash.min.js"></script>
    <script>
        godash.Board(19);
    </script>

Roadmap
-------

First things first.

- Start actually using it.
- Make some examples from it.
- Tweak the API accordingly.

Then, in no particular order.

- SGF support (import and export)
- Sequences (games)
- Variations
- Annotations (comments and marks)
