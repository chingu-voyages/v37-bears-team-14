export default class ApplicationError extends Error {
  constructor(...params: any[]) {
    super(...params);
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
