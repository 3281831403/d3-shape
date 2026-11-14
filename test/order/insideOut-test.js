import assert from "node:assert";
import {it} from "vitest";
import {stackOrderInsideOut} from "d3-shape";

it("stackOrderInsideOut(series) returns an order by appearance", () => {
  assert.deepStrictEqual(stackOrderInsideOut([
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 1]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 3], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 4], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 5], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 6], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 7], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  ]), [2, 3, 6, 5, 4, 1, 0]);
});

it("stackOrderInsideOut(series) treats NaN values as zero", () => {
  assert.deepStrictEqual(stackOrderInsideOut([
    [[0, 0], [0, NaN], [0, 0], [0, 0], [0, 0], [0, 0], [0, 1]],
    [[0, 0], [0, 0], [0, NaN], [0, 0], [0, 0], [0, 2], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0], [0, 3], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 4], [0, NaN], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 5], [0, 0], [0, 0], [0, NaN], [0, 0]],
    [[0, NaN], [0, 6], [0, 0], [0, NaN], [0, 0], [0, 0], [0, 0]],
    [[0, 7], [0, NaN], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  ]), [2, 3, 6, 5, 4, 1, 0]);
});

it("stackOrderInsideOut(series) uses absolute-value thickness with mixed signs", () => {
  // appearance order by absolute peak: series 0 peaks at index 2, series 1 at index 0
  // thickness: series 0 = |-5| + |3| = 8, series 1 = |2| + |-1| = 3
  assert.deepStrictEqual(stackOrderInsideOut([
    [[0, -5], [0, 3]],
    [[0,  2], [0, -1]]
  ]), [0, 1]);
  // flipping the net sign of series 0 leaves its thickness and the order unchanged
  assert.deepStrictEqual(stackOrderInsideOut([
    [[0, 5], [0, -3]],
    [[0, 2], [0, -1]]
  ]), [0, 1]);
});
