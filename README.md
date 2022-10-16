# sru
[![build status](https://secure.travis-ci.org/dcousens/sru.png)](http://travis-ci.org/dcousens/sru)
[![Version](http://img.shields.io/npm/v/sru.svg)](https://www.npmjs.org/package/sru)

A dead simple, in memory, somewhat-recently-used cache.

O(1) insertion, retrieval and deletion.


## ESNext alternative

If you can, **don't use this library.**
Use an ESNext [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) instead.


## Examples

``` javascript
function cubed (x) {
  return x * x * x
}

let sru = require('sru')
let cache = sru(100)

console.log(cache(8, cubed), 512)
console.log(cache(8, cubed), 512) // cubed was not called this time
```


## License [MIT](LICENSE)
