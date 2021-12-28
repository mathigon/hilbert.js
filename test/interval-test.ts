// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import {nearlyEquals} from '@mathigon/fermat';
import tape from 'tape';
import {Expression} from '../src';
import {VarMap} from '../src/elements';


const expr = (src: string) => Expression.parse(src);
const value = (src: string, vars?: VarMap) => expr(src).interval(vars || {});


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

tape('Implicit Multiplication', (test) => {
  test.deepEquals(value('x(x+1)', {x: 3}), [12, 12]);
  test.deepEquals(value('x(2)', {x: (a: number) => a * 2}), [4, 4]);
  test.throws(() => value('"a"(2)'));
  test.throws(() => value('x(1, 2)', {x: 3}));
  test.end();
});
