'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// =============================================================================

// =============================================================================


/**
 * Returns the last item in an array, or the ith item from the end.
 * @param {Array} array
 * @param {?Number} i
 * @returns {*}
 */
function last(array, i=0) {
  return array[array.length - 1 - i];
}


/**
 *
 * @param array
 * @returns {Function}
 */
function unique(array) {
  return array.filter((a, i, _this) => _this.indexOf(a) == i);
  // return [...new Set([this])];
}


/**
 *
 * @param array
 */
function flatten(array) {
  return array.reduce((a, b) =>
    a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

// =============================================================================

// =============================================================================

// =============================================================================

/*
 * Checks if an object is a string.
 * @param {*} x
 * @returns {boolean}
 */
function isString(x) {
  return (x instanceof String) || (typeof x === 'string');
}

/*
 * Checks if an object is a number.
 * @param {*} x
 * @returns {boolean}
 */
function isNumber(x) {
  return (x instanceof Number) || (typeof x === 'number');
}

// =============================================================================

// =============================================================================
// Hilbert.js | Symbols
// (c) Mathigon
// =============================================================================



const SPECIAL_OPERATORS = {
  '*': '·',
  '**': '∗',
  '//': '/',
  '+-': '±',
  xx: '×',
  sum: '∑',
  prod: '∏',
  int: '∫',
  del: '∂',
  grad: '∇',
  aleph: 'ℵ',
  not: '¬',
  AA: '∀',
  EE: '∃',

  '!=': '≠',
  '<=': '≤',
  '>=': '≥',
  in: '∈',
  '!in': '∉',
  '==': '≡',
  '~=': '≅',
  '~~': '≈',
  sub: '⊂',
  sube: '⊆',
  prop: '∝',

  '<-': '←',
  '->': '→',
  '=>': '⇒',
  '<=>': '⇔',
  '|->': '↦',
  uarr: '↑',
  darr: '↓',
  lArr: '⇐',

  CC: 'ℂ',
  NN: 'ℕ',
  QQ: 'ℚ',
  RR: 'ℝ',
  ZZ: 'ℤ'
};

const SPECIAL_IDENTIFIERS = {
  Gamma: 'Γ',
  Delta: 'Δ',
  Theta: 'Θ',
  Lambda: 'Λ',
  Xi: 'Ξ',
  Pi: 'Π',
  Sigma: 'Σ',
  Phi: 'Φ',
  Psi: 'Ψ',
  Omega: 'Ω',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ɛ',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω'
};

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const LOWERCASE = ALPHABET.split('');
const UPPERCASE = ALPHABET.toUpperCase().split('');
const GREEK = Object.values(SPECIAL_IDENTIFIERS);
const IDENTIFIER_SYMBOLS = [...LOWERCASE, ...UPPERCASE, ...GREEK];

const SIMPLE_SYMBOLS = '|()[]{}÷,!<>=*/+-–~';
const COMPLEX_SYMBOLS = Object.values(SPECIAL_OPERATORS);
const OPERATOR_SYMBOLS = [...SIMPLE_SYMBOLS, ...COMPLEX_SYMBOLS];

// =============================================================================


/* const PRECEDENCE = ['+', '-', '*', '/', 'sqrt', '^'];

function needsBrackets(expr, parentOperator) {
  if (isNumber(expr) || isString(expr)) return false;
  return PRECEDENCE.indexOf(parentOperator) < PRECEDENCE.indexOf(expr[0]);
} */

class ExprFunction {

  constructor(fn, args=[]) {
    this.fn = fn;
    this.args = args;
  }

  evaluate(vars) {
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

  substitute(vars) {
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

// =============================================================================

const BRACKETS = {'(': ')', '[': ']', '{': '}', '|': '|'};

// -----------------------------------------------------------------------------

function createToken(buffer, type) {
  if (!buffer || !type) return null;

  if (type === 'NUM') return new ExprNumber(+buffer);
  if (type === 'SPACE' && buffer.length > 1) return [new ExprSpace()];
  if (type === 'STRING') return new ExprString(buffer);

  if (type === 'VAR') {
    if (buffer in SPECIAL_IDENTIFIERS) {
      return new ExprIdentifier(SPECIAL_IDENTIFIERS[buffer])
    } else if (buffer in SPECIAL_OPERATORS) {
      return new ExprOperator(SPECIAL_OPERATORS[buffer])
    } else {
      return new ExprIdentifier(buffer);
    }
  }

  if (type === 'OP') {
    if (buffer in SPECIAL_OPERATORS) {
      return new ExprOperator(SPECIAL_OPERATORS[buffer])
    } else {
      return new ExprOperator(buffer);
    }
  }
}

function tokenize(str) {
  const tokens = [];
  let buffer = '';
  let type = '';  // NUM, VAR, OP, SPACE, STR

  for (let s of str) {

    // Handle Strings
    if (s === '"') {
      const newType = (type === 'STR') ? '' : 'STR';
      const token = createToken(buffer, type);
      if (token) tokens.push(token);
      buffer = '';
      type = newType;
      continue;
    } else if (type === 'STR') {
      buffer += s;
      continue;
    }

    const sType = s.match(/[0-9.]/) ? 'NUM' : IDENTIFIER_SYMBOLS.includes(s) ? 'VAR' :
        OPERATOR_SYMBOLS.includes(s) ? 'OP' : s.match(/\s/) ? 'SPACE' : '';
    if (!sType) throw new ExprError('Syntax Error', `Unknown symbol "${s}".`);

    if (!type || (type === 'NUM' && sType !== 'NUM') ||
        (type === 'VAR' && sType !== 'VAR' && sType !== 'NUM') ||
        (type === 'OP' && !((buffer + s) in SPECIAL_OPERATORS)) ||
        (type === 'SPACE' && sType !== 'SPACE')) {
      const token = createToken(buffer, type);
      if (token) tokens.push(token);
      buffer = '';
      type = sType;
    }

    buffer += s;
  }

  const token = createToken(buffer, type);
  if (token) tokens.push(token);

  return tokens;
}

// -----------------------------------------------------------------------------

function makeTerm(items) {
  return (items.length === 1) ? items[0] : new ExprTerm(items);
}

function splitArray(items, check) {
  const result = [[]];
  for (let i of items) {
    if (check[i]) {
      result.push([]);
    } else {
      last(result).push(i);
    }
  }
  return result;
}

function matchBrackets(tokens) {
  const stack = [[]];

  for (let t of tokens) {
    const lastOpen = last(stack).length ? last(stack)[0].o : null;

    if (')]}'.includes(t.o) || (t.o === '|' && lastOpen === '|')) {

      if (t.o !== BRACKETS[lastOpen])
        throw new ExprError('SyntaxError', `Unmatched bracket “${t.o}”.`);

      const closed = stack.pop();
      const term = last(stack);

      // Check if this is a normal bracket, or a function call.
      const isFn = (t.o === ')' && last(term) instanceof ExprIdentifier);
      const fnName = isFn ? term.pop().i : t.o === '|' ? 'abs' : closed[0];

      // Support multiple arguments for function calls.
      const args = splitArray(closed.slice(1), a => a.o === ',');
      term.push(new ExprFunction(fnName, args.map(makeTerm)));

    } else if('([{|'.includes(t.o)) {
      stack.push([t]);

    } else {
      last(stack).push(t);
    }
  }

  if (stack.length > 1)
    throw new ExprError('SyntaxError', `Unclosed bracket “${last(stack)[0]}”.`);

  return makeTerm(stack[0]);
}

// -----------------------------------------------------------------------------

/* function findBinaryFunction(tokens, chars) {
  for (let i=0; i<tokens.length; ++i) {
    if (chars.includes(tokens[i])) {
      let a = tokens[i-1];
      let b = tokens[i+1];
      if (b == null) throw new ExprError('SyntaxError', `An expression cannot end with a “${tokens[i]}”.`);
      if ('+-* / ^% ! ' .includes(a)) throw new ExprError('SyntaxError', `A “${a}” cannot be followed by a “${tokens[i]}”.`);
      if ('+-* /^%!'.includes(b)) throw new ExprError('SyntaxError', `A “${tokens[i]}” cannot be followed by a “${b}”.`);
      tokens.splice(i - 1, 3, [tokens[i], a, b]);
      i -= 2;
    }
  }
}*/

function collapseTerm() {
  // TODO Operators to functions, implicit multiplication, equals sign, ...
  // TODO Support >2 arguments for + and *

  /*
  findBinaryFunction(tokens, '^');  // Powers
  findBinaryFunction(tokens, '* /');  // Multiplication and division.

  // Implicit multiplication (consecutive expressions)
  for (let i=0; i<tokens.length-1; ++i) {
    if (!'+-* /^%!'.includes(tokens[i]) && !'+-* /^%!'.includes(tokens[i+1])) {
      tokens.splice(i, 2, ['*', tokens[i], tokens[i+1]]);
      i -= 1;
    }
  }

  // Leading (plus)minus.
  if ('-±'.includes(tokens[0])) {
    if (tokens.length <= 1) throw new ExprError('SyntaxError', `This expression is invalid.`);
    tokens.splice(0, 2, [tokens[0], tokens[1]]);
  }

  findBinaryFunction(tokens, '+-±');  // Addition and subtraction.
  findBinaryFunction(tokens, '=<>≤≥');  // Equalities and inequalities.

  if (tokens.length > 1) throw new ExprError('SyntaxError', `This expression is invalid.`);
  return tokens[0]; */
}

// =============================================================================


const CONSTANTS = {
  pi: Math.PI,
  e: Math.E
};

class Expression {
  static parse(str) { return matchBrackets(tokenize(str)) }
  evaluate() { return null; }
  substitute() { return this; }
  get simplified() { return this; }
  get variables() { return []; }
  get functions() { return []; }
  toString() { return ''; }
  toMathML() { return ''; }
}

class ExprError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

class ExprNumber extends Expression {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

class ExprIdentifier extends Expression {
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

class ExprString extends Expression {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw new ExprError('EvalError', 'Expressions contains a string.'); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

class ExprSpace {
  toString() { return ' '; }
  toMathML() { return `<mspace></mspace>`; }
}

class ExprOperator {
  constructor(o) { this.o = o; }
  toString() { return '' + this.o; }
  toMathML() { return `<mo value="${this.o}">${this.o}</mo>`; }
}

class ExprTerm extends Expression {
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

// =============================================================================

exports.ExprError = ExprError;
exports.Expression = Expression;
