import { UserRecord } from "../controllers/UserController";

// Reference: https://github.com/DefinitelyTyped/DefinitelyTyped/commit/91c229dbdb653dbf0da91992f525905893cbeb91
declare global {
  namespace Express {
    interface User extends UserRecord {}
  }
}
