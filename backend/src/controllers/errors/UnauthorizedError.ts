import ApplicationError from "./ApplicationError";

export default class UnauthorizedError extends ApplicationError {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
