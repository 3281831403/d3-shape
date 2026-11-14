export default function(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += Math.abs(series[i][j][1] || 0);
    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }

  // Sign-aware stacking: positive layers grow upward from the zero baseline,
  // negative layers grow downward, zero layers keep the current baseline (as in
  // offsetNone) and NaN layers are placed at zero. For non-negative data this
  // is byte-identical to the previous offsetNone-based behavior.
  for (var i1, j1 = 0, n1 = series.length, m1 = series[order[0]].length, yp, yn, d, dy; j1 < m1; ++j1) {
    yp = 0, yn = 0;
    for (i1 = 0; i1 < n1; ++i1) {
      d = series[order[i1]][j1], dy = d[1];
      if (dy > 0) d[0] = yp, d[1] = yp += dy;
      else if (dy < 0) d[1] = yn, d[0] = yn += dy;
      else if (isNaN(dy)) d[0] = 0; // NaN layers sit on the zero baseline
      else d[0] = yp, d[1] = yp; // zero layers keep the current baseline
    }
  }
}
