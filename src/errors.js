// =============================================================================
// Hilbert.js | Expression Errors
// (c) Mathigon
// =============================================================================



/**
 * Expression Error Class
 */
export class ExprError extends Error {

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
