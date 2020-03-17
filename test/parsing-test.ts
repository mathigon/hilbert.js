// =============================================================================
// Hilbert.js | Parsing Tests
// (c) Mathigon
// =============================================================================


import * as tape from 'tape';
import {Expression} from '../index';


const expr = (src: string) => Expression.parse(src);
const str = (src: string) => expr(src).toString();


tape('basics', (test) => {
  test.equal(str('1'), '1');
  test.equal(str('-1'), '− 1');
  test.equal(str('x + y'), 'x + y');
  test.equal(str('aa + bb + cc'), 'aa + bb + cc');
  test.equal(str('5x + 2'), '5 x + 2');
  test.equal(str('|a|'), 'abs(a)');
  test.end();
});

tape('special operators', (test) => {
  test.equal(str('x - y'), 'x − y');
  test.equal(str('x – y'), 'x − y');
  test.equal(str('x − y'), 'x − y');
  test.end();
});

tape('functions', (test) => {
  test.equal(str('A_B'), 'A_B');
  test.equal(str('fn(A, B)'), 'fn(A, B)');
  test.end();
});

tape('strings', (test) => {
  test.equal(str('"A" + "B"'), '"A" + "B"');
  test.equal(str('"A"_"B"'), '"A"_"B"');
  test.equal(str('fn(A_"B",C)'), 'fn(A_"B", C)');
  test.end();
});

tape('super and subscripts', (test) => {
  test.equal(str('x^(2_n)'), 'x^(2_n)');
  test.equal(str('(x^2)_n'), '(x^2)_n');
  test.equal(str('x_1^2 + 2^3_(n^2)'), 'x_1^2 + 2_(n^2)^3');
  test.equal(str('x_(n+1) = x_n / 2'), 'x_(n + 1) = x_n / 2');
  test.equal(str('x_n^2'), 'x_n^2');
  test.equal(str('x^2_n'), 'x_n^2');
  test.end();
});

tape('symbols', (test) => {
  test.equal(str('oo'), '∞');
  test.equal(str('AA A'), '∀ A');
  test.equal(str('EE E'), '∃ E');
  test.equal(str('x in y'), 'x ∈ y');
  test.equal(str('a != b'), 'a ≠ b');
  test.end();
});

tape('errors', (test) => {
  test.throws(() => expr('a + + b').collapse());
  test.throws(() => expr('a * - b').collapse());
  test.throws(() => expr('a + (a +)').collapse());
  test.throws(() => expr('a + (*)').collapse());
  test.throws(() => expr('(+) - a').collapse());
  test.end();
});
