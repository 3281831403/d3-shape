import none from "./none.js";

export default function(series) {
  var sums = series.map(sum);
  return none(series).sort(function(a, b) { return sums[a] - sums[b]; });
}

// Thickness of a series: sum of absolute values, so that a series whose net
// value changes sign keeps the same thickness instead of swapping order.
// NaN values (and missing fields, coerced to zero upstream) contribute nothing.
export function sum(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) if (v = +series[i][1]) s += Math.abs(v);
  return s;
}
