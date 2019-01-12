// =============================================================================
// Hilbert.js | Expression Parser
// (c) Mathigon
// =============================================================================



import { last } from '@mathigon/core'
import { SPECIAL_OPERATORS, SPECIAL_IDENTIFIERS, IDENTIFIER_SYMBOLS, OPERATOR_SYMBOLS } from './symbols'
import { ExprError, ExprNumber, ExprIdentifier, ExprOperator, ExprSpace, ExprString, ExprTerm } from "./expression";
import { ExprFunction } from "./functions";

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

export function tokenize(str) {
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

export function matchBrackets(tokens) {
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

export function collapseTerm() {
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
