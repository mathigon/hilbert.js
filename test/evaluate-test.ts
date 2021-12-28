// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import tape from 'tape';
import {Expression} from '../src';
import {VarMap} from '../src/elements';


const expr = (src: string) => Expression.parse(src);
const value = (src: string, vars?: VarMap) => expr(src)
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

tape('Nested Expressions', (test) => {
  test.equal(value('a', {a: expr('1+2')}), 3);
  test.equal(value('a', {a: expr('b'), b: expr('3+4')}), 7);
  test.throws(() => value('a', {a: expr('b+1'), b: expr('2a')}));
  test.equal(value('2a', {a: 'sin(pi/2)'}), 2);
  test.end();
});

tape('Implicit Multiplication', (test) => {
  test.equal(value('x(x+1)', {x: 3}), 12);
  test.equal(value('x(2)', {x: (a: number) => a * 2}), 4);
  test.throws(() => value('"a"(2)'));
  test.throws(() => value('x(1, 2)', {x: 3}));
  test.end();
});
