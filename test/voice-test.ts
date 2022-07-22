// =============================================================================
// Hilbert.js | Voice Tests
// (c) Mathigon
// =============================================================================


import tape from 'tape';
import {Expression} from '../src';


const voice = (src: string) => Expression.parse(src).toVoice();


tape('Basic Voice', (test) => {
  test.equal(voice('sqrt(5)'), 'square root of 5');
  test.equal(voice('root(27, 3)'), 'cubic root of 27');
  test.equal(voice('root(256, 4)'), '4th root of 256');
  test.equal(voice('a * b'), '_a_ times _b_');
  test.equal(voice('(a * b)'), '_a_ times _b_');
  test.equal(voice('a^b'), '_a_ to the power of _b_');
  test.equal(voice('a^2'), '_a_ squared');
  test.equal(voice('a^3'), '_a_ cubed');
  test.equal(voice('f(x)'), 'f of _x_');
  test.equal(voice('sin(x)'), 'sin _x_');
  test.equal(voice('a/b'), '_a_ over _b_');
  test.equal(voice('a//b'), '_a_ divided by _b_');
  test.equal(voice('(a + b)/cc'), '_a_ plus _b_ over cc');
  test.end();
});
