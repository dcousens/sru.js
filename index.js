// [0, N) elements
module.exports = function sru (N) {
  let map = {}
  let count = 0
  let i = 0

  return function get (key, f) {
    // XXX: `in` supports undefined results, but is slower
    if (key in map) return map[key]

    // bust?
    if (count >= N) {
      delete map[Object.keys(map)[i]]

      i = (i + 1) % N
      --count
    }

    let value = f(key)
    map[key] = value
    ++count

    return value
  }
}
