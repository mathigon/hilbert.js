// =============================================================================
// Hilbert.js | Evaluation Tests
// (c) Mathigon
// =============================================================================


import tape from 'tape';
import {Expression} from '../src';


const str = (src: string) => Expression.parse(src).collapse().toString();


tape('Precedence', (test) => {
  test.equal(str('(a × b) + c'), 'a × b + c');
  test.equal(str('a × (b + c)'), 'a × (b + c)');
  test.equal(str('((a^b))'), 'a^b');
  test.equal(str('(a)^(b × c)'), 'a^(b × c)');
  test.end();
});
