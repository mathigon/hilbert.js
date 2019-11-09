// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import {Obj} from '@mathigon/core';
import * as tape from 'tape';
import {Expression} from '../index';


const expr = (src: string) => Expression.parse(src);
const value = (src: string, vars?: Obj<number>) => expr(src)
    .evaluate(vars || {});


tape('Basic', (test) => {
  test.equal(value('42'), 42);
  test.equal(value('x', {x: 10}), 10);
  test.end();
});

tape('Functions', (test) => {
  test.equal(value('2 + 3'), 5);
  test.equal(value('7 - 3'), 4);
  test.equal(value('2 * 3'), 6);
  test.equal(value('2 ^ 3'), 8);
  test.equal(value('4 / 2'), 2);
  test.equal(value('sqrt(81)'), 9);
  test.equal(Math.round(value('sin(pi)')), 0);
  test.end();
});

tape('Order and Brackets', (test) => {
  test.equal(value('2 a b', {a: 3, b: 5}), 30);
  test.equal(value('2 +  3  + 5'), 10);
  test.equal(value('2 + 3 * 5'), 17);
  test.equal(value('2 * 3 - 5'), 1);
  test.equal(value('2 * (5 - 3)'), 4);
  test.equal(value('2 * (6 - 8 / 2)'), 4);
  test.equal(value('2 * (5 - 8 / 2)'), 2);
  test.equal(value('+ 2 + 3'), 5);
  test.equal(value('- 2 * 3'), -6);
  test.end();
});

tape('Invalid', (test) => {
  test.throws(() => value('* 3'));
  test.throws(() => value('3 /'));
  test.throws(() => value('2 + (3 *)'));
  test.throws(() => value('2 + * 3'));
  test.throws(() => value('2 3'));
  test.throws(() => value('4 sin(0) 2'));
  test.end();
});
