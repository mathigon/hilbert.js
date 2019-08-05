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

tape('functions', function(test) {
  test.equal(str('A_B'), 'A_B');
  test.equal(str('fn(A, B)'), 'fn(A, B)');
  test.end();
});

tape('strings', function(test) {
  test.equal(str('"A" + "B"'), '"A" + "B"');
  test.equal(str('"A"_"B"'), '"A"_"B"');
  test.equal(str('fn(A_"B",C)'), 'fn(A_"B", C)');
  test.end();
});

tape('super and subscripts', function(test) {
  test.equal(str('x^2_n'), '(x^2)_n');
  test.equal(str('x^(2_n)'), 'x^2_n');
  test.equal(str('x_n^2'), 'x_(n^2)');
  test.equal(str('x_1^2 + 2^3_(n^2)'), 'x_(1^2) + (2^3)_(n^2)');
  test.equal(str('x_(n+1) = x_n / 2'), 'x_(n + 1) = x_n / 2');
  test.end();
});

tape('symbols', function(test) {
  test.equal(str('oo'), '∞');
  test.equal(str('AA A'), '∀ A');
  test.equal(str('EE E'), '∃ E');
  test.equal(str('x in y'), 'x ∈ y');
  test.equal(str('a != b'), 'a ≠ b');
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
