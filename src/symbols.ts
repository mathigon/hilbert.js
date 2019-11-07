// =============================================================================
// Hilbert.js | Symbols
// (c) Mathigon
// =============================================================================


export type NumberMap = { [key: string]: number };
export type StringMap = { [key: string]: string };


export const CONSTANTS: NumberMap = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E
};

export const BRACKETS: StringMap = {
  '(': ')',
  '[': ']',
  '{': '}',
  '|': '|'
};

export const SPECIAL_OPERATORS: StringMap = {
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

export const SPECIAL_IDENTIFIERS: StringMap = {
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
export const IDENTIFIER_SYMBOLS = [...LOWERCASE, ...UPPERCASE, ...GREEK, '$'];

const SIMPLE_SYMBOLS = '|()[]{}÷,!<>=*/+-–−~^_…°•∥⊥\'∠:%∼△';
const COMPLEX_SYMBOLS = Object.values(SPECIAL_OPERATORS);
export const OPERATOR_SYMBOLS = [...SIMPLE_SYMBOLS, ...COMPLEX_SYMBOLS];

const ESCAPES: StringMap = {
  '<': '&lt;',
  '>': '&gt;'
};

export function escape(char: string) {
  return (char in ESCAPES) ? ESCAPES[char] : char;
}

const SPECIAL = new Set<string>(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin',
  'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth', 'exp',
  'log', 'ln', 'det', 'dim', 'mod', 'gcd', 'lcm', 'min', 'max']);

export function isSpecialFunction(fn: string) {
  return SPECIAL.has(fn);
}
