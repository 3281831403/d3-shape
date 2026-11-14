import assert from "node:assert";
import {it} from "vitest";
import {stackOffsetExpand, stackOrderNone, stackOrderReverse} from "d3-shape";

it("stackOffsetExpand(series, order) expands to fill [0, 1]", () => {
  const series = [
    [[0, 1], [0, 2], [0, 1]],
    [[0, 3], [0, 4], [0, 2]],
    [[0, 5], [0, 2], [0, 4]]
  ];
  stackOffsetExpand(series, stackOrderNone(series));
  assert.deepStrictEqual(series, [
    [[0 / 9, 1 / 9], [0 / 8, 2 / 8], [0 / 7, 1 / 7]],
    [[1 / 9, 4 / 9], [2 / 8, 6 / 8], [1 / 7, 3 / 7]],
    [[4 / 9, 9 / 9], [6 / 8, 8 / 8], [3 / 7, 7 / 7]]
  ]);
});

it("stackOffsetExpand(series, order) treats NaN as zero", () => {
  const series = [
    [[0, 1], [0,   2], [0, 1]],
    [[0, 3], [0, NaN], [0, 2]],
    [[0, 5], [0,   2], [0, 4]]
  ];
  stackOffsetExpand(series, stackOrderNone(series));
  assert(isNaN(series[1][1][1]));
  series[1][1][1] = "NaN"; // can’t assert.strictEqual NaN
  assert.deepStrictEqual(series, [
    [[0 / 9, 1 / 9], [0 / 4, 2 / 4], [0 / 7, 1 / 7]],
    [[1 / 9, 4 / 9], [0, "NaN"], [1 / 7, 3 / 7]],
    [[4 / 9, 9 / 9], [2 / 4, 4 / 4], [3 / 7, 7 / 7]]
  ]);
});

it("stackOffsetExpand(series, order) observes the specified order", () => {
  const series = [
    [[0, 1], [0, 2], [0, 1]],
    [[0, 3], [0, 4], [0, 2]],
    [[0, 5], [0, 2], [0, 4]]
  ];
  stackOffsetExpand(series, stackOrderReverse(series));
  assert.deepStrictEqual(series, [
    [[8 / 9, 9 / 9], [6 / 8, 8 / 8], [6 / 7, 7 / 7]],
    [[5 / 9, 8 / 9], [2 / 8, 6 / 8], [4 / 7, 6 / 7]],
    [[0 / 9, 5 / 9], [0 / 8, 2 / 8], [0 / 7, 4 / 7]]
  ]);
});

it("stackOffsetExpand(series, order) normalizes mixed signs by absolute-value totals", () => {
  // column 0: all negative (-2, -4), denominator 6 — layers stay below zero
  // column 1: balanced (3, -3), denominator 6 — still normalized
  // column 2: mixed (3, -1), denominator 4 — positive above, negative below
  const series = [
    [[0, -2], [0, 3], [0,  3]],
    [[0, -4], [0, -3], [0, -1]]
  ];
  stackOffsetExpand(series, stackOrderNone(series));
  assert.deepStrictEqual(series, [
    [[-1 / 3, 0], [0, 1 / 2], [0, 3 / 4]],
    [[-1, -1 / 3], [-1 / 2, 0], [-1 / 4, 0]]
  ]);
  // every layer lies within [-1, 1] and no value crosses the zero baseline
  for (const s of series) for (const [y0, y1] of s) {
    assert(y0 >= -1 && y1 <= 1);
    assert(y0 <= 0 && y1 <= 0 || y0 >= 0 && y1 >= 0);
  }
});

it("stackOffsetExpand(series, order) leaves all-zero columns at the zero baseline", () => {
  const series = [
    [[0, 0], [0, 2]],
    [[0, 0], [0, -2]]
  ];
  stackOffsetExpand(series, stackOrderNone(series));
  assert.deepStrictEqual(series, [
    [[0, 0], [0, 1 / 2]],
    [[0, 0], [-1 / 2, 0]]
  ]);
});

it("stackOffsetExpand(series, order) handles mixed signs in reverse order", () => {
  const series = [
    [[0,  3], [0, -2]],
    [[0, -1], [0, -4]]
  ];
  stackOffsetExpand(series, stackOrderReverse(series)); // order [1, 0]
  assert.deepStrictEqual(series, [
    [[0, 3 / 4], [-1, -2 / 3]],
    [[-1 / 4, 0], [-2 / 3, 0]]
  ]);
});
