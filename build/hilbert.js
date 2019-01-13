'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// =============================================================================
// Hilbert.js | Expression Errors
// (c) Mathigon
// =============================================================================



/**
 * Expression Error Class
 */
class ExprError extends Error {

  constructor(name, message) {
    super(message);
    this.name = name;
  }

  // ---------------------------------------------------------------------------
  // Eval Errors

  static undefinedVariable(x) {
    return new ExprError('EvalError', `Undefined variable “${x}”.`);
  }

  static undefinedFunction(x) {
    return new ExprError('EvalError', `Undefined function “${x}”.`);
  }



  // ---------------------------------------------------------------------------
  // Syntax Errors

  static invalidCharacter(x) {
    return new ExprError('SyntaxError', `Unknown symbol “${x}”.`);
  }

  static conflictingBrackets(x) {
    return new ExprError('SyntaxError', `Conflicting brackets “${x}”.`);
  }

  static unclosedBracket(x) {
    return new ExprError('SyntaxError', `Unclosed bracket “${x}”.`);
  }

  static startingOperator(x) {
    return new ExprError('SyntaxError', `A term cannot start or end with a “${x}”.`);
  }

  static consecutiveOperators(x, y) {
    return new ExprError('SyntaxError', `A “${x}” cannot be followed by a “${y}”.`);
  }

  static invalidExpression() {
    return new ExprError('SyntaxError', `This expression is invalid.`);
  }
}

// =============================================================================


/**
 * Checks if x is strictly equal to any one of the following arguments
 * @param {*} x
 * @param {...*} values
 * @returns {boolean}
 */
function isOneOf(x, ...values) {
  for (let v of values) {
    if (x === v) return true;
  }
  return false;
}

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


/**
 * Splits a string into space separated words.
 * @param {string} str
 * @returns {Array<string>}
 */
function words(str) {
  if (!str) return [];
  return str.trim().split(/\s+/);
}

// =============================================================================

// =============================================================================

// =============================================================================
// Hilbert.js | Symbols
// (c) Mathigon
// =============================================================================



const BRACKETS = {'(': ')', '[': ']', '{': '}', '|': '|'};

const SPECIAL_OPERATORS = {
  '*': '·',
  '**': '∗',
  '//': '//',
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

const SIMPLE_SYMBOLS = '|()[]{}÷,!<>=*/+-–~^_…';
const COMPLEX_SYMBOLS = Object.values(SPECIAL_OPERATORS);
const OPERATOR_SYMBOLS = [...SIMPLE_SYMBOLS, ...COMPLEX_SYMBOLS];

// =============================================================================


const PRECEDENCE = words('+ - * × · // ^');
const COMMA = '<mo value="," lspace="0">,</mo>';

function needsBrackets(expr, parentFn) {
  if (!PRECEDENCE.includes(parentFn)) return false;
  if (expr instanceof ExprTerm) return true;
  if (!(expr instanceof ExprFunction)) return false;
  if (!PRECEDENCE.includes(expr.fn)) return false;
  return PRECEDENCE.indexOf(parentFn) > PRECEDENCE.indexOf(expr);
}

function addRow(expr, string) {
  const needsRow = (expr instanceof ExprTerm) || (expr instanceof ExprFunction);
  return needsRow ? `<mrow>${string}</mrow>` : string;
}


class ExprFunction {

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

    if (isOneOf(this.fn, '+', '=', '<', '>', '≤', '≥'))
      return args.join(`<mo value="${this.fn}">${this.fn}</mo>`);

    if (isOneOf(this.fn, '*', '×', '·')) {
      return args.join('');
    }

    if (this.fn === 'sqrt') return `<msqrt>${args[0]}</msqrt>`;

    if (isOneOf(this.fn, '/', 'sup', 'sub', 'root')) {
      const el =  {'/': 'mfrac', 'sup': 'msup', 'sub': 'msub', 'root': 'mroot'}[this.fn];
      const args1 = args.map((a, i) => addRow(this.args[i], a));
      return `<${el}>${args1.join('')}</${el}>`;
    }

    if (isOneOf(this.fn, '(', '[', '{'))
      return `<mfenced open="${this.fn}" close="${BRACKETS[this.fn]}">${args.join(COMMA)}</mfenced>`;

    if (isOneOf(this.fn, '!', '%'))
      return args[0] + `<mo value="${this.fn}" lspace="0">${this.fn}</mo>`;

    // TODO Implement other functions
    return `<mi>${this.fn}</mi><mfenced>${args.join(COMMA)}</mfenced>`;
  }
}

