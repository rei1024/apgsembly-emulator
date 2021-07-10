// @ts-check

import {
    APGCExpression,
    APGCProgram,
    APGCStatement,
    APGCStatements,
    FunctionCallStatement,
    IfZeroTDECUStatement,
    NumberExpression,
    StringExpression
} from "../types/apgc_types.js";
import { Parser } from "../js-parsec/parsec.js";

/**
 * 識別子
 * @type {Parser<string>} 
 */
export const identifierParser = Parser.regexp(/^[a-zA-Z][a-zA-z0-1]*/);

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
    return numberExpressionParser.or(stringExpressionParser);
}

/**
 * @type {Parser<NumberExpression>}
 */
export const numberExpressionParser = Parser.regexp(/^[0-9]+/).andThen(str => {
    const n = parseInt(str);
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
    return functionCallStatementParser().andFirst(semicolonWithWhitespace).or(
        ifZeroTDECUStatementParser()
    );
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
    return whitespaceParser.andSecond(Parser.char(openChar)).andSecond(whitespaceParser.andSecond(parser)).andFirst(Parser.char(closeChar)).andFirst(whitespaceParser);
}

/**
 * ;は消費しない
 * @returns {Parser<FunctionCallStatement>}
 */
export function functionCallStatementParser() {
    return whitespaceParser.andSecond(
        identifierParser.andThen(identifier => {
            return whitespaceParser.andSecond(leftParen.andSecond(
                apgcExpressionParser().sepBy(commaAndWhitespace).andThen(exprs => {
                    return whitespaceParser.andSecond(rightParen.map(_ => {
                        return new FunctionCallStatement(identifier, exprs);
                    }));
                })
            ));
        })
    );
}

/**
 * @template A
 * @param {string} keyword 
 * @param {(reg: NumberExpression, stmts1: APGCStatements, stmts2: APGCStatements) => A} makeStatement 
 * @returns {Parser<A>}
 */
function makeIfParser(keyword, makeStatement) {
    return whitespaceParser.andSecond(
        Parser.string(keyword).andSecond(
            paren(numberExpressionParser, "(", ")").andThen(reg => {
                return paren(apgcStatementsParser(), "{", "}").andThen(statements => {
                    return Parser.string('else').andSecond(
                        paren(apgcStatementsParser(), "{", "}").map(nonZeroStatements => {
                            return makeStatement(reg, statements, nonZeroStatements);
                        })
                    ).or(Parser.pure(
                        makeStatement(reg, statements, new APGCStatements([]))
                    ))
                });
            })
        )
    )
}

/**
 * if_zero_tdec_u (0) { statemtns } else { statements }
 * if_zero_tdec_u (0) { statemtns }
 * @returns {Parser<IfZeroTDECUStatement>}
 */
export function ifZeroTDECUStatementParser() {
    return makeIfParser('if_zero_tdec_u', (reg, zeroStatements, nonZeroStatements) => {
        return new IfZeroTDECUStatement(reg, zeroStatements, nonZeroStatements);
    });
}
