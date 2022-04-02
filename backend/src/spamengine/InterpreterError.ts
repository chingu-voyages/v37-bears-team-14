export default class InterpreterError extends Error {
  constructor(err: Error) {
    super(err.message);
    Object.setPrototypeOf(this, InterpreterError.prototype);
  }
}
