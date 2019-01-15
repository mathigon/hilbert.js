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

// ============================================================================
// Fermat.js | Number Theory
// (c) Mathigon
// ============================================================================



// -----------------------------------------------------------------------------
// Simple Functions

const tolerance = 0.000001;

/**
 * Checks if two numbers are nearly equals.
 * @param {number} x
 * @param {number} y
 * @param {?number} t The allowed tolerance
 * @returns {boolean}
 */
function nearlyEquals(x, y, t = tolerance) {
  return Math.abs(x - y) < t;
}

// ============================================================================

// =============================================================================

// ============================================================================

// =============================================================================

// =============================================================================

// =============================================================================

// =============================================================================

// =============================================================================

// =============================================================================

// =============================================================================

const CONSTANTS = {
  pi: Math.PI,
  e: Math.E
};

// =============================================================================


// -----------------------------------------------------------------------------
// Angles

const twoPi = 2 * Math.PI;

// ============================================================================

// ============================================================================

// ============================================================================

// =============================================================================

// =============================================================================

// ============================================================================

// =============================================================================

// =============================================================================

// =============================================================================
// Hilbert.js | Symbols
// (c) Mathigon
// =============================================================================



const BRACKETS$1 = {'(': ')', '[': ']', '{': '}', '|': '|'};

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


const PRECEDENCE$1 = words('+ - * × · // ^');
const COMMA = '<mo value="," lspace="0">,</mo>';

