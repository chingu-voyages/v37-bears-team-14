import ApplicationError from "./ApplicationError";

export default class PendingApplicationExistsError extends ApplicationError {
  constructor() {
    super();
    Object.setPrototypeOf(this, PendingApplicationExistsError.prototype);
  }
}
