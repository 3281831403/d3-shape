import assert from "node:assert";
import {it} from "vitest";
import {stack, stackOffsetExpand, stackOffsetNone, stackOrderNone, stackOrderReverse} from "d3-shape";

it("stack() has the expected defaults", () => {
  const s = stack();
  assert.deepStrictEqual(s.keys()(), []);
  assert.strictEqual(s.value()({foo: 42}, "foo"), 42);
  assert.strictEqual(s.order(), stackOrderNone);
  assert.strictEqual(s.offset(), stackOffsetNone);
});

it("stack(data) computes the stacked series for the given data", () => {
  const s = stack().keys([0, 1, 2, 3]);
  const data = [[1, 3, 5, 1], [2, 4, 2, 3], [1, 2, 4, 2]];
  assert.deepStrictEqual(s(data), [
    series([[0,  1], [0,  2], [0, 1]], data, 0, 0),
    series([[1,  4], [2,  6], [1, 3]], data, 1, 1),
    series([[4,  9], [6,  8], [3, 7]], data, 2, 2),
    series([[9, 10], [8, 11], [7, 9]], data, 3, 3)
  ]);
});

it("stack.keys(array) sets the array of constant keys", () => {
  const s = stack().keys(["0.0", "2.0", "4.0"]);
  assert.deepStrictEqual(s.keys()(), ["0.0", "2.0", "4.0"]);
});

it("stack.keys(function) sets the key accessor function", () => {
  const s = stack().keys(function() { return "abc".split(""); });
  assert.deepStrictEqual(s.keys()(), ["a", "b", "c"]);
});

it("stack(data, arguments…) passes the key accessor any additional arguments", () => {
  let A;
  let B;
  let k = function(data, a, b) { A = a, B = b; return Object.keys(data[0]); };
  let s = stack().keys(k);
  let data = [[1, 3, 5, 1], [2, 4, 2, 3], [1, 2, 4, 2]];
  assert.deepStrictEqual(s(data, "foo", "bar"), [
    series([[0,  1], [0,  2], [0, 1]], data, "0", 0),
    series([[1,  4], [2,  6], [1, 3]], data, "1", 1),
    series([[4,  9], [6,  8], [3, 7]], data, "2", 2),
    series([[9, 10], [8, 11], [7, 9]], data, "3", 3)
  ]);
  assert.strictEqual(A, "foo");
  assert.strictEqual(B, "bar");
});

it("stack.value(number) sets the constant value", () => {
  const s = stack().value("42.0");
  assert.strictEqual(s.value()(), 42);
});

it("stack.value(function) sets the value accessor function", () => {
  const v = function() { return 42; };
  const s = stack().value(v);
  assert.strictEqual(s.value(), v);
});

it("stack(data) passes the value accessor datum, key, index and data", () => {
  let actual;
  let v = function(d, k, i, data) { actual = {datum: d, key: k, index: i, data: data}; return 2; };
  let s = stack().keys(["foo"]).value(v);
  let data = [{foo: 1}];
  assert.deepStrictEqual(s(data), [series([[0, 2]], data, "foo", 0)]);
  assert.deepStrictEqual(actual, {datum: data[0], key: "foo", index: 0, data: data});
});

it("stack(data) coerces the return value of the value accessor to a number", () => {
  const v = function() { return "2.0"; };
  const s = stack().keys(["foo"]).value(v);
  const data = [{foo: 1}];
  assert.deepStrictEqual(s(data), [series([[0, 2]], data, "foo", 0)]);
});

it("stack.order(null) is equivalent to stack.order(stackOrderNone)", () => {
  const s = stack().order(null);
  assert.strictEqual(s.order(), stackOrderNone);
  assert.strictEqual(typeof s.order(), "function");
});

it("stack.order(function) sets the order function", () => {
  const s = stack().keys([0, 1, 2, 3]).order(stackOrderReverse);
  const data = [[1, 3, 5, 1], [2, 4, 2, 3], [1, 2, 4, 2]];
  assert.strictEqual(s.order(), stackOrderReverse);
  assert.deepStrictEqual(s(data), [
    series([[9, 10], [9, 11], [8, 9]], data, 0, 3),
    series([[6,  9], [5,  9], [6, 8]], data, 1, 2),
    series([[1,  6], [3,  5], [2, 6]], data, 2, 1),
    series([[0,  1], [0,  3], [0, 2]], data, 3, 0)
  ]);
});

