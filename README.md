godash
======

There have been a few dozen downloads on the [npm page](https://www.npmjs.com/package/godash).  I didn't really expect any at all.  This stuff is still very much in prerelease until I land on an API I like.  As such, I won't be following [semver](http://semver.org/) until then.

> __*That is, I'll be committing API breaking changes in minor releases.*__

Things will work sometimes, but your mileage may vary.

[![Build Status](https://travis-ci.org/duckpunch/godash.svg)](https://travis-ci.org/duckpunch/godash)
[![Document](http://duckpunch.github.io/godash/badge.svg)](http://duckpunch.github.io/godash/)

A Javascript utility library to handle go board manipulations in immutable data structures.

This library is entirely frontend agnostic and strives only to represent the rules of [Go](https://en.wikipedia.org/wiki/Go_%28game%29) and corresponding basic analysis.  Immutability is delivered by [ImmutableJS](http://facebook.github.io/immutable-js/) and other basic javascript manipulations are done with [lodash](https://lodash.com/), this library's namesake.

Getting Started
---------------

TODO

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
