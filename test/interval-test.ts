// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import {Obj} from '@mathigon/core';
import {nearlyEquals} from '@mathigon/fermat';
import * as tape from 'tape';
import {Expression} from '../index';
import {Interval} from '../src/eval';


const expr = (src: string) => Expression.parse(src);
const value = (src: string, vars?: Obj<number|Interval>) => expr(src).interval(vars || {});


tape('Basic', (test) => {
  test.deepEquals(value('42'), [42, 42]);
  test.deepEquals(value('x', {x: 10}), [10, 10]);

  test.deepEquals(value('x', {x: [10, 11]}), [10, 11]);
  test.deepEquals(value('x+1', {x: [10, 11]}), [11, 12]);
  test.deepEquals(value('x-1', {x: [10, 11]}), [9, 10]);
  test.end();
});

tape('Arithmetic', (test) => {
  test.deepEquals(value('a + b + c', {a: [2, 3], b: [4, 5], c: [6, 7]}), [12, 15]);
  test.deepEquals(value('a - b', {a: [6, 7], b: [2, 3]}), [3, 5]);
  test.deepEquals(value('a * b * c', {a: [2, 3], b: [4, 5], c: [-2, -1]}), [-30, -8]);
  test.end();
});

tape('Powers', (test) => {
  const r1 = value('a ^ b', {a: [2, 3], b: [1, 2]});
  test.true(nearlyEquals(r1[0], 2));
  test.true(nearlyEquals(r1[1], 9));

  const r2 = value('sqrt(4)');
  test.true(nearlyEquals(r2[0], 2));
  test.true(nearlyEquals(r2[1], 2));

  test.end();
});
