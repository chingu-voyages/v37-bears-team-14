import ApplicationError from "./ApplicationError";

export default class NotFoundError extends ApplicationError {
  constructor(public resource: string, public id: string) {
    super(`${id} not found for resource ${resource}`);
  }
}
