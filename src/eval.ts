// =============================================================================
// Hilbert.js – Function Evaluation
// (c) Mathigon
// =============================================================================


import {total} from '@mathigon/core';
import {gcd, isBetween, lcm} from '@mathigon/fermat';
import {SpecialFunction} from './symbols';

const OPERATORS = ['add', 'sub', 'mul', 'div', 'sup'] as const;
type Functions = typeof OPERATORS[number] | SpecialFunction;


// -----------------------------------------------------------------------------
// Interval Utilities

export type Interval = [number, number];
const WHOLE = [-Infinity, Infinity] as Interval;
const EMPTY = [NaN, NaN] as Interval;

const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

const int = (a: number, b: number) => [a - Number.EPSILON, b + Number.EPSILON] as Interval;
const range = (...args: number[]) => int(Math.min(...args), Math.max(...args)) as Interval;
export const width = (a: Interval) => Math.abs(a[1] - a[0]);

export const isWhole = (a: Interval) => a[0] === -Infinity && a[1] === Infinity;
const isEmpty = (a: Interval) => isNaN(a[0]) || isNaN(a[1]);
const isInfinite = (a: Interval) => !isFinite(a[0]) && a[0] === a[1];

const contains = (a: Interval, v: number) => isBetween(v, a[0] - Number.EPSILON, a[1] + Number.EPSILON);
export const hasZero = (a: Interval) => contains(a, 0);


// -----------------------------------------------------------------------------
// Standard Evaluation

export const evaluate: Record<Functions, (...args: number[]) => number> = {
  add: (...args) => args.reduce((a, b) => a + b, 0),
  sub: (...args) => (args.length > 1) ? args[0] - args[1] : -args[0],
  mul: (...args) => args.reduce((a, b) => a * b, 1),
  div: (a, b) => a / b,

  abs: (a) => Math.abs(a),
  round: (a) => Math.round(a),
  floor: (a) => Math.floor(a),
  ceil: (a) => Math.ceil(a),
  max: (...args) => Math.max(...args),
  min: (...args) => Math.min(...args),

  mod: (a, b) => a % b,
  lcm: (...args) => lcm(...args),
  gcd: (...args) => gcd(...args),
  gcf: (...args) => gcd(...args),

  sup: (a, b) => Math.pow(a, b),
  log: (a, b) => Math.log(a) / (b === undefined ? 1 : Math.log(b)),
  exp: (a) => Math.exp(a),
  ln: (a) => Math.log(a),

  sqrt: (a) => Math.sqrt(a),
  root: (a, b) => Math.pow(a, 1 / b),

  sin: (a) => Math.sin(a),
  cos: (a) => Math.cos(a),
  tan: (a) => Math.tan(a),
  sec: (a) => 1 / Math.cos(a),
  csc: (a) => 1 / Math.sin(a),
  cot: (a) => 1 / Math.tan(a),
  cosec: (a) => evaluate.csc(a),
  cotan: (a) => evaluate.cot(a),

  arcsin: (a) => Math.asin(a),
  arccos: (a) => Math.acos(a),
  arctan: (a) => Math.atan(a),

  sinh: (a) => Math.sinh(a),
  cosh: (a) => Math.cosh(a),
  tanh: (a) => Math.tanh(a),
  sech: (a) => 1 / Math.cosh(a),
  csch: (a) => 1 / Math.sinh(a),
  coth: (a) => 1 / Math.tanh(a),
  cosech: (a) => evaluate.csch(a)
};


// -----------------------------------------------------------------------------
// Utility Functions

/** Evaluate a^b */
function pow(a: Interval, b: Interval): Interval {
  // If the base a is positive:
  if (a[0] > 0) {
    if (b[0] >= 0) return int(a[0] ** b[0], a[1] ** b[1]);
    return range(a[0] ** b[0], a[0] ** b[1], a[1] ** b[0], a[1] ** b[1]);
  }

  // If the exponent b is an integer:
  const k = b[0];
  if (Number.isInteger(k) && k === b[1]) {
    if (k === 0) return [hasZero(a) ? 0 : 1, 1];
    if (k % 2) return int(a[0] ** k, a[1] ** k);
    if (hasZero(a)) return [0, Math.max(a[0] ** k, a[1] ** k)];
    return range(a[1] ** k, a[0] ** k);
  }

  return EMPTY;  // TODO Implement this!
}

/** Shift an interval so that a[0] lies between 0 and 2 Pi. */
function intervalMod(a: Interval, m = TWO_PI): Interval {
  const d = Math.floor(a[0] / m) * m;
  return [a[0] - d, a[1] - d];
}


// -----------------------------------------------------------------------------
// Interval Evaluation

