// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import tape from 'tape';
import {Expression} from '../src';


const expr = (src: string) => Expression.parse(src);

tape('Simple Substitutions', (test) => {
  test.equal(expr('a+b').substitute({a: expr('10')}).toString(), '10 + b');
  test.equal(expr('b^2-a').substitute({b: expr('a+1')}).toString(), '(a + 1)^2 − a');
  test.end();
});

tape('Recursive Substitutions', (test) => {
  test.equal(expr('a^2+b').recursiveSubstitute({a: expr('b+2'), b: expr('c')}).toString(), '(c + 2)^2 + c');
  test.end();
});
