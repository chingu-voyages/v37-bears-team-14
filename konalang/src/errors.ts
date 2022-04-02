export class RuntimeError extends Error {
  constructor(...params: any[]) {
    super(...params);
    Object.setPrototypeOf(this, RuntimeError.prototype);
  }
}