export const interval: Record<Functions, (...args: Interval[]) => Interval> = {
  add: (...args) => int(total(args.map(a => a[0])), total(args.map(a => a[1]))),
  sub: (a, b) => b !== undefined ? int(a[0] - b[1], a[1] - b[0]) : int(-a[1], -a[0]),
  mul: (a, ...b) => {
    if (b.length > 1) b = [interval.mul(...b)];
    return range(a[0] * b[0][0], a[0] * b[0][1], a[1] * b[0][0], a[1] * b[0][1]);
  },
  div: (a, b) => hasZero(b)? WHOLE : range(a[0] / b[0], a[0] / b[1], a[1] / b[0], a[1] / b[1]),

  abs: (a) => {
    if (hasZero(a)) return int(0, Math.max(-a[0], a[1]));
    return range(Math.abs(a[0]), Math.abs(a[1]));
  },
  round: (a) => int(Math.round(a[0]), Math.round(a[1])),
  floor: (a) => int(Math.floor(a[0]), Math.floor(a[1])),
  ceil: (a) => int(Math.ceil(a[0]), Math.ceil(a[1])),
  max: (...args) => int(Math.max(...args.map(a => a[0])), Math.max(...args.map(a => a[1]))),
  min: (...args) => int(Math.min(...args.map(a => a[0])), Math.min(...args.map(a => a[1]))),

  mod: (a, b) => {
    if (isEmpty(a) || isEmpty(b)) return EMPTY;
    let n = a[0] / (a[0] < 0 ? b[0] : b[1]);
    n = (n < 0) ? Math.ceil(n) : Math.floor(n);
    return interval.sub(a, interval.mul(b, [n, n]));  // a mod b = a - n * b
  },
  lcm: (...args) => range(lcm(...args.map(a => a[0]))),  // TODO Review this!
  gcd: (...args) => range(gcd(...args.map(a => a[0]))),  // TODO Review this!
  gcf: (...args) => interval.gcd(...args),

  sup: (a, b) => pow(a, b),
  log: (a, b) => {
    if (b !== undefined) interval.div(interval.log(a), interval.log(b));
    return int(a[0] <= 0 ? -Infinity : Math.log(a[0]), Math.log(a[1]));
  },
  exp: (a) => pow([Math.E, Math.E], a),
  ln: (a) => interval.log(a),

  sqrt: (a) => pow(a, [0.5, 0.5]),
  root: (a, b) => pow(a, interval.div([1, 1], b)),

  sin: (a) => interval.cos(interval.sub(a, [HALF_PI, HALF_PI])),
  cos: (a) => {
    if (isEmpty(a) || isInfinite(a)) return EMPTY;
    if (width(a) >= TWO_PI - Number.EPSILON) return [-1, 1];
    a = intervalMod(a);
    if (a[0] > Math.PI + Number.EPSILON) return interval.sub(interval.cos(interval.sub(a, [Math.PI, Math.PI])));

    // Now we know that 0 < a[0] < pi.
    if (a[1] < Math.PI - Number.EPSILON) return int(Math.cos(a[1]), Math.cos(a[0]));
    if (a[1] < TWO_PI - Number.EPSILON) return int(-1, Math.max(Math.cos(a[1]), Math.cos(a[0])));
    return int(-1, 1);
  },
  tan: (a) => {
    if (isEmpty(a) || isInfinite(a)) return EMPTY;
    a = intervalMod(a, Math.PI);
    if (a[0] > HALF_PI + Number.EPSILON) a = interval.sub(a, [Math.PI, Math.PI]);
    if (a[0] < -HALF_PI + Number.EPSILON || a[1] > HALF_PI - Number.EPSILON) return WHOLE;
    return int(Math.tan(a[0]), Math.tan(a[1]));
  },
  sec: (a) => interval.div([1, 1], interval.cos(a)),
  csc: (a) => interval.div([1, 1], interval.sin(a)),
  cot: (a) => interval.div([1, 1], interval.tan(a)),
  cosec: (a) => interval.csc(a),
  cotan: (a) => interval.cot(a),

  arcsin: (a) => {
    if (isEmpty(a) || a[1] < -1 || a[0] > 1) return EMPTY;
    return int(a[0] <= -1 ? -HALF_PI : Math.asin(a[0]), a[1] >= 1 ? HALF_PI : Math.asin(a[1]));
  },
  arccos: (a) => {
    if (isEmpty(a) || a[1] < -1 || a[0] > 1) return EMPTY;
    return int(a[1] >= 1 ? 0 : Math.acos(a[1]), a[0] <= -1 ? Math.PI : Math.acos(a[0]));
  },
  arctan: (a) => int(Math.atan(a[0]), Math.atan(a[1])),

  sinh: (a) => int(Math.sinh(a[0]), Math.sinh(a[1])),
  cosh: (a) => {
    if (a[1] < 0) return int(Math.cosh(a[1]), Math.cosh(a[0]));
    if (a[0] > 0) return int(Math.cosh(a[0]), Math.cosh(a[1]));
    return int(1, Math.cosh(Math.max(-a[0], a[1])));
  },
  tanh: (a) => int(Math.tanh(a[0]), Math.tanh(a[1])),
  sech: (a) => interval.div([1, 1], interval.cosh(a)),
  csch: (a) => interval.div([1, 1], interval.sinh(a)),
  coth: (a) => interval.div([1, 1], interval.tanh(a)),
  cosech: (a) => interval.csch(a)
};
