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
  test.equal(str('-1'), '− 1');
  test.equal(str('x + y'), 'x + y');
  test.equal(str('aa + bb + cc'), 'aa + bb + cc');
  test.equal(str('5x + 2'), '5 x + 2');
  test.equal(str('|a|'), 'abs(a)');
  test.end();
});

tape('special operators', function(test) {
  test.equal(str('x - y'), 'x − y');
  test.equal(str('x – y'), 'x − y');
  test.equal(str('x − y'), 'x − y');
  test.end();
});

tape('errors', function(test) {
  test.throws(() => expr('a + + b').collapse());
  test.throws(() => expr('a * - b').collapse());
  test.throws(() => expr('a + (a +)').collapse());
  test.throws(() => expr('a + (*)').collapse());
  test.throws(() => expr('(+) - a').collapse());
  test.end();
});