function needsBrackets$1(expr, parentFn) {
  if (!PRECEDENCE$1.includes(parentFn)) return false;
  if (expr instanceof ExprTerm) return true;
  if (!(expr instanceof ExprFunction)) return false;
  if (!PRECEDENCE$1.includes(expr.fn)) return false;
  return PRECEDENCE$1.indexOf(parentFn) > PRECEDENCE$1.indexOf(expr);
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
      case '-': return (args.length > 1) ? args[0] - args[1] : -args[0];
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
      case '(': return args[0];
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
    const args = this.args.map(a => needsBrackets$1(a, this.fn) ?
        '(' + a.toString() + ')' : a.toString());

    if (this.fn === '-')
      return args.length > 1 ? args.join(' – ') : '-' + args[0];

    if (words('+ * × · / sup = < > ≤ ≥').includes(this.fn))
      return args.join(' ' + this.fn + ' ');

    if (isOneOf(this.fn, '(', '[', '{'))
      return this.fn + this.args.join(', ') + BRACKETS$1[this.fn];

    if (isOneOf(this.fn, '!', '%')) return args[0] + this.fn;

    // TODO Implement other functions
    return `${this.fn}(${args.join(', ')})`;
  }

  toMathML(custom={}) {
    const args = this.args.map(a => needsBrackets$1(a, this.fn) ?
        '<mfenced>' + a.toMathML() + '</mfenced>' : a.toMathML());

    if (this.fn in custom) return custom[this.fn](...args);

    if (this.fn === '-') return args.length > 1 ?
        args.join('<mo value="-">–</mo>') : '<mo rspace="0" value="-">–</mo>' + args[0];

    if (isOneOf(this.fn, '+', '=', '<', '>', '≤', '≥'))
      return args.join(`<mo value="${this.fn}">${this.fn}</mo>`);

    if (isOneOf(this.fn, '*', '×', '·')) {
      let str = args[0];
      for (let i = 1; i < args.length - 1; ++i) {
        // We only show the × symbol between consecutive numbers.
        const showTimes = (this.args[0] instanceof ExprNumber && this.args[1] instanceof ExprNumber);
        str += (showTimes ? `<mo value="×">×</mo>` : '') + args[1];
      }
      return str;
    }

    if (this.fn === 'sqrt') return `<msqrt>${args[0]}</msqrt>`;

    if (isOneOf(this.fn, '/', 'sup', 'sub', 'root')) {
      const el =  {'/': 'mfrac', 'sup': 'msup', 'sub': 'msub', 'root': 'mroot'}[this.fn];
      const args1 = args.map((a, i) => addRow(this.args[i], a));
      return `<${el}>${args1.join('')}</${el}>`;
    }

    if (isOneOf(this.fn, '(', '[', '{'))
      return `<mfenced open="${this.fn}" close="${BRACKETS$1[this.fn]}">${args.join(COMMA)}</mfenced>`;

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

function findBinaryFunction$1(tokens, fn, toFn) {
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
  findBinaryFunction$1(tokens, '^', 'sup');
  findBinaryFunction$1(tokens, '/');
  return makeTerm(tokens);
}

function matchBrackets$1(tokens) {
  findBinaryFunction$1(tokens, '_', 'sub');
  const stack = [[]];

  for (let t of tokens) {
    const lastOpen = last(stack).length ? last(stack)[0].o : null;

    if (isOperator(t, ') ] }') || (isOperator(t, '|') && lastOpen === '|')) {

      if (!isOperator(t, BRACKETS$1[lastOpen]))
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

function findAssociativeFunction(tokens, symbol, implicit=false) {
  const result = [];
  let buffer = [];
  let lastWasSymbol = false;

  function clearBuffer() {
    if (!buffer.length) return;
    result.push(buffer.length > 1 ? new ExprFunction(symbol[0], buffer) : buffer[0]);
    buffer = [];
  }

  for (let t of tokens) {
    if (isOperator(t, symbol)) {
      if (lastWasSymbol || !buffer.length) throw ExprError.invalidExpression();
      lastWasSymbol = true;
    } else if (t instanceof ExprOperator) {
      clearBuffer();
      result.push(t);
      lastWasSymbol = false;
    } else {
      // If implicit=true, we allow implicit multiplication, except where the
      // second factor is a number. For example, "3 5" is invalid.
      const noImplicit = (!implicit || t instanceof ExprNumber);
      if (buffer.length && !lastWasSymbol && noImplicit) throw ExprError.invalidExpression();
      buffer.push(t);
      lastWasSymbol = false;
    }
  }

  if (lastWasSymbol) throw ExprError.invalidExpression();
  clearBuffer();
  return result;
}

function collapseTerm(tokens) {
  // Filter out whitespace.
  tokens = tokens.filter(t => !(t instanceof ExprSpace));
  if (!tokens.length) throw ExprError.invalidExpression();

  // Match percentage and factorial operators.
  if (isOperator(tokens[0], '%!')) throw ExprError.startingOperator(tokens[0].o);
  for (let i = 0; i < tokens.length; ++i) {
    if (!isOperator(tokens[i], '%!')) continue;
    tokens.splice(i - 1, 2, new ExprFunction(tokens[i].o, [tokens[i - 1]]));
    i -= 1;
  }

  // Match comparison and division operators.
  findBinaryFunction$1(tokens, '= < > ≤ ≥');
  findBinaryFunction$1(tokens, '//', '/');

  // Match multiplication operators.
  tokens = findAssociativeFunction(tokens, '* × ·', true);

  // Match - and ± operators.
  if (isOperator(tokens[0], '- ±')) {
    tokens.splice(0, 2, new ExprFunction(tokens[0].o, [tokens[1]]));
  }
  findBinaryFunction$1(tokens, '- ±');

  // Match + operators.
  if (isOperator(tokens[0], '+')) tokens = tokens.slice(1);
  tokens = findAssociativeFunction(tokens, '+');

  if (tokens.length > 1) throw ExprError.invalidExpression();
  return tokens[0];
}

// =============================================================================


const CONSTANTS$1 = {
  π: Math.PI,
  e: Math.E
};

/**
 * Maths Expression
 */
class Expression$1 {

  /**
   * Parses a string to an expression.
   * @param {string} str
   * @returns {Expression}
   */
  static parse(str) { return matchBrackets$1(tokenize(str)) }

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
      for (let v of vars) substitution[v] = CONSTANTS$1[v] || Math.random() * 5;
      const a = expr1.evaluate(substitution);
      const b = expr2.evaluate(substitution);
      if (!nearlyEquals(a, b)) return false;
    }
    return true;
  }
}

// -----------------------------------------------------------------------------

class ExprNumber extends Expression$1 {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

class ExprIdentifier extends Expression$1 {
  constructor(i) { super(); this.i = i; }

  evaluate(vars={}) {
    if (this.i in vars) return vars[this.i];
    if (this.i in CONSTANTS$1) return CONSTANTS$1[this.i];
    throw ExprError.undefinedVariable(this.i);
  }

  substitute(vars={}) { return vars[this.i] || this; }
  get variables() { return [this.i]; }
  toString() { return this.i; }
  toMathML() { return `<mi>${this.i}</mi>`; }
}

class ExprString extends Expression$1 {
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

class ExprTerm extends Expression$1 {
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
exports.Expression = Expression$1;
