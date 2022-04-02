import { newDefaultEnv } from "./builtins";
import { Interpreter } from "./interpreter";

test("+", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const input = `(print (+ 1 2))
  (print (+ 1 2 3))`;
  Interpreter.with(newDefaultEnv()).interpret(input);

  expect(console.log).toHaveBeenCalledWith("3");
  expect(console.log).toHaveBeenCalledWith("6");
  console.log = ogLog;
});

test("-", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const input = `(print (- 1 2))
  (print (- 1 2 3))`;
  Interpreter.with(newDefaultEnv()).interpret(input);

  expect(console.log).toHaveBeenCalledWith("-1");
  expect(console.log).toHaveBeenCalledWith("-4");
  console.log = ogLog;
});

test("*", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const input = `(print (* 1 2))
  (print (* 1 2 3))`;
  Interpreter.with(newDefaultEnv()).interpret(input);

  expect(console.log).toHaveBeenCalledWith("2");
  expect(console.log).toHaveBeenCalledWith("6");
  console.log = ogLog;
});

test("/", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const input = `(print (/ 1 2))
  (print (/ 1 2 2))`;
  Interpreter.with(newDefaultEnv()).interpret(input);

  expect(console.log).toHaveBeenCalledWith("0.5");
  expect(console.log).toHaveBeenCalledWith("0.25");
  console.log = ogLog;
});

test("parses print statement", () => {
  const ogLog = console.log;
  console.log = jest.fn();
  const input = "(print 4.0)";
  Interpreter.with(newDefaultEnv()).interpret(input);
  expect(console.log).toHaveBeenCalledWith("4");
  console.log = ogLog;
});

test("list", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `
  (def! l (list 2 3.2 "abc"))
  (print l)
  `;

  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith('[2, 3.2, "abc"]');
  console.log = ogLog;
});

test("hash", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `
  (def! table (makehash))
  (sethash table 2 "two")
  (sethash (sethash table 3 "three") "four" 4)
  (print (gethash table 2))
  (print (gethash table "four"))
  (print (gethash table "not-exists"))
  (print table)
  `;

  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith('"two"');
  expect(console.log).toBeCalledWith("4");
  expect(console.log).toBeCalledWith("nil");
  expect(console.log).toBeCalledWith('{2 => "two", 3 => "three", "four" => 4}');
  console.log = ogLog;
});
