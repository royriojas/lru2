[![NPM Version](http://img.shields.io/npm/v/lru2.svg?style=flat)](https://npmjs.org/package/lru2)
[![Build Status](http://img.shields.io/travis/royriojas/lru2.svg?style=flat)](https://travis-ci.org/royriojas/lru2)

# lru2
`lru2` Yet another LRU module with a very simple API. Just get/set and no more.

## Motivation
I needed a super simple `lru2` there were others having more methods than the ones I required.
## Install

```bash
npm i -D lru2
```

## Usage

```javascript
// create the cache
var lru2 = require('lru2').create({ limit: 3 }); // limit=0 for no limit

// set an entry
lru2.set('key', { some: value});

// get the value
lru2.get('key') // some value if present

// get not existent key
lru2.get('someMissingKey') // will return null

// get the current state of the cache
lru2.toArray(); // [ { key: 'key',  value: { some : 'value' }}]

// peek some value (without marking it as recently used)
var entry = lru2.peek('key'); // undefined if key does not exists

// removes the entry regardless if it is recently used or not
lru2.remove('key');

//
var lru2 = require('lru2').create({
  limit: 3, // limit=0 for no limit
  onRemoveEntry: function (entry) {
    // perform the clean up
    // of heavy resources here:
    entry.destroy(); // clear db connections or other heavy resources used
  }
});
```

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
