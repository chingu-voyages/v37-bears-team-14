import ApplicationError from "./ApplicationError";

export default class MemberAlreadyExistsError extends ApplicationError {
  constructor() {
    super();
    Object.setPrototypeOf(this, MemberAlreadyExistsError.prototype);
  }
}
