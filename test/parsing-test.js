// =============================================================================
// Hilbert.js | Parsing Tests
// (c) Mathigon
// =============================================================================



const tape = require('tape');
const hilbert = require('../');

const expr = (src) => hilbert.Expression.parse(src);
const str = (src) => expr(src).toString();


tape('basics', function(test) {
  test.equal(str('1'), '1');
  test.equal(str('-1'), '- 1');
  test.equal(expr('x + y').toString(), 'x + y');
  test.equal(expr('aa + bb + cc').toString(), 'aa + bb + cc');
  test.equal(expr('5x + 2').toString(), '5 x + 2');
  test.equal(expr('|a|').toString(), 'abs(a)');
  test.end();
});
