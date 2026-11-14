import assert from "node:assert";
import {it} from "vitest";
import {stackOrderAppearance} from "d3-shape";

it("stackOrderAppearance(series) returns an order by appearance", () => {
  assert.deepStrictEqual(stackOrderAppearance([
    [[0, 0], [0, 0], [0, 1]],
    [[0, 3], [0, 2], [0, 0]],
    [[0, 0], [0, 4], [0, 0]]
  ]), [1, 2, 0]);
});

it("stackOrderAppearance(series) treats NaN values as zero", () => {
  assert.deepStrictEqual(stackOrderAppearance([
    [[0, NaN], [0, NaN], [0, 1]],
    [[0, 3], [0, 2], [0, NaN]],
    [[0, NaN], [0, 4], [0, NaN]]
  ]), [1, 2, 0]);
});

it("stackOrderAppearance(series) orders by the absolute-value peak", () => {
  // peaks: series 0 at index 2 (|-5| = 5), series 1 at index 0 (4), series 2 at index 1 (3)
  assert.deepStrictEqual(stackOrderAppearance([
    [[0,  1], [0,  2], [0, -5]],
    [[0, -4], [0,  2], [0,  0]],
    [[0,  0], [0, -3], [0,  1]]
  ]), [1, 2, 0]);
});

it("stackOrderAppearance(series) is stable when a peak changes sign", () => {
  const positive = [
    [[0, 1], [0, 5], [0, 0]],
    [[0, 4], [0, 0], [0, 0]]
  ];
  const flipped = [
    [[0,  1], [0, -5], [0, 0]],
    [[0, -4], [0,  0], [0, 0]]
  ];
  assert.deepStrictEqual(stackOrderAppearance(positive), stackOrderAppearance(flipped));
  assert.deepStrictEqual(stackOrderAppearance(flipped), [1, 0]);
});
