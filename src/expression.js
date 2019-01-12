// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================



import { tokenize, matchBrackets, collapseTerm } from './parser'


const CONSTANTS = {
  pi: Math.PI,
  e: Math.E
};

export class Expression {
  static parse(str) { return matchBrackets(tokenize(str)) }
  evaluate() { return null; }
  substitute() { return this; }
  get simplified() { return this; }
  get variables() { return []; }
  get functions() { return []; }
  toString() { return ''; }
  toMathML() { return ''; }
}

export class ExprError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

export class ExprNumber extends Expression {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

export  class ExprIdentifier extends Expression {
  constructor(i) { super(); this.i = i; }

  evaluate(vars) {
    if (this.i in vars) return vars[this.i];
    if (this.i in CONSTANTS) return CONSTANTS[this.i];
    throw new ExprError('EvalError', `Unknown identifier "${this.i}".`);
  }

  substitute(vars) { return vars[this.i] || this; }
  get variables() { return [this.i]; }
  toString() { return '' + this.i; }
  toMathML() { return `<mi>${this.i}</mi>`; }
}

export class ExprString extends Expression {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw new ExprError('EvalError', 'Expressions contains a string.'); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

export class ExprSpace {
  toString() { return ' '; }
  toMathML() { return `<mspace></mspace>`; }
}

export class ExprOperator {
  constructor(o) { this.o = o; }
  toString() { return '' + this.o; }
  toMathML() { return `<mo value="${this.o}">${this.o}</mo>`; }
}

export class ExprTerm extends Expression {
  constructor(items) { super(); this.items = items; }
  evaluate(vars) { return this.toFunction().evaluate(vars); }
  substitute(vars) { return this.toFunction().substitute(vars); }
  get simplified() { return this.toFunction().variables; }
  get variables() { return this.toFunction().variables; }
  get functions() { return this.toFunction().functions; }
  toString() { return this.items.map(i => i.toString()).join(' '); }
  toMathML() { return this.items.map(i => i.toMathML()).join(''); }
  toFunction() { return collapseTerm(this.items); }
}
