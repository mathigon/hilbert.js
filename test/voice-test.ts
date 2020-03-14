// =============================================================================
// Hilbert.js | Voice Tests
// (c) Mathigon
// =============================================================================


import * as tape from 'tape';
import {Expression} from '../index';


const voice = (src: string) => Expression.parse(src).toVoice();


tape('Basic Voice', (test) => {
  test.equal(voice('sqrt(5)'), 'square root of 5');
  test.equal(voice('a * b'), 'a times b');
  test.equal(voice('(a * b)'), 'open bracket a times b close bracket');
  test.equal(voice('a^b'), 'a to the power of b');
  test.equal(voice('f(x)'), 'f of x');
  test.equal(voice('a/b'), 'a over b');
  test.equal(voice('a//b'), 'a divided by b');
  test.equal(voice('(a + b)/c'), 'a plus b over c');
  test.end();
});
