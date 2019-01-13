// =============================================================================
// Hilbert.js | Expression Parser
// (c) Mathigon
// =============================================================================



import { last, words } from '@mathigon/core'
import { SPECIAL_OPERATORS, SPECIAL_IDENTIFIERS, IDENTIFIER_SYMBOLS, OPERATOR_SYMBOLS, BRACKETS } from './symbols'
import { ExprNumber, ExprIdentifier, ExprOperator, ExprSpace, ExprString, ExprTerm } from "./expression";
import { ExprFunction } from "./functions";
import { ExprError } from "./errors";



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
    if (check[i]) {
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

export function matchBrackets(tokens) {
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

export function collapseTerm(tokens) {
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
