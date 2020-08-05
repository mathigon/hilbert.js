// =============================================================================
// Hilbert.js | MathML Tests
// (c) Mathigon
// =============================================================================


import * as tape from 'tape';
import {Expression} from '../index';
import {MathMLArgument, ExprString} from '../src/elements';


const expr = (src: string) => Expression.parse(src);
const mathML = (src: string, replace = {}) => expr(src).toMathML(replace);


tape('Basic', (test) => {
  test.equal(mathML('42'), '<mn>42</mn>');
  test.equal(mathML('3.141592654'), '<mn>3.141592654</mn>');
  test.equal(mathML('x'), '<mi>x</mi>');
  test.equal(mathML('xy'), '<mi>xy</mi>');
  test.equal(mathML('log'), '<mi mathvariant="normal">log</mi>');
  test.equal(mathML('x y'), '<mi>x</mi><mi>y</mi>');
  test.equal(mathML('+'), '<mo value="+">+</mo>');
  test.equal(mathML('-'), '<mo value="−">−</mo>');
  test.equal(mathML('1+1 = 2'),
      '<mn>1</mn><mo value="+">+</mo><mn>1</mn><mo value="=">=</mo><mn>2</mn>');
  test.equal(mathML('3 - 2=1'),
      '<mn>3</mn><mo value="−">−</mo><mn>2</mn><mo value="=">=</mo><mn>1</mn>');
  test.end();
});

tape('HTML Characters', (test) => {
  test.equal(mathML('a < b'), '<mi>a</mi><mo value="&lt;">&lt;</mo><mi>b</mi>');
  test.equal(mathML('a > b'), '<mi>a</mi><mo value="&gt;">&gt;</mo><mi>b</mi>');
  test.equal(mathML('a ≥ b'), '<mi>a</mi><mo value="≥">≥</mo><mi>b</mi>');
  test.end();
});

tape('SupSub', (test) => {
  test.equal(mathML('a^2+1'), '<msup><mi>a</mi><mn>2</mn></msup><mo value="+">+</mo><mn>1</mn>');
  test.equal(mathML('a^(2+1)'), '<msup><mi>a</mi><mrow><mn>2</mn><mo value="+">+</mo><mn>1</mn></mrow></msup>');

  test.equal(mathML('a_2+1'), '<msub><mi>a</mi><mn>2</mn></msub><mo value="+">+</mo><mn>1</mn>');
  test.equal(mathML('a_(2+1)'), '<msub><mi>a</mi><mrow><mn>2</mn><mo value="+">+</mo><mn>1</mn></mrow></msub>');

  test.equal(mathML('a^2_1'), '<msubsup><mi>a</mi><mn>1</mn><mn>2</mn></msubsup>');
  test.equal(mathML('a_1^2'), '<msubsup><mi>a</mi><mn>1</mn><mn>2</mn></msubsup>');

  test.equal(mathML('(a_1)^2'), '<msup><mrow><mfenced><msub><mi>a</mi><mn>1</mn></msub></mfenced></mrow><mn>2</mn></msup>');
  test.equal(mathML('(a^2)_1'), '<msub><mrow><mfenced><msup><mi>a</mi><mn>2</mn></msup></mfenced></mrow><mn>1</mn></msub>');

  test.end();
});

tape('Custom Functions', (test) => {
  const options = {
    a: (a: MathMLArgument) => `<a>${a}</a>`,
    b: (...b: MathMLArgument[]) => `<b>${b.join(',')}</b>`,
    c: (c: MathMLArgument) => `<c attr="${(c.val as ExprString).s}">${c}</c>`,
  };

  test.equal(mathML('a(1)', options), '<a><mn>1</mn></a>');
  test.equal(mathML('b(1,2)', options), '<b><mn>1</mn>,<mn>2</mn></b>');
  test.equal(mathML('c("text")', options),
      '<c attr="text"><mtext>text</mtext></c>');
  test.end();
});

tape('Whitespace', (test) => {
  test.equal(mathML('a  b'), '<mi>a</mi><mspace></mspace><mi>b</mi>');
  test.equal(mathML('a b'), '<mi>a</mi><mi>b</mi>');
  test.end();
});

tape('Functions', function(test) {
  test.equal(mathML('sin(a + b)'),
      '<mi mathvariant="normal">sin</mi><mfenced><mi>a</mi><mo value="+">+</mo><mi>b</mi></mfenced>');
  test.equal(mathML('tan = sin/cos'),
      '<mi mathvariant="normal">tan</mi><mo value="=">=</mo><mfrac><mi mathvariant="normal">sin</mi><mi mathvariant="normal">cos</mi></mfrac>');
  test.equal(mathML('sinh(x) = (e^x - e^(-x))/2'),
      '<mi mathvariant="normal">sinh</mi><mfenced><mi>x</mi></mfenced><mo value="=">=</mo><mfrac><mrow><msup><mi>e</mi><mi>x</mi></msup><mo value="−">−</mo><msup><mi>e</mi><mrow><mo value="−">−</mo><mi>x</mi></mrow></msup></mrow><mn>2</mn></mfrac>');
  test.equal(mathML('ln(x^2) = 2 ln(x)'),
      '<mi mathvariant="normal">ln</mi><mfenced><msup><mi>x</mi><mn>2</mn></msup></mfenced><mo value="=">=</mo><mn>2</mn><mi mathvariant="normal">ln</mi><mfenced><mi>x</mi></mfenced>');
  test.equal(mathML('ln(x/y) = ln(x) - ln(y)'),
      '<mi mathvariant="normal">ln</mi><mfenced><mfrac><mi>x</mi><mi>y</mi></mfrac></mfenced><mo value="=">=</mo><mi mathvariant="normal">ln</mi><mfenced><mi>x</mi></mfenced><mo value="−">−</mo><mi mathvariant="normal">ln</mi><mfenced><mi>y</mi></mfenced>');
  test.equal(mathML('a^(p-1) == 1'),
      '<msup><mi>a</mi><mrow><mi>p</mi><mo value="−">−</mo><mn>1</mn></mrow></msup><mo value="≡">≡</mo><mn>1</mn>');
  // test.equal(mathML('log_b(x) = log_k(x)/log_k(b)'), 'xxx');  // TODO Support functions with subscripts
  test.end();
});

