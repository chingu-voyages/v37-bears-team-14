import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import { newDefaultEnv } from "./builtins";
import { NumberValue } from "./value";

test("boolean literal true", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print true)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("true");
  console.log = ogLog;
});

test("boolean literal false", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print false)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("false");
  console.log = ogLog;
});

test("nil literal", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print nil)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("nil");
  console.log = ogLog;
});

test("parses literal", () => {
  const input = "1.0";
  const expected = 1.0;
  const result = Interpreter.with(new Environment()).interpretStatement(input);
  expect(result).toBeInstanceOf(NumberValue);
  expect((result as NumberValue).getValue()).toBe(expected);
});

test("parses +", () => {
  const input = "(+ 4.0 2.0)";
  const expected = 6;
  const result = Interpreter.with(newDefaultEnv()).interpretStatement(input);
  expect(result).toBeInstanceOf(NumberValue);
  expect((result as NumberValue).getValue()).toBe(expected);
});

test("parses nested calls", () => {
  const input = "(+ 4.0 (+ 1.0 2.0))";
  const expected = 7;
  const result = Interpreter.with(newDefaultEnv()).interpretStatement(input);
  expect(result).toBeInstanceOf(NumberValue);
  expect((result as NumberValue).getValue()).toBe(expected);
});

test("should throw", () => {
  const input = `)`;
  const run = () => Interpreter.with(newDefaultEnv()).interpretStatement(input);
  expect(run).toThrow();
});

test("undefined var", () => {
  const input = `(print a)`;
  const run = () => Interpreter.with(newDefaultEnv()).interpret(input);
  expect(run).toThrow();
});

test("def! defines", () => {
  const ogLog = console.log;
  const script = `(def! a 2.1)\n(print a)`;
  console.log = jest.fn();
  Interpreter.with(newDefaultEnv()).interpret(script);
  expect(console.log).toBeCalledWith("2.1");
  console.log = ogLog;
});

test("def! defines two", () => {
  const ogLog = console.log;
  const script = `(def! a 2.1)
  (def! b 3.5)
  (print (+ a b))`;
  console.log = jest.fn();
  Interpreter.with(newDefaultEnv()).interpret(script);
  expect(console.log).toBeCalledWith("5.6");
  console.log = ogLog;
});

test("let* declarations", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(def! a 2.0)
  (let* (a 1.0) (print a))
  (print a)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  expect(console.log).toBeCalledWith("2");
  console.log = ogLog;
});

test("let* declarations", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `
  (let* (a 1.0) (b 2.0)
        (do* (print a)
             (print b)))`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  expect(console.log).toBeCalledWith("2");
  console.log = ogLog;
});

test("fn* lambdas", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(def! a (fn* (a) (print a)))
  (a 1.0)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  console.log = ogLog;
});

test("fn* lambdas", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print ( (fn* (a) a) 1.0 ))`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  console.log = ogLog;
});

test("cond* if/else", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print (cond* (false) 1.0 2.0))`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("2");
  console.log = ogLog;
});

test("cond* complex", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(def! result (cond* (false) 1.0 (false) (print 2.0) (true) 3.0 (print 'foo')) )
  (print result)`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("3");
  console.log = ogLog;
});

test("cond* nil else", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print (cond* (false) 1.0))`;
  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("nil");
  console.log = ogLog;
});

test("cond* empty", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(print (cond*))`;
  const run = () => Interpreter.with(newDefaultEnv()).interpret(script);

  expect(run).toThrow();
  console.log = ogLog;
});

test("do* all", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(do* 
    (print 1)
    (print 2)
    (print 3))`;

  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  expect(console.log).toBeCalledWith("2");
  expect(console.log).toBeCalledWith("3");
  console.log = ogLog;
});

test("comment", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `(do*
;; random comment here...
  (def! a (fn* (n) (+ 1 n)))
  (print (a 2)) ;; another comment here...

  )`;

  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("3");
  console.log = ogLog;
});

test("recursive", () => {
  const ogLog = console.log;
  console.log = jest.fn();

  const script = `
  (def! print-depth
        (fn* (depth) (do*
                       (cond* (> depth 4)
                              depth
                              (do* (print depth) (print-depth (+ depth 1)))))))
  (print-depth 1)
  `;

  Interpreter.with(newDefaultEnv()).interpret(script);

  expect(console.log).toBeCalledWith("1");
  expect(console.log).toBeCalledWith("2");
  expect(console.log).toBeCalledWith("3");
  expect(console.log).toBeCalledWith("4");
  console.log = ogLog;
});
