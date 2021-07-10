// @ts-check

import { Program } from "../src/Program.js";

// string (APGC)
// ↓ lexer
// Token[]
// ↓ parser
// APGCProgram
// ↓ compiler
// Program (APGsembly)
// ↓ pretty
// string (APGsembly)

export class Token {

}

export class APGCProgram {

}

/**
 * @param {string} str
 * @returns {Token[]}
 */
export function lexer(str) {
    let index = 0;
    function consumeWhitespace() {
        const char = str[index];
        while (/\s/.test(char)) {
            index++;
        }
    }
    consumeWhitespace();

    return [];
}

/**
 * 
 * @param {Token[]} tokens 
 * @returns {APGCProgram}
 */
export function parser(tokens) {
    return new APGCProgram();
}

/**
 * 
 * @param {APGCProgram} program 
 * @returns {Program}
 */
export function compiler(program) {
    return new Program({})
}

/**
 * 
 * @param {string} str APGC
 * @returns {string} APGsembly
 * @throws
 */
export function main(str) {
    return compiler(parser(lexer(str))).pretty()
}
