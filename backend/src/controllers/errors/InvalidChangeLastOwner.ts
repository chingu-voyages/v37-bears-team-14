import ApplicationError from "./ApplicationError";

export default class InvalidChangeLastOwner extends ApplicationError {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidChangeLastOwner.prototype);
  }
}
