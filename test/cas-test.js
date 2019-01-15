// =============================================================================
// Hilbert.js | CAS Tests
// (c) Mathigon
// =============================================================================



const tape = require('tape');
const hilbert = require('../');

const expr = (src) => hilbert.Expression.parse(src);
const equals = (a, b) => hilbert.Expression.numEquals(expr(a), expr(b));


tape('NumEquals', function(test) {
  test.ok(equals('42', '42'));
  test.ok(equals('x', 'x'));
  test.ok(equals('x^2', 'x*x*x/x'));
  test.ok(equals('6 * 10', '4 * 15'));
  test.end();
});
