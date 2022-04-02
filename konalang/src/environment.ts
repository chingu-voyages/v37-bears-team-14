import { RuntimeError } from "./errors";
import { Value } from "./value";

export class Environment {
  private values: Map<string, Value> = new Map<string, Value>();

  constructor(private enclosing?: Environment) {}

  define(name: string, value: Value) {
    this.values.set(name, value);
  }

  get(name: string): Value {
    if (this.values.get(name) !== undefined) {
      return this.values.get(name)!;
    }
    if (this.enclosing) {
      return this.enclosing.get(name);
    }
    throw new RuntimeError(`Undefined variable: ${name}`);
  }

  getEnclosing(): Environment {
    if (!this.enclosing) {
      throw new RuntimeError(`Attempted to get enclosing environment at root!`);
    }
    return this.enclosing;
  }
}