tape('Fractions', (test) => {
  test.equal(mathML('a/b'), '<mfrac><mi>a</mi><mi>b</mi></mfrac>');
  test.equal(mathML('a//b'), '<mi>a</mi><mo value="/">/</mo><mi>b</mi>');
  test.equal(mathML('(a+b)/(c+d)'),
      '<mfrac><mrow><mi>a</mi><mo value="+">+</mo><mi>b</mi></mrow><mrow><mi>c</mi><mo value="+">+</mo><mi>d</mi></mrow></mfrac>');
  test.equal(mathML('phi = 1 + 1/(1 + 1/(1 + 1/(1 + 1/(1 + …))))'),
      '<mi>φ</mi><mo value="=">=</mo><mn>1</mn><mo value="+">+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo value="+">+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo value="+">+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo value="+">+</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo value="+">+</mo><mo value="…">…</mo></mrow></mfrac></mrow></mfrac></mrow></mfrac></mrow></mfrac>');
  test.end();
});

tape('Super and Subscripts', (test) => {
  test.equal(mathML('a_i'), '<msub><mi>a</mi><mi>i</mi></msub>');
  test.equal(mathML('a^2'), '<msup><mi>a</mi><mn>2</mn></msup>');
  test.equal(mathML('a^2 + b^2 = c^2'),
      '<msup><mi>a</mi><mn>2</mn></msup><mo value="+">+</mo><msup><mi>b</mi><mn>2</mn></msup><mo value="=">=</mo><msup><mi>c</mi><mn>2</mn></msup>');
  // test.equal(mathML('2^2^2^2'), '<msup><mrow><msup><mrow><msup><mn>2</mn><mn>2</mn></msup></mrow><mn>2</mn></msup></mrow><mn>2</mn></msup>');  // TODO Right-to-left
  // test.equal(mathML('a_i^2'), '<msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup>');  // TODO Support Super and Subscripts
  // test.equal(mathML('a^2_i'), '<msubsup><mi>a</mi><mi>i</mi><mn>2</mn></msubsup>');  // TODO Support Super and Subscripts
  test.end();
});

tape('Roots', (test) => {
  test.equal(mathML('sqrt(x)'), '<msqrt><mi>x</mi></msqrt>');
  test.equal(mathML('root(x, 3)'), '<mroot><mi>x</mi><mn>3</mn></mroot>');
  test.equal(mathML('sqrt(2) ~~ 1.414213562'),
      '<msqrt><mn>2</mn></msqrt><mo value="≈">≈</mo><mn>1.414213562</mn>');
  test.equal(mathML('x = (-b +- sqrt(b^2 - 4a c)) / (2a)'),
      '<mi>x</mi><mo value="=">=</mo><mfrac><mrow><mo value="−">−</mo><mi>b</mi><mo value="±">±</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo value="−">−</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac>');
  test.equal(mathML('phi = (1 + sqrt(5))/2'),
      '<mi>φ</mi><mo value="=">=</mo><mfrac><mrow><mn>1</mn><mo value="+">+</mo><msqrt><mn>5</mn></msqrt></mrow><mn>2</mn></mfrac>');
  test.equal(mathML(
      'sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + sqrt(1 + …)))))))'),
  '<msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><msqrt><mn>1</mn><mo value="+">+</mo><mo value="…">…</mo></msqrt></msqrt></msqrt></msqrt></msqrt></msqrt></msqrt>');
  test.end();
});

tape('Groupings', (test) => {
  test.equal(mathML('(a+b)'),
      '<mfenced open="(" close=")"><mi>a</mi><mo value="+">+</mo><mi>b</mi></mfenced>');
  test.equal(mathML('|a+b|'),
      '<mfenced open="|" close="|"><mi>a</mi><mo value="+">+</mo><mi>b</mi></mfenced>');
  test.equal(mathML('a,b,c'),
      '<mi>a</mi><mo value=",">,</mo><mi>b</mi><mo value=",">,</mo><mi>c</mi>');
  test.equal(mathML('(a,b,c)'),
      '<mfenced open="(" close=")"><mi>a</mi><mo value="," lspace="0">,</mo><mi>b</mi><mo value="," lspace="0">,</mo><mi>c</mi></mfenced>');
  test.equal(mathML('(x+y)(x-y) = x^2-y^2'),
      '<mfenced open="(" close=")"><mi>x</mi><mo value="+">+</mo><mi>y</mi></mfenced><mfenced open="(" close=")"><mi>x</mi><mo value="−">−</mo><mi>y</mi></mfenced><mo value="=">=</mo><msup><mi>x</mi><mn>2</mn></msup><mo value="−">−</mo><msup><mi>y</mi><mn>2</mn></msup>');
  test.equal(mathML('e^(-x)'),
      '<msup><mi>e</mi><mrow><mo value="−">−</mo><mi>x</mi></mrow></msup>');
  test.equal(mathML('e^(i tau) = 1'),
      '<msup><mi>e</mi><mrow><mi>i</mi><mi>τ</mi></mrow></msup><mo value="=">=</mo><mn>1</mn>');
  test.end();
});
