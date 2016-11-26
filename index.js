// [0, N) elements
module.exports = function sru (N) {
  var map = {}
  var count = 0
  var i = 0

  return function get (key, f) {
    // XXX: `in` supports undefined results, but is slower
    if (key in map) return map[key]

    // bust?
    if (count >= N) {
      var keys = Object.keys(map)
      var k = keys[i]
      delete map[k]

      i = (i + 1) % N
      --count
    }

    var value = f(key)
    map[key] = value
    ++count

    return value
  }
}
