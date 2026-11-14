import assert from "node:assert";
import {it} from "vitest";
import {stackOrderDescending} from "d3-shape";

it("stackOrderDescending(series) returns an order by sum", () => {
  assert.deepStrictEqual(stackOrderDescending([
    [[0, 1], [0, 2], [0, 3]],
    [[0, 2], [0, 3], [0, 4]],
    [[0, 0], [0, 1], [0, 2]]
  ]), [1, 0, 2]);
});

it("stackOrderDescending(series) treats NaN values as zero", () => {
  assert.deepStrictEqual(stackOrderDescending([
    [[0, 1], [0, 2], [0, 3], [0, NaN]],
    [[0, 2], [0, 3], [0, 4], [0, NaN]],
    [[0, 0], [0, 1], [0, 2], [0, NaN]]
  ]), [1, 0, 2]);
});

it("stackOrderDescending(series) compares absolute-value thickness", () => {
  // thickness: |-1| + |-2| = 3; |1| + |-3| = 4; |2| + |2| = 4; the tied pair
  // keeps its relative order, then the whole ascending order is reversed
  assert.deepStrictEqual(stackOrderDescending([
    [[0, -1], [0, -2]],
    [[0,  1], [0, -3]],
    [[0,  2], [0,  2]]
  ]), [2, 1, 0]);
});
