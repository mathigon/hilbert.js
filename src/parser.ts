// =============================================================================
// Hilbert.js | Expression Parser
// (c) Mathigon
// =============================================================================


import {last, words} from '@mathigon/core';
import {SPECIAL_OPERATORS, SPECIAL_IDENTIFIERS, IDENTIFIER_SYMBOLS, OPERATOR_SYMBOLS, BRACKETS, FUNCTION_NAMES} from './symbols';
import {ExprNumber, ExprIdentifier, ExprOperator, ExprSpace, ExprString, ExprElement} from './elements';
import {ExprFunction, ExprTerm} from './functions';
import {ExprError} from './errors';


// -----------------------------------------------------------------------------
// Tokenizer

enum TokenType {UNKNOWN, SPACE, STR, NUM, VAR, OP}


function createToken(buffer: string, type: TokenType) {
  if (type === TokenType.STR) return new ExprString(buffer);

  // Strings can be empty, but other types cannot.
  if (!buffer || !type) return undefined;

  if (type === TokenType.SPACE && buffer.length > 1) return new ExprSpace();

  if (type === TokenType.NUM) {
    // This can happen if users simply type ".", which get parsed as number.
    if (isNaN(+buffer)) throw ExprError.invalidExpression();
    return new ExprNumber(+buffer);
  }

  if (type === TokenType.VAR) {
    if (buffer in SPECIAL_IDENTIFIERS) {
      return new ExprIdentifier(SPECIAL_IDENTIFIERS[buffer]);
    } else if (buffer in SPECIAL_OPERATORS) {
      return new ExprOperator(SPECIAL_OPERATORS[buffer]);
    } else {
      return new ExprIdentifier(buffer);
    }
  }

  if (type === TokenType.OP) {
    if (buffer in SPECIAL_OPERATORS) {
      return new ExprOperator(SPECIAL_OPERATORS[buffer]);
    } else {
      return new ExprOperator(buffer);
    }
  }
}

