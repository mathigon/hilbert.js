// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================



import { unique, cache } from '@mathigon/core';
import { nearlyEquals } from '@mathigon/fermat';
import { CONSTANTS } from './symbols'
import { tokenize, matchBrackets } from './parser'



/**
 * Parses a string to an expression.
 * @param {string} str
 * @param {boolean} collapse
 * @returns {Expression}
 */
function parse(str, collapse = false) {
  const expr =  matchBrackets(tokenize(str));
  return collapse ? expr.collapse() : expr;
}

/**
 * Checks numerically if two expressions are equal. Obviously this is not a
 * very robust solution, but much easier than the full CAS simplification.
 * @param {Expression} expr1
 * @param {Expression} expr2
 * @returns {boolean}
 */
function numEquals(expr1, expr2) {
  const vars = unique([...expr1.variables, ...expr2.variables]);
  const fn1 = expr1.collapse();
  const fn2 = expr2.collapse();

  // We only test positive random numbers, because negative numbers raised
  // to non-integer powers return NaN.
  for (let i = 0; i < 5; ++i) {
    const substitution = {};
    for (let v of vars) substitution[v] = CONSTANTS[v] || Math.random() * 5;
    const a = fn1.evaluate(substitution);
    const b = fn2.evaluate(substitution);
    if (!nearlyEquals(a, b)) return false;
  }
  return true;
}

export const Expression = {
  numEquals,
  parse: cache(parse)
};
