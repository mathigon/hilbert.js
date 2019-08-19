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

  static startOperator(x) {
    return new ExprError('SyntaxError', `A term cannot start with a “${x}”.`);
  }

  static endOperator(x) {
    return new ExprError('SyntaxError', `A term cannot end with a “${x}”.`);
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


/**
 * Function wrapper that modifies a function to cache its return values. This
 * is useful for performance intensive functions which are called repeatedly
 * with the same arguments. However it can reduce performance for functions
 * which are always called with different arguments. Note that argument
 * comparison doesn't not work with Objects or nested arrays.

 * @param {Function} fn
 * @returns {Function}
 */
function cache(fn) {
  let cached = new Map();
  return function(...args) {
    let argString = args.join('--');
    if (!cached.has(argString)) cached.set(argString, fn(...args));
    return cached.get(argString);
  };
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


/**
 * Join multiple Arrays
 * @param {...Array} arrays
 * @returns {Array}
 */
function join(...arrays) {
  return [].concat(...arrays);
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
  if (isNaN(x) || isNaN(y)) return false;
  return Math.abs(x - y) < t;
}

// ============================================================================

// =============================================================================

// ============================================================================

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



const CONSTANTS = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E
};

const BRACKETS = {'(': ')', '[': ']', '{': '}', '|': '|'};

const SPECIAL_OPERATORS = {
  '*': '·',
  '**': '∗',
  '//': '//',
  '+-': '±',
  '–': '−',
  '-': '−',
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
  '\'': '’',

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
  oo: '∞',

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

const SIMPLE_SYMBOLS = '|()[]{}÷,!<>=*/+-–−~^_…°•∥⊥\'∠:%∼△';
const COMPLEX_SYMBOLS = Object.values(SPECIAL_OPERATORS);
const OPERATOR_SYMBOLS = [...SIMPLE_SYMBOLS, ...COMPLEX_SYMBOLS];

const ESCAPES = {
  '<': '&lt;',
  '>': '&gt;'
};

function escape(char) {
  return (char in ESCAPES) ? ESCAPES[char] : char;
}

const SPECIAL = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin',
    'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth', 'exp',
    'log', 'ln', 'det', 'dim', 'mod', 'gcd', 'lcm', 'min', 'max']);

function isSpecialFunction(fn) {
  return SPECIAL.has(fn);
}

// =============================================================================



/**
 * Maths Expression
 */
class ExprElement {

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

class ExprNumber extends ExprElement {
  constructor(n) { super(); this.n = n; }
  evaluate() { return this.n; }
  toString() { return '' + this.n; }
  toMathML() { return `<mn>${this.n}</mn>`; }
}

class ExprIdentifier extends ExprElement {
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

class ExprString extends ExprElement {
  constructor(s) { super(); this.s = s; }
  evaluate() { throw ExprError.undefinedVariable(this.s); }
  toString() { return '"' + this.s + '"'; }
  toMathML() { return `<mtext>${this.s}</mtext>`; }
}

class ExprSpace extends ExprElement {
  toString() { return ' '; }
  toMathML() { return `<mspace/>`; }
}

class ExprOperator extends ExprElement {
  constructor(o) { super(); this.o = o; }
  toString() { return this.o.replace('//', '/'); }
  get functions() { return [this.o]; }

  toMathML() {
    const op = escape(this.toString());
    return `<mo value="${op}">${op}</mo>`;
  }
}

class ExprTerm extends ExprElement {
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

// =============================================================================


const PRECEDENCE = words('+ − * × · / ÷ // sup sub');
const COMMA = '<mo value="," lspace="0">,</mo>';

function needsBrackets(expr, parentFn) {
  if (!PRECEDENCE.includes(parentFn)) return false;
  if (expr instanceof ExprTerm) return true;
  if (!(expr instanceof ExprFunction)) return false;
  if (!PRECEDENCE.includes(expr.fn)) return false;
  return PRECEDENCE.indexOf(parentFn) > PRECEDENCE.indexOf(expr.fn);
}

function addMFence(expr, fn, string) {
  return needsBrackets(expr, fn) ? `<mfenced>${string}</mfenced>` : string;
}

function addMRow(expr, string) {
  const needsRow = (expr instanceof ExprTerm) || (expr instanceof ExprFunction);
  return needsRow ? `<mrow>${string}</mrow>` : string;
}


class ExprFunction extends ExprElement {

  constructor(fn, args=[]) {
    super();
    this.fn = fn;
    this.args = args;
  }

