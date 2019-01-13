// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================



import { tokenize, matchBrackets, collapseTerm } from './parser'
import { ExprError } from './errors'


const CONSTANTS = {
  pi: Math.PI,
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
  toString() { return '' + this.i; }
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
  toString() { return '' + this.o; }
  toMathML() { return `<mo value="${this.o}">${this.o}</mo>`; }
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