// =============================================================================



// -----------------------------------------------------------------------------
// Tokenizer

function createToken(buffer, type) {
  if (!buffer || !type) return null;

  if (type === 'NUM') return new ExprNumber(+buffer);
  if (type === 'SPACE' && buffer.length > 1) return new ExprSpace();
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
    if (!sType) throw ExprError.invalidCharacter(s);

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
// Utility Functions

function makeTerm(items) {
  return (items.length === 1) ? items[0] : new ExprTerm(items);
}

function splitArray(items, check) {
  const result = [[]];
  for (let i of items) {
    if (check(i)) {
      result.push([]);
    } else {
      last(result).push(i);
    }
  }
  return result;
}

function isOperator(expr, fns) {
  return expr instanceof ExprOperator && words(fns).includes(expr.o);
}

function removeBrackets(expr) {
  return (expr instanceof ExprFunction && expr.fn === '(') ? expr.args[0] : expr;
}

function findBinaryFunction(tokens, fn, toFn) {
  if (isOperator(tokens[0], fn) || isOperator(tokens[tokens.length - 1], fn))
    throw ExprError.startingOperator(fn);

  for (let i = 1; i < tokens.length - 1; ++i) {
    if (!isOperator(tokens[i], fn)) continue;

    const a = tokens[i - 1];
    const b = tokens[i + 1];
    if (a instanceof ExprOperator) throw ExprError.consecutiveOperators(a.o, tokens[i].o);
    if (b instanceof ExprOperator) throw ExprError.consecutiveOperators(tokens[i].o, b.o);

    const args = [removeBrackets(a), removeBrackets(b)];
    tokens.splice(i - 1, 3, new ExprFunction(toFn || tokens[i].o, args));
    i -= 2;
  }
}


// -----------------------------------------------------------------------------
// Match Brackets

function prepareTerm(tokens) {
  // TODO Combine sup and sub calls into a single supsub function.
  findBinaryFunction(tokens, '^', 'sup');
  findBinaryFunction(tokens, '/');
  return makeTerm(tokens);
}

function matchBrackets(tokens) {
  findBinaryFunction(tokens, '_', 'sub');
  const stack = [[]];

  for (let t of tokens) {
    const lastOpen = last(stack).length ? last(stack)[0].o : null;

    if (isOperator(t, ') ] }') || (isOperator(t, '|') && lastOpen === '|')) {

      if (!isOperator(t, BRACKETS[lastOpen]))
        throw ExprError.conflictingBrackets(t.o);

      const closed = stack.pop();
      const term = last(stack);

      // Check if this is a normal bracket, or a function call.
      const isFn = (isOperator(t, ')') && last(term) instanceof ExprIdentifier);
      const fnName = isFn ? term.pop().i : isOperator(t, '|') ? 'abs' : closed[0].o;

      // Support multiple arguments for function calls.
      const args = splitArray(closed.slice(1), a => isOperator(a, ','));
      term.push(new ExprFunction(fnName, args.map(prepareTerm)));

    } else if (isOperator(t, '( [ { |')) {
      stack.push([t]);

    } else {
      last(stack).push(t);
    }
  }

  if (stack.length > 1) throw ExprError.unclosedBracket(last(stack)[0].o);
  return prepareTerm(stack[0]);
}


// -----------------------------------------------------------------------------
// Collapse term items

function collapseTerm(tokens) {
  findBinaryFunction(tokens, '= < > ≤ ≥');
  findBinaryFunction(tokens, '//', '/');

  // TODO Match multiplication and implicit multiplication

  // TODO Match starting - or ±

  findBinaryFunction(tokens, '-', '-');
  findBinaryFunction(tokens, '±', '±');

  // TODO Match addition

  if (tokens.length > 1) throw ExprError.invalidExpression();
  return tokens[0];
}

// =============================================================================


const CONSTANTS = {
  pi: Math.PI,
  e: Math.E
};

/**
 * Maths Expression
 */
class Expression {

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

class ExprNumber extends Expression {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

class ExprIdentifier extends Expression {
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

class ExprString extends Expression {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw ExprError.undefinedVariable(this.s); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

class ExprSpace {
  toString() { return ' '; }
  toMathML() { return `<mspace/>`; }
}

class ExprOperator {
  constructor(o) { this.o = o; }
  toString() { return this.o.replace('//', '/'); }
  toMathML() { return `<mo value="${this.toString()}">${this.toString()}</mo>`; }
}

class ExprTerm extends Expression {
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

// =============================================================================

exports.ExprError = ExprError;
exports.Expression = Expression;