  evaluate(vars={}) {
    const args = this.args.map(a => a.evaluate(vars));
    if (this.fn in vars) return vars[this.fn](...args);

    switch(this.fn) {
      case '+': return args.reduce((a, b) => a + b, 0);
      case '−': return (args.length > 1) ? args[0] - args[1] : -args[0];
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

  toMathML(custom={}) {
    const args = this.args.map(a => a.toMathML(custom));
    const argsF = this.args.map((a, i) => addMFence(a, this.fn, args[i]));

    if (this.fn in custom) {
      const argsX = args.map((a, i) => ({toString: () => a, val: this.args[i]}));
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

// =============================================================================



// -----------------------------------------------------------------------------
// Tokenizer

function createToken(buffer, type) {
  if (!buffer || !type) return null;

  if (type === 'SPACE' && buffer.length > 1) return new ExprSpace();
  if (type === 'STR') return new ExprString(buffer);

  if (type === 'NUM') {
    // This can happen if users simply type ".", which get parsed as number.
    if (isNaN(+buffer)) throw ExprError.invalidExpression();
    return new ExprNumber(+buffer);
  }

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
  if (items.length > 1) return new ExprTerm(items);
  if (items[0] instanceof ExprOperator) return new ExprTerm(items);
  return items[0];
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
  if (isOperator(tokens[0], fn)) throw ExprError.startOperator(tokens[0]);
  if (isOperator(last(tokens), fn)) throw ExprError.endOperator(last(tokens));

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
  findBinaryFunction(tokens, '_', 'sub');
  findBinaryFunction(tokens, '/');
  return makeTerm(tokens);
}

function matchBrackets(tokens) {
  const stack = [[]];

  for (let t of tokens) {
    const lastOpen = last(stack).length ? last(stack)[0].o : null;

    if (isOperator(t, ') ] }') || (isOperator(t, '|') && lastOpen === '|')) {

      if (!isOperator(t, BRACKETS[lastOpen]))
        throw ExprError.conflictingBrackets(t.o);

      const closed = stack.pop();
      const term = last(stack);

      // Check if this is a normal bracket, or a function call.
      // Terms like x(y) are treated as functions, rather than implicit
      // multiplication, except for π(y).
      const isFn = (isOperator(t, ')') && last(term) instanceof ExprIdentifier && last(term).i !== 'π');
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
    if (lastWasSymbol) throw ExprError.invalidExpression();
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

  clearBuffer();
  return result;
}

function collapseTerm(tokens) {
  // Filter out whitespace.
  tokens = tokens.filter(t => !(t instanceof ExprSpace));
  if (!tokens.length) throw ExprError.invalidExpression();

  // Match percentage and factorial operators.
  if (isOperator(tokens[0], '%!')) throw ExprError.startOperator(tokens[0].o);
  for (let i = 0; i < tokens.length; ++i) {
    if (!isOperator(tokens[i], '%!')) continue;
    tokens.splice(i - 1, 2, new ExprFunction(tokens[i].o, [tokens[i - 1]]));
    i -= 1;
  }

  // Match comparison and division operators.
  findBinaryFunction(tokens, '= < > ≤ ≥');
  findBinaryFunction(tokens, '// ÷', '/');

  // Match multiplication operators.
  tokens = findAssociativeFunction(tokens, '× * ·', true);

  // Match - and ± operators.
  if (isOperator(tokens[0], '− ±')) {
    tokens.splice(0, 2, new ExprFunction(tokens[0].o, [tokens[1]]));
  }
  findBinaryFunction(tokens, '− ±');

  // Match + operators.
  if (isOperator(tokens[0], '+')) tokens = tokens.slice(1);
  tokens = findAssociativeFunction(tokens, '+');

  if (tokens.length > 1) throw ExprError.invalidExpression();
  return tokens[0];
}

// =============================================================================



/**
 * Parses a string to an expression.
 * @param {string} str
 * @param {boolean} collapse
 * @returns {Expression}
 */
function parse(str, collapse = false) {
  const expr =  matchBrackets(tokenize(str));
  return collapse ? expr.collapse() : expr;
}

/**
 * Checks numerically if two expressions are equal. Obviously this is not a
 * very robust solution, but much easier than the full CAS simplification.
 * @param {Expression} expr1
 * @param {Expression} expr2
 * @returns {boolean}
 */
function numEquals(expr1, expr2) {
  try {
    const vars = unique([...expr1.variables, ...expr2.variables]);
    const fn1 = expr1.collapse();
    const fn2 = expr2.collapse();

    // We only test positive random numbers, because negative numbers raised
    // to non-integer powers return NaN.
    for (let i = 0; i < 5; ++i) {
      const substitution = {};
      for (let v of vars) substitution[v] = CONSTANTS[v] || Math.random() * 5;
      const a = fn1.evaluate(substitution);
      const b = fn2.evaluate(substitution);
      if (isNaN(a) || isNaN(b)) continue;  // This might happen in square roots.
      if (!nearlyEquals(a, b)) return false;
    }
    return true;
  } catch(e) {
    return false;
  }
}

const Expression = {
  numEquals,
  parse: cache(parse)
};

// =============================================================================

exports.ExprError = ExprError;
exports.Expression = Expression;
