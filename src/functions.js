// =============================================================================
// Hilbert.js | Functions
// (c) Mathigon
// =============================================================================



import { unique, flatten, words, isOneOf } from '@mathigon/core'
import { BRACKETS } from './symbols'
import { ExprTerm } from './expression'
import { ExprError } from './errors'


const PRECEDENCE = words('+ - * × · // ^');
const COMMA = '<mo value="," lspace="0">,</mo>';

function needsBrackets(expr, parentFn) {
  if (!PRECEDENCE.includes(parentFn)) return false;
  if (expr instanceof ExprTerm) return true;
  if (!(expr instanceof ExprFunction)) return false;
  if (!PRECEDENCE.includes(expr.fn)) return false;
  return PRECEDENCE.indexOf(parentFn) > PRECEDENCE.indexOf(expr);
}


export class ExprFunction {

  constructor(fn, args=[]) {
    this.fn = fn;
    this.args = args;
  }

  evaluate(vars={}) {
    const args = this.args.map(a => a.evaluate(vars));
    if (this.fn in vars) return vars[this.fn](...args);

    switch(this.fn) {
      case '+': return args.reduce((a, b) => a + b, 0);
      case '-': return (args.length > 1) ? args[1] - args[0] : -args[0];
      case '*':
      case '·':
      case '×': return args.reduce((a, b) => a * b, 1);
      case '/': return args[0] / args[1];
      case 'sin': return Math.sin(args[0]);
      case 'cos': return Math.sin(args[0]);
      case 'tan': return Math.sin(args[0]);
      case 'log': return Math.log(args[0]) / Math.log(args[1] || Math.E);
      case 'sup': return Math.pow(args[0], args[1]);
      case 'sqrt': return Math.sqrt(args[0]);
      case 'root': return Math.pow(args[0], 1 / args[1]);
      // TODO Implement for all functions
    }

    throw ExprError.undefinedFunction(this.fn);
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
    const args = this.args.map(a => needsBrackets(a, this.fn) ?
        '(' + a.toString() + ')' : a.toString());

    if (this.fn === '-')
      return args.length > 1 ? args.join(' – ') : '-' + args[0];

    if (words('+ * × · / sup = < > ≤ ≥').includes(this.fn))
      return args.join(' ' + this.fn + ' ');

    if (isOneOf(this.fn, '(', '[', '{'))
      return this.fn + this.args.join(', ') + BRACKETS[this.fn];

    if (isOneOf(this.fn, '!', '%')) return args[0] + this.fn;

    // TODO Implement other functions
    return `${this.fn}(${args.join(', ')})`;
  }

  toMathML(custom={}) {
    const args = this.args.map(a => needsBrackets(a, this.fn) ?
        '<mfenced>' + a.toMathML() + '</mfenced>' : a.toMathML());

    if (this.fn in custom) return custom[this.fn](...args);

    if (this.fn === '-') return args.length > 1 ?
        args.join('<mo value="-">–</mo>') : '<mo rspace="0" value="-">–</mo>' + args[0];

    if (words('+ = < > ≤ ≥ //').includes(this.fn))
      return args.join(`<mo value="${this.fn}">${this.fn}</mo>`);

    if (isOneOf(this.fn, '*', '×', '·')) {
      const showTimes = false;  // TODO Decide when to show times symbol.
      return args.join(showTimes ? `<mo value="×">×</mo>` : '');
    }

    if (this.fn === '/')  // TODO Check if we need <mrow>s
      return `<mfrac><mrow>${args[0]}</mrow><mrow>${args[1]}</mrow></mfrac>`;

    if (this.fn === 'sup') return `<msup>${args[0]}<mrow>${args[1]}</mrow></msup>`;
    if (this.fn === 'sub') return `<msub>${args[0]}<mrow>${args[1]}</mrow></msub>`;

    if (this.fn === 'sqrt') return `<msqrt>${args[0]}</msqrt>`;
    if (this.fn === 'root') return `<mroot><mrow>${args[0]}</mrow><mrow>${args[1]}</mrow></mroot>`;

    if (isOneOf(this.fn, '(', '[', '{'))
      return `<mfenced open="${this.fn}" close="${BRACKETS[this.fn]}">${this.args.join(COMMA)}</mfenced>`;

    if (isOneOf(this.fn, '!', '%'))
      return args[0] + `<mo value="${this.fn}" lspace="0">${this.fn}</mo>`;

    // TODO Implement other functions
    return `<mi>${this.fn}</mi><mfenced>${args.join(COMMA)}</mfenced>`;
  }
}
