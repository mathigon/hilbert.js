// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================


import {unique, cache, Obj} from '@mathigon/core';
import {nearlyEquals} from '@mathigon/fermat';
import {ExprElement} from './elements';
import {CONSTANTS} from './symbols';
import {tokenize, matchBrackets} from './parser';


/** Parses a string to an expression. */
function parse(str: string, collapse = false) {
  const expr = matchBrackets(tokenize(str));
  return collapse ? expr.collapse() : expr;
}

/**
 * Checks numerically if two expressions are equal. Obviously this is not a
 * very robust solution, but much easier than the full CAS simplification.
 */
function numEquals(expr1: ExprElement, expr2: ExprElement) {
  try {
    const vars = unique([...expr1.variables, ...expr2.variables]);
    const fn1 = expr1.collapse();
    const fn2 = expr2.collapse();

    // We only test positive random numbers, because negative numbers raised
    // to non-integer powers return NaN.
    let matches = 0;
    for (let i = 0; i < 5; ++i) {
      const substitution: Obj<number> = {};
      for (const v of vars) substitution[v] = CONSTANTS[v] || Math.random() * 5;
      const a = fn1.evaluate(substitution);
      const b = fn2.evaluate(substitution);
      if (isNaN(a) || isNaN(b)) continue;  // This might happen in square roots.
      if (!nearlyEquals(a, b)) return false;
      matches += 1;
    }

    // Return false if all items were NaN.
    return !!matches;
  } catch (e) {
    return false;
  }
}

export const Expression = {
  numEquals,
  parse: cache(parse),
};
