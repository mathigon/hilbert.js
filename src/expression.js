// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================



import { unique } from '@mathigon/core';
import { nearlyEquals } from '@mathigon/fermat';
import { tokenize, matchBrackets, collapseTerm } from './parser'
import { ExprError } from './errors'


const CONSTANTS = {
  π: Math.PI,
  e: Math.E
};

/**
 * Maths Expression
 */
export class Expression {

  /**
   * Parses a string to an expression.
   * @param {string} str
   * @returns {Expression}
   */
  static parse(str) { return matchBrackets(tokenize(str)) }

  /**
   * Evaluates an expression using a given map of variables and functions.
   * @param {Object.<String, Expression>=} _vars
   * @returns {number|null}
   */
  evaluate(_vars={}) { return null; }

  /**
   * Substitutes a new expression for a variable.
   * @param {Object.<String, Expression>=} _vars
   * @returns {Expression}
   */
  substitute(_vars={}) { return this; }

  /**
   * Returns the simplest mathematically equivalent expression.
   * @returns {Expression}
   */
  get simplified() { return this; }

  /**
   * Returns a list of all variables used in the expression.
   * @returns {String[]}
   */
  get variables() { return []; }

  /**
   * Returns a list of all functions called by the expression.
   * @returns {String[]}
   */
  get functions() { return []; }

  /**
   * Converts the expression to a plain text string.
   * @returns {string}
   */
  toString() { return ''; }

  /**
   * Converts the expression to a MathML string.
   * @param {Object.<String, Function>=} _custom
   * @returns {string}
   */
  toMathML(_custom={}) { return ''; }

  /**
   * Checks numerically if two expressions are equal. Obviously this is not a
   * very robust solution, but much easier than the full CAS simplification.
   * @param {Expression} expr1
   * @param {Expression} expr2
   * @returns {boolean}
   */
  static numEquals(expr1, expr2) {
    const vars = unique([...expr1.variables, ...expr2.variables]);

    // We only test positive random numbers, because negative numbers raised
    // to non-integer powers return NaN.
    for (let i=0; i<5; ++i) {
      const substitution = {};
      for (let v of vars) substitution[v] = CONSTANTS[v] || Math.random() * 5;
      const a = expr1.evaluate(substitution);
      const b = expr2.evaluate(substitution);
      if (!nearlyEquals(a, b)) return false;
    }
    return true;
  }
}

// -----------------------------------------------------------------------------

export class ExprNumber extends Expression {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

export  class ExprIdentifier extends Expression {
  constructor(i) { super(); this.i = i; }

  evaluate(vars={}) {
    if (this.i in vars) return vars[this.i];
    if (this.i in CONSTANTS) return CONSTANTS[this.i];
    throw ExprError.undefinedVariable(this.i);
  }

  substitute(vars={}) { return vars[this.i] || this; }
  get variables() { return [this.i]; }
  toString() { return this.i; }
  toMathML() { return `<mi>${this.i}</mi>`; }
}

export class ExprString extends Expression {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw ExprError.undefinedVariable(this.s); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

export class ExprSpace {
  toString() { return ' '; }
  toMathML() { return `<mspace/>`; }
}

export class ExprOperator {
  constructor(o) { this.o = o; }
  toString() { return this.o.replace('//', '/'); }
  toMathML() { return `<mo value="${this.toString()}">${this.toString()}</mo>`; }
}

export class ExprTerm extends Expression {
  constructor(items) { super(); this.items = items; }
  evaluate(vars={}) { return this.toFunction().evaluate(vars); }
  substitute(vars={}) { return this.toFunction().substitute(vars); }
  get simplified() { return this.toFunction().variables; }
  get variables() { return this.toFunction().variables; }
  get functions() { return this.toFunction().functions; }
  toString() { return this.items.map(i => i.toString()).join(' '); }
  toMathML(custom={}) { return this.items.map(i => i.toMathML(custom)).join(''); }
  toFunction() { return collapseTerm(this.items); }
}
