// =============================================================================
// Hilbert.js | CAS Tests
// (c) Mathigon
// =============================================================================


import * as tape from 'tape';
import {Expression} from '../index';


const expr = (src: string) => Expression.parse(src);
const equals = (a: string, b: string) => Expression.numEquals(expr(a), expr(b));


tape('NumEquals', (test) => {
  test.ok(equals('42', '42'));
  test.ok(equals('x', 'x'));
  test.ok(equals('x^2', 'x*x*x/x'));
  test.ok(equals('6 * 10', '4 * 15'));
  test.end();
});
