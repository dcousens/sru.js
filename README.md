# sru

[![build status](https://secure.travis-ci.org/dcousens/sru.png)](http://travis-ci.org/dcousens/sru)
[![Version](http://img.shields.io/npm/v/sru.svg)](https://www.npmjs.org/package/sru)

A dead simple, performant somewhat-recently-used cache, busts after N insertions.


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


## License [ISC](LICENSE)
