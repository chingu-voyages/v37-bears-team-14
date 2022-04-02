import {
  CallableValue,
  Interpreter,
  newDefaultEnv,
  NilValue,
  Value,
} from "konalang";
import InterpreterError from "./InterpreterError";

export const run = (script: string): string[] => {
  const env = newDefaultEnv();
  let output: string[] = [];

  env.define(
    "print",
    new CallableValue("print", (...args: Value[]): Value => {
      output.push(args.map((v) => v.textValue()).join(" "));
      return new NilValue();
    })
  );

  try {
    Interpreter.with(env).interpret(script);
  } catch (err: any) {
    throw new InterpreterError(err);
  }
  return output;
};
