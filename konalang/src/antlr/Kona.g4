grammar Kona;

program : groupingExpr*;

singleStatement
  : groupingExpr
  ;

groupingExpr
  : valueExpr
  | condExpr
  | doExpr
  | getExpr
  | defExpr
  | bindExpr
  | lambdaExpr
  | callExpr
  | parenExpr
  ;

parenExpr
  : OPEN_PAREN groupingExpr CLOSE_PAREN
  ;

defExpr
  : OPEN_PAREN DEF IDENTIFIER groupingExpr CLOSE_PAREN
  ;

bindExpr
  : OPEN_PAREN LET bindDeclaration+ groupingExpr CLOSE_PAREN
  ;

condExpr
  : OPEN_PAREN COND groupingExpr+ CLOSE_PAREN
  ;

doExpr
  : OPEN_PAREN DO groupingExpr+ CLOSE_PAREN
  ;

bindDeclaration
  : OPEN_PAREN IDENTIFIER groupingExpr CLOSE_PAREN
  ;

lambdaExpr
  : OPEN_PAREN FN OPEN_PAREN IDENTIFIER* CLOSE_PAREN groupingExpr CLOSE_PAREN
  ;

callExpr
  : OPEN_PAREN callable groupingExpr* CLOSE_PAREN
  ;

callable
  : lambdaExpr
  | getExpr
  ;

getExpr
  : IDENTIFIER
  ;

valueExpr
  : numberLiteral
  | stringLiteral
  | booleanLiteral
  | nilLiteral
  ;

numberLiteral
  : NUMBER_LITERAL
  ;

booleanLiteral
  : TRUE
  | FALSE;

nilLiteral
  : NIL
  ;

stringLiteral : STRING_LITERAL ;

SPACE : [ \t\r\n]+ -> channel(HIDDEN) ;

COMMENT : ';;' .*? '\n' -> channel(HIDDEN) ;

NUMBER_LITERAL
  : [+-]? DIGIT+ PERIOD DIGIT+ EXP?
  | [+-]? PERIOD DIGIT+ EXP?
  | [+-]? DIGIT+
  ;

STRING_LITERAL
  : SINGLE_QUOTE (ESCAPED_SINGLE_QUOTE | NON_SINGLE_QUOTE)* SINGLE_QUOTE
  | DOUBLE_QUOTE (ESCAPED_DOUBLE_QUOTE | NON_DOUBLE_QUOTE)* DOUBLE_QUOTE
  ;

// Keywords

DEF : 'def!' ;
LET : 'let*' ;
FN : 'fn*' ;
COND : 'cond*' ;
IF : 'if*' ;
DO : 'do*' ;
TRUE : 'true' ;
FALSE : 'false' ;
NIL : 'nil' ;

// Identifiers

IDENTIFIER : IDENTIFIER_CHAR_START IDENTIFIER_CHAR* ;

IDENTIFIER_CHAR_START
  :
  ( '+' | '-'
  | '*' | '/'
  | '>' | '<'
  | [a-zA-Z_$]
  )
  ;

IDENTIFIER_CHAR
  :
  ( IDENTIFIER_CHAR_START
  | [0-9]
  )
  ;

OPEN_PAREN : '(' ;
CLOSE_PAREN : ')' ;

fragment DIGIT : [0-9] ;
fragment EXP : 'E' [+-]? [0-9]+;
fragment PERIOD : '.' ;

fragment SINGLE_QUOTE : '\'' ;
fragment ESCAPED_SINGLE_QUOTE : '\\\'' ;
fragment NON_SINGLE_QUOTE : ~'\'' ;

fragment DOUBLE_QUOTE : '"' ;
fragment ESCAPED_DOUBLE_QUOTE : '\\"' ;
fragment NON_DOUBLE_QUOTE : ~'"' ;
