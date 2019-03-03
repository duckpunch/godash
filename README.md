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
var godash = require('godash');
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

## Why Godash?

Godash provides the "primitives" for Go manipulations necessary for creating
UIs that go beyond a simple SGF player.  You can mix and match the functions
provided to create whatever wacky UI you want without having to reinvent the
wheel every time.

Godash also strives to keep a clean and simple API so that new functionality
can be easily extended.

Check out the [documentation][godash-docs] to see what Godash provides.

## Roadmap

Godash doesn't currently do very much parameter checking.  It'd probably be
nice to add that.

There also isn't much support for writing SGFs.  This, too, might be added in
the future.  Further, reading SGFs is a bit brittle at the moment since the
full SGF spec is not implemented.

## Related Projects

* [Elixir port][port] - port to [Elixir][elixir] by [kokolegorille][koko]
* [pizza][pizza] - an anonymous go server ([source][pizza-code])
* [react-go-board][rgb] - a simple go board component for [React][react]
* [Way to Go][wtg] - a rewrite of Hiroki Mori's [Interactive Way to Go][iwtg]

[ci]: https://travis-ci.org/duckpunch/godash
[elixir]: https://elixir-lang.org/
[go]: https://en.wikipedia.org/wiki/Go_%28game%29
[godash-docs]: http://duckpunch.github.io/godash/documentation/
[immutable]: http://facebook.github.io/immutable-js/
[iwtg]: http://playgo.to/iwtg/en/
[koko]: https://github.com/kokolegorille/
[lodash]: https://lodash.com/
[npm]: https://www.npmjs.com/package/godash
[pizza]: https://pizza.duckpun.ch/
[pizza-code]: https://gitlab.com/duckpunch/pizza
[port]: https://github.com/kokolegorille/go
[react]: https://reactjs.org/
[rgb]: https://github.com/duckpunch/react-go-board
[wtg]: https://wtg.duckpun.ch/
