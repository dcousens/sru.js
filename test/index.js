var test = require('tape')
var sru = require('../')

function _cubed (x) {
  return x * x * x
}

test('basic example', function (t) {
  var cache = sru(5)

  function cubed (x) {
    return cache(x, function () {
      t.pass('Called once')
      return _cubed(x)
    })
  }

  t.plan(4) // [pass, equal, equal, equal], shows cache working
  t.equal(cubed(3), 27)
  t.equal(cubed(3), 27)
  t.equal(cubed(3), 27)
})

test('bust', function (t) {
  var cache = sru(5)

  function cubed (x) {
    return cache(x, function (y) {
      t.pass('Called w/ ' + y)
      return _cubed(y)
    })
  }

  t.plan(15) // shows cache busting
  t.equal(cubed(1), 1)
  t.equal(cubed(2), 8)
  t.equal(cubed(3), 27)
  t.equal(cubed(4), 64)
  t.equal(cubed(5), 125)
  t.equal(cubed(6), 216)
  t.equal(cubed(7), 343)

  cache(1, function () {
    t.pass('1 miss')
  })

  cache(4, function () {
    t.fail('4 miss!?')
  })
})

var crypto = require('crypto')

test('trend towards LRU', function (t) {
  function sha1 (x) {
    return crypto.createHash('sha1').update(x).digest()
  }

  function run (size) {
    var counts = {}
    var misses = {}
    var cache = sru(size)

    function test (x) {
      counts[x] = (counts[x] | 0) + 1
      cache(x, function () {
        misses[x] = (misses[x] | 0) + 1
        return 1
      })
    }

    // pseudorandom seed
    var hash = new Buffer('deadbeef', 'hex')

    for (var i = 0; i < 3e5; ++i) {
      hash = sha1(hash)
      var r = hash.readUInt32LE(0) / 0xffffffff

      // probabilities: i (35%), 4 (30%), 3 (20%), 2 (10%), 1 (5%)
      // meaning the cache should tend towards 1,2,3 and 4
      // if variance doesn't kill it
      var z = i
      if (r > 0.7) z = 4
      else if (r > 0.5) z = 3
      else if (r > 0.4) z = 2
      else if (r > 0.35) z = 1

      test(z)
    }

    var hitRates = {}
    ;[1, 2, 3, 4].forEach(function (z) {
      hitRates[z] = parseFloat((1 - (misses[z] / counts[z])).toFixed(3))
    })
    return hitRates
  }

  t.plan(3)

  // cache size of 1, approximates their probabilities
  var rates = run(1)
  t.same(rates, {
    4: 0.303,
    3: 0.2,
    2: 0.103,
    1: 0.051
  })

  // cache size of 10, approaching 100% hit rates
  // but distorted by their distribution tails
  rates = run(10)
  t.same(rates, {
    4: 0.939,
    3: 0.853,
    2: 0.857,
    1: 0.428
  })

  // cache size of 100, near 100% hit rates
  rates = run(100)
  t.same(rates, {
    4: 0.998,
    3: 0.982,
    2: 1,
    1: 0.929
  })
})
