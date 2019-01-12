// =============================================================================
// Fermat.js | Expressions Tests
// (c) Mathigon
// =============================================================================



const tape = require('tape');
const hilbert = require('../');

const expr = (src) => hilbert.Expression.parse(src);
const mathML = (src) => expr(src).toMathML();


tape('basic', function(test) {
  test.equal(mathML('42'), '<mn>42</mn>');
  test.equal(mathML('3.141592654'), '<mn>3.141592654</mn>');
  test.equal(mathML('x'), '<mi>x</mi>');
  test.equal(mathML('xy'), '<mi>xy</mi>');
  test.equal(mathML('x y'), '<mi>x</mi><mi>y</mi>');
  test.equal(mathML('+'), '<mo value="+">+</mo>');
  test.equal(mathML('-'), '<mo value="-">-</mo>');
  test.equal(mathML('1+1 = 2'), '<mn>1</mn><mo value="+">+</mo><mn>1</mn><mo value="=">=</mo><mn>2</mn>');
  test.equal(mathML('3 - 2=1'), '<mn>3</mn><mo value="-">-</mo><mn>2</mn><mo value="=">=</mo><mn>1</mn>');
  test.end();
});
