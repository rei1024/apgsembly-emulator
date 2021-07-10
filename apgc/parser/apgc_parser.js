// @ts-check

import {
    APGCExpression,
    APGCProgram,
    APGCStatement,
    APGCStatements,
    FunctionCallStatement,
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
    return apgcStatementParser().andFirst(semicolonWithWhitespace).many().map(array => new APGCStatements(array));
}

/**
 * @returns {Parser<APGCStatement>}
 */
function apgcStatementParser() {
    return functionCallStatementParser();
}

const commaAndWhitespace = whitespaceParser.andSecond(Parser.char(',')).andFirst(whitespaceParser);

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
