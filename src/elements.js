// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================



import { join, unique } from '@mathigon/core';
import { CONSTANTS, escape, isSpecialFunction } from './symbols'
import { collapseTerm } from './parser'
import { ExprError } from './errors'



/**
 * Maths Expression
 */
export class ExprElement {

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
   * Collapses all terms into functions.
   * @returns {Expression}
   */
  collapse() { return this; }

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

export class ExprNumber extends ExprElement {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

export  class ExprIdentifier extends ExprElement {
  constructor(i) { super(); this.i = i; }

  evaluate(vars={}) {
    if (this.i in vars) return vars[this.i];
    if (this.i in CONSTANTS) return CONSTANTS[this.i];
    throw ExprError.undefinedVariable(this.i);
  }

  toMathML() {
    const variant = isSpecialFunction(this.i) ? ' mathvariant="normal"' : '';
    return `<mi${variant}>${this.i}</mi>`;
  }

  substitute(vars={}) { return vars[this.i] || this; }
  get variables() { return [this.i]; }
  toString() { return this.i; }
}

export class ExprString extends ExprElement {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw ExprError.undefinedVariable(this.s); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

export class ExprSpace extends ExprElement {
  toString() { return ' '; }
  toMathML() { return `<mspace/>`; }
}

export class ExprOperator extends ExprElement {
  constructor(o) { super(); this.o = o; }
  toString() { return this.o.replace('//', '/'); }
  get functions() { return [this.o]; }

  toMathML() {
    const op = escape(this.toString());
    return `<mo value="${op}">${op}</mo>`;
  }
}

export class ExprTerm extends ExprElement {
  constructor(items) { super(); this.items = items; }
  evaluate(vars={}) { return this.collapse().evaluate(vars); }
  substitute(vars={}) { return this.collapse().substitute(vars); }
  get simplified() { return this.collapse().simplified; }
  get variables() { return unique(join(...this.items.map(i => i.variables))); }
  get functions() { return this.collapse().functions; }
  toString() { return this.items.map(i => i.toString()).join(' '); }
  toMathML(custom={}) { return this.items.map(i => i.toMathML(custom)).join(''); }
  collapse() { return collapseTerm(this.items).collapse(); }
}
