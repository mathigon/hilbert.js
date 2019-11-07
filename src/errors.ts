// =============================================================================
// Hilbert.js | Expression Errors
// (c) Mathigon
// =============================================================================


import {ExprElement} from './elements';


/** Expression Error Class */
export class ExprError extends Error {

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }

  // ---------------------------------------------------------------------------
  // Eval Errors

  static undefinedVariable(x: string) {
    return new ExprError('EvalError', `Undefined variable “${x}”.`);
  }

  static undefinedFunction(x: string) {
    return new ExprError('EvalError', `Undefined function “${x}”.`);
  }


  // ---------------------------------------------------------------------------
  // Syntax Errors

  static invalidCharacter(x: string) {
    return new ExprError('SyntaxError', `Unknown symbol “${x}”.`);
  }

  static conflictingBrackets(x: string) {
    return new ExprError('SyntaxError', `Conflicting brackets “${x}”.`);
  }

  static unclosedBracket(x: string) {
    return new ExprError('SyntaxError', `Unclosed bracket “${x}”.`);
  }

  static startOperator(x: ExprElement) {
    return new ExprError('SyntaxError', `A term cannot start with a “${x}”.`);
  }

  static endOperator(x: ExprElement) {
    return new ExprError('SyntaxError', `A term cannot end with a “${x}”.`);
  }

  static consecutiveOperators(x: string, y: string) {
    return new ExprError('SyntaxError',
        `A “${x}” cannot be followed by a “${y}”.`);
  }

  static invalidExpression() {
    return new ExprError('SyntaxError', `This expression is invalid.`);
  }
}
