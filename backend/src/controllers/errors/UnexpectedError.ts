import ApplicationError from "./ApplicationError";

export default class UnexpectedError extends ApplicationError {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnexpectedError.prototype);
  }
}
