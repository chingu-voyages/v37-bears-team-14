import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { Environment } from "./environment";
import {
  BindExprContext,
  BooleanLiteralContext,
  CallableContext,
  CallExprContext,
  CondExprContext,
  DefExprContext,
  DoExprContext,
  GetExprContext,
  GroupingExprContext,
  KonaParser,
  LambdaExprContext,
  NilLiteralContext,
  NumberLiteralContext,
  ParenExprContext,
  ProgramContext,
  SingleStatementContext,
  StringLiteralContext,
  ValueExprContext,
} from "./generated/parser/KonaParser";
import { KonaVisitor } from "./generated/parser/KonaVisitor";
import { RuntimeError } from "./errors";
import {
  BooleanValue,
  CallableValue,
  NilValue,
  NumberValue,
  StringValue,
  Value,
} from "./value";
import { BailErrorStrategy, CharStreams, CommonTokenStream } from "antlr4ts";
import { KonaLexer } from "./generated/parser/KonaLexer";

export class Interpreter
  extends AbstractParseTreeVisitor<Value>
  implements KonaVisitor<Value>
{
  private current: Environment;

  constructor(private global: Environment) {
    super();
    this.current = global;
  }

  static with(environment: Environment): Interpreter {
    return new Interpreter(environment);
  }

  interpretStatement(statement: string): Value {
    const inputStream = CharStreams.fromString(statement);
    const lexer = new KonaLexer(inputStream);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KonaParser(tokens);

    parser.errorHandler = new BailErrorStrategy();

    return parser.singleStatement().accept(this);
  }

  interpret(statement: string): Value {
    const inputStream = CharStreams.fromString(statement);
    const lexer = new KonaLexer(inputStream);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KonaParser(tokens);

    parser.errorHandler = new BailErrorStrategy();

    return parser.program().accept(this);
  }

  protected defaultResult(): Value {
    return new NilValue();
  }

  // Statements

  visitProgram(ctx: ProgramContext) {
    this.visitChildren(ctx);
    return this.defaultResult();
  }

  visitSingleStatement(ctx: SingleStatementContext) {
    return this.visitChildren(ctx);
  }

  // Expressions

  visitParenExpr(ctx: ParenExprContext): Value {
    return ctx.groupingExpr().accept(this);
  }

  visitGroupingExpr(ctx: GroupingExprContext) {
    return this.visitChildren(ctx);
  }

  visitDefExpr(ctx: DefExprContext): Value {
    const id = ctx.IDENTIFIER().toString();
    const value = ctx.groupingExpr().accept(this);
    this.current.define(id, value);
    return value;
  }

  visitBindExpr(ctx: BindExprContext): Value {
    this.current = new Environment(this.current);
    for (const declaration of ctx.bindDeclaration()) {
      const id = declaration.IDENTIFIER().toString();
      const value = declaration.groupingExpr().accept(this);
      this.current.define(id, value);
    }
    const val = ctx.groupingExpr().accept(this);
    this.current = this.current.getEnclosing();
    return val;
  }

  visitCondExpr(ctx: CondExprContext): Value {
    const exprsLen = ctx.groupingExpr().length;

    for (let i = 0; i < exprsLen - 1; i += 2) {
      const predicate = ctx.groupingExpr(i);
      const branch = ctx.groupingExpr(i + 1);
      const result = predicate.accept(this);
      if (
        result.is(NilValue) ||
        (result.is(BooleanValue) && !(result as BooleanValue).isTrue())
      ) {
        continue;
      }
      return branch.accept(this);
    }

    if (exprsLen % 2 === 1) {
      const last = ctx.groupingExpr(exprsLen - 1);
      return last.accept(this);
    }

    return new NilValue();
  }

  visitDoExpr(ctx: DoExprContext): Value {
    let returnValue = new NilValue();
    for (const expr of ctx.groupingExpr()) {
      returnValue = expr.accept(this);
    }
    return returnValue;
  }

  visitLambdaExpr(ctx: LambdaExprContext): Value {
    const closure = new Environment(this.current);
    const lambda = (...args: Value[]) => {
      const before = this.current;
      this.current = closure;
      const ids = ctx.IDENTIFIER();
      if (args.length < ids.length) {
        throw new RuntimeError(
          `Expected ${ids.length} arguments but got ${args.length}`
        );
      }
      ids.forEach((id, i) => closure.define(id.toString(), args[i]));
      const value = ctx.groupingExpr().accept(this);
      this.current = before;
      return value;
    };
    return new CallableValue(null, lambda);
  }

  visitCallable(ctx: CallableContext): Value {
    return this.visitChildren(ctx);
  }

  visitCallExpr(ctx: CallExprContext): Value {
    const fn = ctx.callable().accept(this);
    if (!fn.is(CallableValue)) {
      throw new RuntimeError(
        `Non-callable value, instead found ${fn.constructor.name}`
      );
    }
    const args = ctx.groupingExpr().map((e) => e.accept(this));
    return (fn as CallableValue).apply(...args);
  }

  visitGetExpr(ctx: GetExprContext): Value {
    const id = ctx.IDENTIFIER().toString();
    return this.current.get(id);
  }

  visitValueExpr(ctx: ValueExprContext): Value {
    return this.visitChildren(ctx);
  }

  // Literals

  visitNumberLiteral(ctx: NumberLiteralContext): Value {
    const text = ctx.NUMBER_LITERAL().toString();
    const value = Number.parseFloat(text);
    if (isNaN(value)) {
      throw new RuntimeError(`Invalid number: ` + text);
    }
    return new NumberValue(value);
  }

  visitStringLiteral(ctx: StringLiteralContext): Value {
    const text = ctx.STRING_LITERAL().toString();
    return new StringValue(text);
  }

  visitBooleanLiteral(ctx: BooleanLiteralContext): Value {
    return new BooleanValue(!!ctx.TRUE());
  }

  visitNilLiteral(_: NilLiteralContext): Value {
    return new NilValue();
  }
}
