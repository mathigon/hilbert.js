// =============================================================================
// Hilbert.js | Expressions
// (c) Mathigon
// =============================================================================


import {Interval} from './eval';
import {Expression} from './expression';
import {CONSTANTS, escape, isSpecialFunction, VOICE_STRINGS} from './symbols';
import {ExprError} from './errors';


export interface MathMLArgument {
  val: ExprElement;
  toString: () => string;
}

export type CustomFunction = ((...args: number[]) => number);
export type VarMap = Record<string, number|string|Interval|ExprElement|CustomFunction>;
export type ExprMap = Record<string, ExprElement>;
export type MathMLMap = Record<string, (...args: MathMLArgument[]) => string>;

const toNumber = (x: number|Interval) => ((typeof x === 'number') ? x : x[0]);
const toInterval = (x: number|Interval): Interval => ((typeof x === 'number') ? [x, x] : x);


/**
 * Maths Expression
 */
export abstract class ExprElement {

  /** Evaluates an expression using a given map of variables and functions. */
  evaluate(_vars: VarMap = {}, _privateNested?: boolean): number {
    return NaN;
  }

  interval(vars: VarMap = {}, _privateNested?: boolean): Interval {
    return toInterval(this.evaluate(vars));
  }

  /** Substitutes a new expression for a variable. */
  substitute(_vars: ExprMap = {}): ExprElement {
    return this;
  }

  /** Returns the simplest mathematically equivalent expression. */
  get simplified(): ExprElement {
    return this;
  }

  /** Returns a list of all variables used in the expression. */
  get variables(): string[] {
    return [];
  }

  /** Returns a list of all functions called by the expression. */
  get functions(): string[] {
    return [];
  }

  /** Collapses all terms into functions. */
  collapse(): ExprElement {
    return this;
  }

  /** Converts the expression to a plain text string. */
  toString() {
    return '';
  }

  /** Converts the expression to a MathML string. */
  toVoice(_custom: MathMLMap = {}) {
    return '';
  }

  /** Converts the expression to a MathML string. */
  toMathML(_custom: MathMLMap = {}) {
    return '';
  }
}


// -----------------------------------------------------------------------------
// Evaluation tools

const LOOP_DETECTION = new Set<string>();

// TODO Cache results for performance!
function evaluateHelper(name: string, vars: VarMap, nested = false): number|Interval {
  let value = vars[name] ?? CONSTANTS[name];
  if (!value) throw ExprError.undefinedVariable(name);

  if (typeof value === 'string' || value instanceof ExprElement) {
    if (!nested) LOOP_DETECTION.clear();
    if (LOOP_DETECTION.has(name)) throw ExprError.evalLoop(name);
    LOOP_DETECTION.add(name);
    if (typeof value === 'string') value = Expression.parse(value);
    return value.evaluate(vars, true);
  } else if (typeof value === 'function') {
    return value();
  } else {
    return value;
  }
}


// -----------------------------------------------------------------------------

export class ExprNumber extends ExprElement {

  constructor(readonly n: number) {
    super();
  }

  evaluate() {
    return this.n;
  }

  toString() {
    return '' + this.n;
  }

  toVoice() {
    return '' + this.n;
  }

  toMathML() {
    return `<mn>${this.n}</mn>`;
  }
}

export class ExprIdentifier extends ExprElement {

  constructor(readonly i: string) {
    super();
  }

  evaluate(vars: VarMap = {}, privateNested?: boolean) {
    return toNumber(evaluateHelper(this.i, vars, privateNested));
  }

  interval(vars: VarMap = {}, privateNested?: boolean): Interval {
    return toInterval(evaluateHelper(this.i, vars, privateNested));
  }

  toMathML() {
    const variant = isSpecialFunction(this.i) ? ' mathvariant="normal"' : '';
    return `<mi${variant}>${this.i}</mi>`;
  }

  substitute(vars: ExprMap = {}) {
    return vars[this.i] || this;
  }

  get variables() {
    return [this.i];
  }

  toString() {
    return this.i;
  }

  toVoice() {
    // Surrounding single-letter variables with _s can help with TTS algorithms.
    if (this.i in VOICE_STRINGS) return VOICE_STRINGS[this.i];
    if (this.i.length === 1) return `_${this.i}_`;
    return this.i;
  }
}

export class ExprString extends ExprElement {

  constructor(readonly s: string) {
    super();
  }

  evaluate(vars: VarMap = {}, privateNested?: boolean) {
    return toNumber(evaluateHelper(this.s, vars, privateNested));
  }

  toString() {
    return '"' + this.s + '"';
  }

  toVoice() {
    return this.s;
  }

  toMathML() {
    return `<mtext>${this.s}</mtext>`;
  }
}

export class ExprSpace extends ExprElement {

  toString() {
    return ' ';
  }

  toMathML() {
    return `<mspace></mspace>`;
  }
}

export class ExprOperator extends ExprElement {

  constructor(readonly o: string) {
    super();
  }

  toString() {
    return this.o.replace('//', '/');
  }

  toVoice() {
    return VOICE_STRINGS[this.o] || this.o;
  }

  get functions() {
    return [this.o];
  }

  toMathML() {
    const op = escape(this.toString());
    return `<mo value="${op}">${op}</mo>`;
  }
}