it("stack.offset(null) is equivalent to stack.offset(stackOffsetNone)", () => {
  const s = stack().offset(null);
  assert.strictEqual(s.offset(), stackOffsetNone);
  assert.strictEqual(typeof s.offset(), "function");
});

it("stack.offset(function) sets the offset function", () => {
  const s = stack().keys([0, 1, 2, 3]).offset(stackOffsetExpand);
  const data = [[1, 3, 5, 1], [2, 4, 2, 3], [1, 2, 4, 2]];
  assert.strictEqual(s.offset(), stackOffsetExpand);
  assert.deepStrictEqual(s(data).map(roundSeries), [
    [[0 / 10,  1 / 10], [0 / 11,  2 / 11], [0 / 9, 1 / 9]],
    [[1 / 10,  4 / 10], [2 / 11,  6 / 11], [1 / 9, 3 / 9]],
    [[4 / 10,  9 / 10], [6 / 11,  8 / 11], [3 / 9, 7 / 9]],
    [[9 / 10, 10 / 10], [8 / 11, 11 / 11], [7 / 9, 9 / 9]]
  ].map(roundSeries));
});

it("stack(data) treats missing fields (undefined) as zero instead of NaN", () => {
  const s = stack().keys(["a", "b"]);
  const data = [{a: 1}, {a: 2, b: 3}, {b: 4}];
  assert.deepStrictEqual(s(data).map(s => s.map(p => [p[0], p[1]])), [
    [[0, 1], [0, 2], [0, 0]],
    [[1, 1], [2, 5], [0, 4]]
  ]);
  assert.deepStrictEqual(s(data).flatMap(s => s).some(p => isNaN(p[0]) || isNaN(p[1])), false);
});

it("stack(data) treats explicit null values as zero", () => {
  const s = stack().keys(["a", "b"]);
  const data = [{a: 1, b: null}, {a: null, b: 3}];
  assert.deepStrictEqual(s(data).map(s => s.map(p => [p[0], p[1]])), [
    [[0, 1], [0, 0]],
    [[1, 1], [0, 3]]
  ]);
});

it("stack(data) preserves explicit NaN values", () => {
  const s = stack().keys(["a", "b"]);
  const data = [{a: 1, b: NaN}, {a: NaN, b: 3}];
  const out = s(data);
  assert(isNaN(out[0][1][1]));
  assert(isNaN(out[1][0][1]));
  assert.deepStrictEqual(out.map(s => s.map(p => [p[0], isNaN(p[1]) ? "NaN" : p[1]])), [
    [[0, 1], [0, "NaN"]],
    [[1, "NaN"], [0, 3]]
  ]);
});

it("stack(data) with stackOffsetExpand normalizes mixed-sign and missing values", () => {
  const s = stack().keys(["a", "b"]).offset(stackOffsetExpand);
  // column 0: all negative (-2, -4); column 1: balanced (3, -3);
  // column 2: mixed signs (3, -1); column 3: missing field on b (2, missing)
  const data = [
    {a: -2, b: -4},
    {a:  3, b: -3},
    {a:  3, b: -1},
    {a:  2}
  ];
  assert.deepStrictEqual(s(data).map(s => s.map(p => [p[0], p[1]])), [
    [[-1 / 3, 0], [0, 1 / 2], [0, 3 / 4], [0, 1]],
    [[-1, -1 / 3], [-1 / 2, 0], [-1 / 4, 0], [1, 1]]
  ]);
  assert.deepStrictEqual(s(data).flatMap(s => s).some(p => isNaN(p[0]) || isNaN(p[1])), false);
});

function series(series, data, key, index) {
  data.forEach(function(d, i) { series[i].data = d; });
  series.key = key;
  series.index = index;
  return series;
}

function roundSeries(series) {
  return series.map(function(point) {
    return point.map(function(value) {
      return Math.round(value * 1e6) / 1e6;
    });
  });
}