export function tokenize(str: string) {
  const tokens = [];
  let buffer = '';
  let type = TokenType.UNKNOWN;

  for (const s of str) {

    // Handle Strings
    if (s === '"') {
      const newType: TokenType = (((type as TokenType) === TokenType.STR) ?
                                  TokenType.UNKNOWN : TokenType.STR);
      const token = createToken(buffer, type);
      if (token) tokens.push(token);
      buffer = '';
      type = newType;
      continue;
    } else if ((type as TokenType) === TokenType.STR) {
      buffer += s;
      continue;
    }

    const sType = s.match(/[0-9.]/) ? TokenType.NUM :
                  IDENTIFIER_SYMBOLS.includes(s) ? TokenType.VAR :
                  OPERATOR_SYMBOLS.includes(s) ? TokenType.OP :
                  s.match(/\s/) ? TokenType.SPACE : TokenType.UNKNOWN;
    if (!sType) throw ExprError.invalidCharacter(s);

    if (!type || (type === TokenType.NUM && sType !== TokenType.NUM) ||
        (type === TokenType.VAR && sType !== TokenType.VAR && sType !==
         TokenType.NUM) ||
        (type === TokenType.OP && !((buffer + s) in SPECIAL_OPERATORS)) ||
        (type === TokenType.SPACE && sType !== TokenType.SPACE)) {
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

function makeTerm(items: ExprElement[]) {
  if (items.length > 1) return new ExprTerm(items);
  if (items[0] instanceof ExprOperator) return new ExprTerm(items);
  return items[0];
}

function splitArray(items: ExprElement[], check: (x: ExprElement) => boolean) {
  const result: ExprElement[][] = [[]];
  for (const i of items) {
    if (check(i)) {
      result.push([]);
    } else {
      last(result).push(i);
    }
  }
  return result;
}

function isOperator(expr: ExprElement, fns: string): expr is ExprOperator {
  return expr instanceof ExprOperator && words(fns).includes(expr.o);
}

function removeBrackets(expr: ExprElement) {
  return (expr instanceof ExprFunction && expr.fn === '(') ? expr.args[0] :
         expr;
}

function findBinaryFunction(tokens: ExprElement[], fn: string) {
  if (isOperator(tokens[0], fn)) throw ExprError.startOperator(tokens[0]);
  if (isOperator(last(tokens), fn)) throw ExprError.endOperator(last(tokens));

  for (let i = 1; i < tokens.length - 1; ++i) {
    if (!isOperator(tokens[i], fn)) continue;
    const token = tokens[i] as ExprOperator;

    const a = tokens[i - 1];
    const b = tokens[i + 1];

    if (a instanceof ExprOperator) {
      throw ExprError.consecutiveOperators(a.o, token.o);
    }
    if (b instanceof ExprOperator) {
      throw ExprError.consecutiveOperators(token.o, b.o);
    }

    const token2 = tokens[i + 2];
    if (fn === '^ _' && isOperator(token, '_ ^') && isOperator(token2, '_ ^') && token.o !== token2.o) {
      // Special handling for subsup operator.
      const c = tokens[i + 3];
      if (c instanceof ExprOperator) throw ExprError.consecutiveOperators(token2.o, c.o);
      const args = [removeBrackets(a), removeBrackets(b), removeBrackets(c)];
      if (token.o === '^') [args[1], args[2]] = [args[2], args[1]];
      tokens.splice(i - 1, 5, new ExprFunction('subsup', args));
      i -= 4;

    } else {
      const fn = FUNCTION_NAMES[token.o] || token.o;
      const args = [removeBrackets(a), removeBrackets(b)];
      tokens.splice(i - 1, 3, new ExprFunction(fn, args));
      i -= 2;
    }
  }
}


// -----------------------------------------------------------------------------
// Match Brackets

function prepareTerm(tokens: ExprElement[]) {
  findBinaryFunction(tokens, '^ _');
  findBinaryFunction(tokens, '/');
  return makeTerm(tokens);
}

export function matchBrackets(tokens: ExprElement[]) {
  const stack: ExprElement[][] = [[]];

  for (const t of tokens) {
    const lastOpen = last(stack).length ? (last(stack)[0] as ExprOperator).o : undefined;

    if (isOperator(t, ') ] }') || (isOperator(t, '|') && lastOpen === '|')) {

      if (!isOperator(t, BRACKETS[lastOpen!])) {
        throw ExprError.conflictingBrackets((t as ExprOperator).o);
      }

      const closed = stack.pop();
      const term = last(stack);

      // Check if this is a normal bracket, or a function call.
      // Terms like x(y) are treated as functions, rather than implicit
      // multiplication, except for π(y).
      const isFn = (isOperator(t, ')') && last(term) instanceof
                    ExprIdentifier && (last(term) as ExprIdentifier).i !== 'π');
      const fnName = isFn ? (term.pop() as ExprIdentifier).i :
                     isOperator(t, '|') ? 'abs' :
                     (closed![0] as ExprOperator).o;

      // Support multiple arguments for function calls.
      const args = splitArray(closed!.slice(1), a => isOperator(a, ','));
      term.push(new ExprFunction(fnName, args.map(prepareTerm)));

    } else if (isOperator(t, '( [ { |')) {
      stack.push([t]);

    } else {
      last(stack).push(t);
    }
  }

  if (stack.length > 1) {
    throw ExprError.unclosedBracket((last(stack)[0] as ExprOperator).o);
  }
  return prepareTerm(stack[0]);
}


// -----------------------------------------------------------------------------
// Collapse term items

function findAssociativeFunction(tokens: ExprElement[], symbol: string,
    implicit = false) {
  const result: ExprElement[] = [];
  let buffer: ExprElement[] = [];
  let lastWasSymbol = false;

  function clearBuffer() {
    if (lastWasSymbol) throw ExprError.invalidExpression();
    if (!buffer.length) return;
    result.push(
        buffer.length > 1 ? new ExprFunction(symbol[0], buffer) : buffer[0]);
    buffer = [];
  }

  for (const t of tokens) {
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
      if (buffer.length && !lastWasSymbol &&
          noImplicit) throw ExprError.invalidExpression();
      buffer.push(t);
      lastWasSymbol = false;
    }
  }

  clearBuffer();
  return result;
}

export function collapseTerm(tokens: ExprElement[]) {
  // Filter out whitespace.
  tokens = tokens.filter(t => !(t instanceof ExprSpace));
  if (!tokens.length) throw ExprError.invalidExpression();

  // Match percentage and factorial operators.
  if (isOperator(tokens[0], '%!')) throw ExprError.startOperator(tokens[0]);
  for (let i = 0; i < tokens.length; ++i) {
    if (!isOperator(tokens[i], '%!')) continue;
    tokens.splice(i - 1, 2, new ExprFunction((tokens[i] as ExprOperator).o,
        [tokens[i - 1]]));
    i -= 1;
  }

  // Match comparison and division operators.
  findBinaryFunction(tokens, '= < > ≤ ≥');
  findBinaryFunction(tokens, '// ÷');

  // Match multiplication operators.
  tokens = findAssociativeFunction(tokens, '× * ·', true);

  // Match - and ± operators.
  if (isOperator(tokens[0], '− ±')) {
    tokens.splice(0, 2,
        new ExprFunction((tokens[0] as ExprOperator).o, [tokens[1]]));
  }
  findBinaryFunction(tokens, '− ±');

  // Match + operators.
  if (isOperator(tokens[0], '+')) tokens = tokens.slice(1);
  tokens = findAssociativeFunction(tokens, '+');

  if (tokens.length > 1) throw ExprError.invalidExpression();
  return tokens[0];
}
