// =============================================================================
// Hilbert.js | Functions
// (c) Mathigon
// =============================================================================


import {unique, flatten, words, isOneOf} from '@mathigon/core';
import {BRACKETS, escape, isSpecialFunction} from './symbols';
import {ExprElement, ExprTerm, ExprNumber, CustomFunction, MathMLMap, VarMap, ExprMap} from './elements';
import {ExprError} from './errors';


const PRECEDENCE = words('+ − * × · / ÷ // sup sub');
const COMMA = '<mo value="," lspace="0">,</mo>';

function needsBrackets(expr: ExprElement, parentFn: string): boolean {
  if (!PRECEDENCE.includes(parentFn)) return false;
  if (expr instanceof ExprTerm) return true;
  if (!(expr instanceof ExprFunction)) return false;
  if (!PRECEDENCE.includes(expr.fn)) return false;
  return PRECEDENCE.indexOf(parentFn) > PRECEDENCE.indexOf(expr.fn);
}

function addMFence(expr: ExprElement, fn: string, string: string) {
  return needsBrackets(expr, fn) ? `<mfenced>${string}</mfenced>` : string;
}

function addMRow(expr: ExprElement, string: string) {
  const needsRow = (expr instanceof ExprTerm) || (expr instanceof ExprFunction);
  return needsRow ? `<mrow>${string}</mrow>` : string;
}


export class ExprFunction extends ExprElement {

  constructor(readonly fn: string, readonly args: ExprElement[] = []) {
    super();
  }

  evaluate(vars: VarMap = {}) {
    const args = this.args.map(a => a.evaluate(vars));
    if (this.fn in vars) return (vars[this.fn] as CustomFunction)(...args);

    switch (this.fn) {
      case '+':
        return args.reduce((a, b) => a + b, 0);
      case '−':
        return (args.length > 1) ? args[0] - args[1] : -args[0];
      case '*':
      case '·':
      case '×':
        return args.reduce((a, b) => a * b, 1);
      case '/':
        return args[0] / args[1];
      case 'sin':
        return Math.sin(args[0]);
      case 'cos':
        return Math.sin(args[0]);
      case 'tan':
        return Math.sin(args[0]);
      case 'log':
        return Math.log(args[0]) / Math.log(args[1] || Math.E);
      case 'sup':
        return Math.pow(args[0], args[1]);
      case 'sqrt':
        return Math.sqrt(args[0]);
      case 'root':
        return Math.pow(args[0], 1 / args[1]);
      case '(':
        return args[0];
      // TODO Implement for all functions
    }

    throw ExprError.undefinedFunction(this.fn);
  }

  substitute(vars: ExprMap = {}) {
    return new ExprFunction(this.fn, this.args.map(a => a.substitute(vars)));
  }

  collapse() {
    if (this.fn === '(') return this.args[0].collapse();
    return new ExprFunction(this.fn, this.args.map(a => a.collapse()));
  }

  get simplified() {
    // TODO Write CAS simplification algorithms
    return this;
  }

  get variables() {
    return unique(flatten(this.args.map(a => a.variables)));
  }

  get functions() {
    return unique([this.fn, ...flatten(this.args.map(a => a.functions))]);
  }

  toString() {
    const args = this.args.map(a => needsBrackets(a, this.fn) ?
      '(' + a.toString() + ')' : a.toString());

    if (this.fn === '−')
      return args.length > 1 ? args.join(' − ') : '−' + args[0];

    if (this.fn === 'sup') return args.join('^');
    if (this.fn === 'sub') return args.join('_');

    if (words('+ * × · / = < > ≤ ≥ ≈').includes(this.fn))
      return args.join(' ' + this.fn + ' ');

    if (isOneOf(this.fn, '(', '[', '{'))
      return this.fn + this.args.join(', ') + BRACKETS[this.fn];

    if (isOneOf(this.fn, '!', '%')) return args[0] + this.fn;

    // TODO Implement other functions
    return `${this.fn}(${args.join(', ')})`;
  }

  toMathML(custom: MathMLMap = {}) {
    const args = this.args.map(a => a.toMathML(custom));
    const argsF = this.args.map((a, i) => addMFence(a, this.fn, args[i]));

    if (this.fn in custom) {
      const argsX = args.map((a, i) => ({
        toString: () => a,
        val: this.args[i]
      }));
      return custom[this.fn](...argsX);
    }

    if (this.fn === '−') return argsF.length > 1 ?
      argsF.join('<mo value="−">−</mo>') : '<mo rspace="0" value="−">−</mo>' + argsF[0];

    if (isOneOf(this.fn, '+', '=', '<', '>', '≤', '≥', '≈')) {
      const fn = escape(this.fn);
      return argsF.join(`<mo value="${fn}">${fn}</mo>`);
    }

    if (isOneOf(this.fn, '*', '×', '·')) {
      let str = argsF[0];
      for (let i = 1; i < argsF.length - 1; ++i) {
        // We only show the × symbol between consecutive numbers.
        const showTimes = (this.args[0] instanceof ExprNumber && this.args[1] instanceof ExprNumber);
        str += (showTimes ? `<mo value="×">×</mo>` : '') + argsF[1];
      }
      return str;
    }

    if (this.fn === '//') return argsF.join(`<mo value="/">/</mo>`);
    if (this.fn === 'sqrt') return `<msqrt>${argsF[0]}</msqrt>`;

    if (isOneOf(this.fn, '/', 'root')) {
      // Fractions or square roots don't have brackets around their arguments
      const el = (this.fn === '/' ? 'mfrac' : 'mroot');
      const args1 = this.args.map((a, i) => addMRow(a, args[i]));
      return `<${el}>${args1.join('')}</${el}>`;
    }

    if (isOneOf(this.fn, 'sup', 'sub')) {
      // Sup and sub only have brackets around their first argument.
      const args1 = [addMRow(this.args[0], argsF[0]), addMRow(this.args[1], args[1])];
      return `<m${this.fn}>${args1.join('')}</m${this.fn}>`;
    }

    if (isOneOf(this.fn, '(', '[', '{'))
      return `<mfenced open="${this.fn}" close="${BRACKETS[this.fn]}">${argsF.join(COMMA)}</mfenced>`;

    if (isOneOf(this.fn, '!', '%'))
      return argsF[0] + `<mo value="${this.fn}" lspace="0">${this.fn}</mo>`;

    if (this.fn === 'abs')
      return `<mfenced open="|" close="|">${argsF.join(COMMA)}</mfenced>`;

    if (this.fn === 'bar')
      return `<mover>${addMRow(this.args[0], argsF[0])}<mo value="‾">‾</mo></mover>`;

    if (this.fn === 'vec')
      return `<mover>${addMRow(this.args[0], argsF[0])}<mo value="→">→</mo></mover>`;

    // TODO Implement other functions
    const variant = isSpecialFunction(this.fn) ? ' mathvariant="normal"' : '';
    return `<mi${variant}>${this.fn}</mi><mfenced>${argsF.join(COMMA)}</mfenced>`;
  }
}
