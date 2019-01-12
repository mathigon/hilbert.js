// =============================================================================
// Hilbert.js | Fnctions
// (c) Mathigon
// =============================================================================



import { unique, flatten, isNumber, isString } from '@mathigon/core'
import { ExprError } from './expression'


/* const PRECEDENCE = ['+', '-', '*', '/', 'sqrt', '^'];

function needsBrackets(expr, parentOperator) {
  if (isNumber(expr) || isString(expr)) return false;
  return PRECEDENCE.indexOf(parentOperator) < PRECEDENCE.indexOf(expr[0]);
} */

export class ExprFunction {

  constructor(fn, args=[]) {
    this.fn = fn;
    this.args = args;
  }

  evaluate(vars={}) {
    // TODO Implement for all functions
    const args = this.args.map(a => a.evaluate(vars));
    if (this.fn in vars) return vars[this.fn](...args);

    switch(this.fn) {
      case '+': return args.reduce((a, b) => a + b, 0);
      // TODO case '-': return (a, b) => (b === undefined) ? -a : a - b;
      case '*': return args.reduce((a, b) => a * b, 1);
      case '/': return args[0] / args[1];
      case 'sin': return Math.sin(args[0]);
      case 'cos': return Math.sin(args[0]);
      case 'tan': return Math.sin(args[0]);
      case 'log': return Math.log(args[0]) / Math.log(args[1] || Math.E);
      case 'sup': return Math.pow(args[0], args[1]);
    }

    throw new ExprError('EvalError', `Unable to evaluate function "${this.fn}".`);
  }

  substitute(vars={}) {
    return new ExprFunction(this.fn, this.args.map(a => a.substitute(vars)));
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
    // TODO Implement for all functions
    const args = this.args.map(a => a.toString());

    switch(this.fn) {
      case '+': return args.join(' + ');
      // '-': (a, b) => (b === undefined) ? '-' + a : a + ' - ' + b,
      // '*': (...args) => args.join('*'),
      // '/': (a, b) => a + '/' + b,
      // '!': x => x + '!',
      // '%': x => x + '%',
      // 'abs': x => '|' + x + '|',
      // '^': (a, b) => a + '^' + b,
      // '=': (a, b) => a + ' = ' + b,
      // '<': (a, b) => a + ' < ' + b,
      // '>': (a, b) => a + ' > ' + b,
      // '≤': (a, b) => a + ' ≤ ' + b,
      // '≥': (a, b) => a + ' ≥ ' + b
    }

    return `${this.fn}(${args.join(', ')})`;
  }

  toMathML() {
    // TODO Implement for all functions
    // TODO Distinguish between fractions and '÷'.
    const args = this.args.map(a => a.toMathML());

    // const argsStr = this.args.map(a => needsBrackets(a, this.fn) ?
    //     `<mfenced>${a.toMathML()}</mfenced>` : a.toMathML());

    switch(this.fn) {
      case 'sqrt': return `<msqrt>${args[0]}</msqrt>`;
      case '/': return `<mfrac><mrow>${args[0]}</mrow><mrow>${args[1]}</mrow></mfrac>`;
      case 'sup': return `<msup>${args[0]}<mrow>${args[1]}</mrow></msup>`;
      case '*':
        if (isNumber(this.args[0]) && isString(this.args[1])) return args.join('');
        return args.join('<mo value="×">×</mo>');
      case '+': return args.join('<mo value="+">+</mo>');
      case '-': return args.join('<mo value="–">–</mo>');
      default: return `<mi>TODO</mi>`;
    }
  }
}
