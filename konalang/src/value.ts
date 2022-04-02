export interface Value {
  textValue(): string;
  is(other: any): boolean;
}

export type Callable = (...args: Value[]) => Value;

export abstract class BaseValue implements Value {
  is(t: any): boolean {
    return this instanceof t;
  }

  abstract textValue(): string;
}

export class StringValue extends BaseValue implements Value {
  constructor(private text: string) {
    super();
  }

  textValue(): string {
    return this.text;
  }
}

export class NumberValue extends BaseValue implements Value {
  constructor(private value: number) {
    super();
  }

  textValue(): string {
    return `${this.value}`;
  }

  getValue(): number {
    return this.value;
  }
}

export class BooleanValue extends BaseValue implements Value {
  constructor(private value: boolean) {
    super();
  }

  textValue(): string {
    return `${this.value}`;
  }

  getValue(): boolean {
    return this.value;
  }

  isTrue(): boolean {
    return this.value;
  }
}

export class NilValue extends BaseValue implements Value {
  textValue(): string {
    return "nil";
  }
}

export class CallableValue extends BaseValue implements Value {
  constructor(private name: string | null, private callable: Callable) {
    super();
  }

  textValue(): string {
    return `<fn ${this.getName()}>`;
  }

  getName(): string {
    return this.name || "<lambda>";
  }

  apply(...args: Value[]): Value {
    return this.callable(...args);
  }
}

export class ListValue extends BaseValue implements Value {
  constructor(private list: Value[]) {
    super();
  }

  textValue(): string {
    return "[" + this.list.map((el) => el.textValue()).join(", ") + "]";
  }

  getList(): Value[] {
    return this.list;
  }
}

export type HashKey = number | string;

export class HashValue extends BaseValue implements Value {
  constructor(private map: Map<HashKey, Value>) {
    super();
  }

  textValue(): string {
    let els = [];
    for (
      let entries = this.map.entries(), { value: entry, done } = entries.next();
      !done;
      { value: entry, done } = entries.next()
    ) {
      const [key, value] = entry;
      els.push(`${key} => ${value.textValue()}`);
    }
    return `{${els.join(", ")}}`;
  }

  getMap = () => this.map;
}
