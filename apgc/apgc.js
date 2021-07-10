// @ts-check

import { Command } from "../src/Command.js";
import { ProgramLines } from "../src/ProgramLines.js";
import { Program } from "../src/Program.js";
import { APGCCompiler } from "./compiler/apgc_compiler.js";
import { apgcProgramParser } from "./parser/apgc_parser.js";
import { APGCProgram } from "./types/apgc_types.js";

// string (APGC)
// ↓ parser
// APGCProgram
// ↓ compiler
// Program (APGsembly)
// ↓ pretty
// string (APGsembly)

/**
 * 
 * @param {string} string 
 * @returns {APGCProgram}
 */
export function parser(string) {
    const result = apgcProgramParser().parseValue(string);
    if (result === undefined) {
        throw Error('Parse error ' + string);
    }
    return result;
}

/**
 * 
 * @param {APGCProgram} program 
 * @returns {Program}
 */
export function compiler(program) {
    /** @type {Command[]} */
    const commands = new APGCCompiler(program).compile();
    return new Program({
        commands: commands,
        componentsHeader: undefined,
        registersHeader: undefined,
        programLines: new ProgramLines([])
    }).reconstructProgramLines();
}

/**
 * 
 * @param {string} str APGC
 * @returns {string} APGsembly
 * @throws
 */
export function main(str) {
    return compiler(parser(str)).pretty()
}
