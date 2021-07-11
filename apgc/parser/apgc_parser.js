// @ts-check

import {
    APGCExpression,
    APGCExpressionStatement,
    APGCProgram,
    APGCStatement,
    APGCStatements,
    FunctionCallExpression,
    IfZeroStatement,
    WhileNonZeroStatement,
    NumberExpression,
    StringExpression
} from "../types/apgc_types.js";
import { Parser } from "../js-parsec/parsec.js";

/**
 * 識別子
 * @type {Parser<string>} 
 */
export const identifierParser = Parser.regexp(/^[a-zA-Z_][a-zA-Z_0-9]*/);

/**
 * 0文字以上の空白
 */
const whitespaceParser = Parser.regexp(/^\s*/m);

const leftParen = Parser.char('(');
const rightParen = Parser.char(')');

/**
 * @returns {Parser<APGCExpression>}
 */
 function apgcExpressionParser() {
    return numberExpressionParser.or(stringExpressionParser).or(functionCallExpressionParser());
}

/**
 * @type {Parser<NumberExpression>}
 */
export const numberExpressionParser = Parser.regexp(/^[0-9]+/).andThen(str => {
    const n = parseInt(str, 10);
    if (Number.isInteger(n)) {
        return Parser.pure(new NumberExpression(n));
    } else {
        return Parser.fail();
    }
});

/**
 * @type {Parser<string>}
 */
const stringExpressionParserInternal = new Parser(str => {
    const first = str[0];
    if (first !== `"`) {
        return undefined;
    }
    let i = 1;
    const len = str.length;
    while (i < len) {
        const char = str[i];
        if (char === undefined) { throw Error('stringExpressionParser: internal error'); }
        if (char === `"`) {
            if (str[i - 1] !== '\\') {
                return {
                    rest: str.slice(i + 1),
                    // @ts-ignore
                    value: str.slice(1, i).replaceAll("\\\"", "\"")
                };
            }
        }
        i++;
    }
    return undefined;
});

/** @type {Parser<StringExpression>} */
export const stringExpressionParser = stringExpressionParserInternal.map(x => new StringExpression(x));

/**
 * @returns {Parser<APGCProgram>}
 */
export function apgcProgramParser() {
    return apgcStatementsParser().map(s => new APGCProgram(s)).andFirst(whitespaceParser).andFirst(Parser.eof());
}

const semicolonWithWhitespace = whitespaceParser.andSecond(Parser.char(';')).andSecond(whitespaceParser);

/**
 * @returns {Parser<APGCStatements>}
 */
function apgcStatementsParser() {
    return apgcStatementParser().many().map(array => new APGCStatements(array));
}

/**
 * @returns {Parser<APGCStatement>}
 */
function apgcStatementParser() {
    return apgcExpressionStatementParser().orArray([
        ifZeroStatementParser(),
        whileNonZeroStatementParser()
    ]);
}

/**
 * @returns {Parser<APGCExpressionStatement>}
 */
function apgcExpressionStatementParser() {
    return functionCallExpressionParser().andFirst(semicolonWithWhitespace).map(expr => new APGCExpressionStatement(expr))
}

const commaAndWhitespace = whitespaceParser.andSecond(Parser.char(',')).andFirst(whitespaceParser);

/**
 * @template A
 * @param {Parser<A>} parser 
 * @param {string} openChar
 * @param {string} closeChar
 * @returns {Parser<A>}
 */
function paren(parser, openChar, closeChar) {
    // sp ( sp parser sp ) sp
    return whitespaceParser.andSecond(Parser.char(openChar)).andSecond(whitespaceParser.andSecond(parser)).andFirst(whitespaceParser.andSecond(Parser.char(closeChar))).andFirst(whitespaceParser);
}

/**
 * ;は消費しない
 * @returns {Parser<FunctionCallExpression>}
 */
export function functionCallExpressionParser() {
    return whitespaceParser.andSecond(
        identifierParser.andThen(identifier => {
            return whitespaceParser.andSecond(leftParen.andSecond(whitespaceParser).andSecond(
                apgcExpressionParser().sepBy(commaAndWhitespace).andThen(exprs => {
                    return whitespaceParser.andSecond(rightParen.map(_ => {
                        return new FunctionCallExpression(identifier, exprs);
                    }));
                })
            ));
        })
    );
}

/**
 * @template A
 * @param {string} keyword 
 * @param {(expr: APGCExpression, stmts1: APGCStatements, stmts2: APGCStatements) => A} makeStatement 
 * @returns {Parser<A>}
 */
function makeIfParser(keyword, makeStatement) {
    return whitespaceParser.andSecond(
        Parser.string(keyword).andSecond(
            paren(apgcExpressionParser(), "(", ")").andThen(expr => {
                return paren(apgcStatementsParser(), "{", "}").andThen(statements => {
                    return Parser.string('else').andSecond(
                        paren(apgcStatementsParser(), "{", "}").map(nonZeroStatements => {
                            return makeStatement(expr, statements, nonZeroStatements);
                        })
                    ).or(Parser.pure(
                        makeStatement(expr, statements, new APGCStatements([]))
                    ))
                });
            })
        )
    )
}

/**
 * if_zero (tdec_u(0)) { statemtns } else { statements }
 * if_zero (tdec_u(0)) { statemtns }
 * @returns {Parser<IfZeroStatement>}
 */
export function ifZeroStatementParser() {
    return makeIfParser('if_zero', (expr, zeroStatements, nonZeroStatements) => {
        return new IfZeroStatement(expr, zeroStatements, nonZeroStatements);
    });
}

/**
 * @template A
 * @param {string} keyword 
 * @param {(expr: APGCExpression, statemtns: APGCStatements) => A} makeWhileStatement 
 * @returns {Parser<A>}
 */
function makeWhileParser(keyword, makeWhileStatement) {
    return whitespaceParser.andSecond(
        Parser.string(keyword).andSecond(
            paren(apgcExpressionParser(), "(", ")").andThen(expr => {
                return paren(apgcStatementsParser(), "{", "}").andThen(statements => {
                    return (Parser.pure(
                        makeWhileStatement(expr, statements)
                    ))
                });
            })
        )
    )
}

/**
 * @returns {Parser<WhileNonZeroStatement>}
 */
export function whileNonZeroStatementParser() {
    return makeWhileParser('while_non_zero', (expr, stmts) => new WhileNonZeroStatement(expr, stmts));
}
