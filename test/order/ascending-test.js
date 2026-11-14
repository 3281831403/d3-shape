import assert from "node:assert";
import {it} from "vitest";
import {stackOrderAscending} from "d3-shape";

it("stackOrderAscending(series) returns an order by sum", () => {
  assert.deepStrictEqual(stackOrderAscending([
    [[0, 1], [0, 2], [0, 3]],
    [[0, 2], [0, 3], [0, 4]],
    [[0, 0], [0, 1], [0, 2]]
  ]), [2, 0, 1]);
});

it("stackOrderAscending(series) treats NaN values as zero", () => {
  assert.deepStrictEqual(stackOrderAscending([
    [[0, 1], [0, 2], [0, NaN], [0, 3]],
    [[0, 2], [0, 3], [0, NaN], [0, 4]],
    [[0, 0], [0, 1], [0, NaN], [0, 2]]
  ]), [2, 0, 1]);
});

it("stackOrderAscending(series) compares absolute-value thickness", () => {
  // thickness: |-1| + |-2| = 3; |1| + |-3| = 4; |2| + |2| = 4
  assert.deepStrictEqual(stackOrderAscending([
    [[0, -1], [0, -2]],
    [[0,  1], [0, -3]],
    [[0,  2], [0,  2]]
  ]), [0, 1, 2]);
});

it("stackOrderAscending(series) is stable when a series changes net sign", () => {
  // same magnitudes as a non-negative layout: flipping every sign of series 0
  // must not swap the order
  const positive = [
    [[0, 5], [0, 5]],
    [[0, 2], [0, 2]]
  ];
  const flipped = [
    [[0, -5], [0, -5]],
    [[0,  2], [0,  2]]
  ];
  assert.deepStrictEqual(stackOrderAscending(positive), stackOrderAscending(flipped));
  assert.deepStrictEqual(stackOrderAscending(flipped), [1, 0]);
});
