import none from "./none.js";

export default function(series) {
  var peaks = series.map(peak);
  return none(series).sort(function(a, b) { return peaks[a] - peaks[b]; });
}

// Position of the series’ largest magnitude: the absolute-value peak, so that
// a negative peak counts as strongly as a positive one. NaN values are skipped,
// matching the previous treatment of NaN as zero; an all-NaN series peaks at 0.
function peak(series) {
  var i = -1, j = 0, n = series.length, vi, vj = -Infinity;
  while (++i < n) {
    vi = +series[i][1];
    if (!isNaN(vi) && Math.abs(vi) > vj) vj = Math.abs(vi), j = i;
  }
  return j;
}
