import ApplicationError from "./ApplicationError";

export default class FieldExistsError extends ApplicationError {
  constructor(public field: string) {
    super(`${field} value already exists`);
    Object.setPrototypeOf(this, FieldExistsError.prototype);
  }
}
