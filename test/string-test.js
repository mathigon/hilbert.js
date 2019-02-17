// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================



const tape = require('tape');
const hilbert = require('../');

const str = (src) => hilbert.Expression.parse(src).collapse().toString();


tape('Precedence', function(test) {
  test.equal(str('(a × b) + c'), 'a × b + c');
  test.equal(str('a × (b + c)'), 'a × (b + c)');
  test.equal(str('((a^b))'), 'a^b');
  test.equal(str('(a)^(b × c)'), 'a^(b × c)');
  test.end();
});
