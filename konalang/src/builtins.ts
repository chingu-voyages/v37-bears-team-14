import {
  CallableValue,
  NumberValue,
  NilValue,
  Value,
  BooleanValue,
  StringValue,
  ListValue,
  HashValue,
} from "./value";
import { RuntimeError } from "./errors";
import { Environment } from "./environment";

export const add = (...args: Value[]): Value => {
  const sum = args.reduce((sum: number, arg: Value) => {
    if (!arg.is(NumberValue)) {
      throw new RuntimeError("Invalid argument to add: " + arg.textValue());
    }
    return sum + (arg as NumberValue).getValue();
  }, 0);
  return new NumberValue(sum);
};

export const sub = (...args: Value[]): Value => {
  if (args.length < 1) {
    throw new RuntimeError("Missing arguments for sub");
  }

  if (!args[0].is(NumberValue)) {
    throw new RuntimeError("Invalid argument to sub: " + args[0].textValue());
  }

  const diff = args.slice(1).reduce((diff: number, arg: Value) => {
    if (!arg.is(NumberValue)) {
      throw new RuntimeError("Invalid argument to sub: " + arg.textValue());
    }
    return diff - (arg as NumberValue).getValue();
  }, (args[0] as NumberValue).getValue());
  return new NumberValue(diff);
};

export const mul = (...args: Value[]): Value => {
  if (args.length < 1) {
    throw new RuntimeError("Missing arguments for mul");
  }

  if (!args[0].is(NumberValue)) {
    throw new RuntimeError("Invalid argument to mul: " + args[0].textValue());
  }

  const prod = args.slice(1).reduce((prod: number, arg: Value) => {
    if (!arg.is(NumberValue)) {
      throw new RuntimeError("Invalid argument to mul: " + arg.textValue());
    }
    return prod * (arg as NumberValue).getValue();
  }, (args[0] as NumberValue).getValue());
  return new NumberValue(prod);
};

export const div = (...args: Value[]): Value => {
  if (args.length < 1) {
    throw new RuntimeError("Missing arguments for div");
  }

  if (!args[0].is(NumberValue)) {
    throw new RuntimeError("Invalid argument to div: " + args[0].textValue());
  }

  const quot = args.slice(1).reduce((quot: number, arg: Value) => {
    if (!arg.is(NumberValue)) {
      throw new RuntimeError("Invalid argument to div: " + arg.textValue());
    }
    return quot / (arg as NumberValue).getValue();
  }, (args[0] as NumberValue).getValue());
  return new NumberValue(quot);
};

export const print = (...args: Value[]): Value => {
  console.log(args.map((v) => v.textValue()).join(" "));
  return new NilValue();
};

export const gt = (...args: Value[]): Value => {
  const [a, b] = args;
  if (a.is(NumberValue) && b.is(NumberValue)) {
    const bool = (a as NumberValue).getValue() > (b as NumberValue).getValue();
    return new BooleanValue(bool);
  }
  if (a.is(StringValue) && b.is(StringValue)) {
    const bool =
      (a as StringValue).textValue() > (b as StringValue).textValue();
    return new BooleanValue(bool);
  }
  throw new RuntimeError("Invalid data types compared");
};

export const lt = (...args: Value[]): Value => {
  const [a, b] = args;
  if (a.is(NumberValue) && b.is(NumberValue)) {
    const bool = (a as NumberValue).getValue() < (b as NumberValue).getValue();
    return new BooleanValue(bool);
  }
  if (a.is(StringValue) && b.is(StringValue)) {
    const bool =
      (a as StringValue).textValue() < (b as StringValue).textValue();
    return new BooleanValue(bool);
  }
  throw new RuntimeError("Invalid data types compared");
};

export const list = (...args: Value[]): Value => {
  return new ListValue(args);
};

export const makeHash = (...args: Value[]): Value => {
  return new HashValue(new Map());
};

export const getHash = (...args: Value[]): Value => {
  const [map, key] = args;
  if (!map || !key) {
    throw new RuntimeError("Missing args to gethash");
  }
  if (!map.is(HashValue)) {
    throw new RuntimeError("Not a map value: " + map);
  }
  if (key.is(StringValue)) {
    return (map as HashValue).getMap().get(key.textValue()) || new NilValue();
  }
  if (key.is(NumberValue)) {
    const keyN = (key as NumberValue).getValue();
    return (map as HashValue).getMap().get(keyN) || new NilValue();
  }
  throw new RuntimeError("Key is wrong datatype: " + key.constructor.name);
};

export const setHash = (...args: Value[]): Value => {
  const [map, key, value] = args;
  if (!map || !key || !value) {
    throw new RuntimeError("Missing args to sethash");
  }
  if (key.is(StringValue)) {
    (map as HashValue).getMap().set(key.textValue(), value);
    return map;
  }
  if (key.is(NumberValue)) {
    const keyN = (key as NumberValue).getValue();
    (map as HashValue).getMap().set(keyN, value);
    return map;
  }
  throw new RuntimeError("Key is wrong datatype: " + key.constructor.name);
};

export const newDefaultEnv = (): Environment => {
  const env = new Environment();
  const defaults = [
    new CallableValue("+", add),
    new CallableValue("-", sub),
    new CallableValue("*", mul),
    new CallableValue("/", div),
    new CallableValue("print", print),
    new CallableValue(">", gt),
    new CallableValue("<", lt),
    new CallableValue("list", list),
    new CallableValue("makehash", makeHash),
    new CallableValue("gethash", getHash),
    new CallableValue("sethash", setHash),
  ];
  defaults.forEach((v) => {
    env.define(v.getName(), v);
  });
  return env;
};
