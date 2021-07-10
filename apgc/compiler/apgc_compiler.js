// @ts-check

import { HaltOutAction } from "../../src/actions/HaltOutAction.js";

import { Command } from "../../src/Command.js";
import { APGCProgram, APGCStatement, APGCStatements, FunctionCallStatement } from "../types/apgc_types.js";
import { compileOutput } from "./functions/output.js";

export class APGCCompiler {
    /**
     * 
     * @param {APGCProgram} program 
     */
    constructor(program) {
        /**
         * @readonly
         */
        this.program = program;

        /**
         * @type {Command[]}
         */
        this.commands = [];

        this.id = 0;
    }

    /**
     * @returns {Command[]}
     */
    compile() {
        const inputState = "INITIAL";
        const outputState = this.compileStatements(inputState, this.program.apgcStatements);
        this.commands.push(new Command({
            state: outputState,
            nextState: outputState,
            input: "*",
            actions: [new HaltOutAction()]
        }));
        return this.commands;
    }

    /**
     * @param {string} inputState
     * @param {APGCStatements} apgcStatements 
     * @returns {string} outputState
     */
    compileStatements(inputState, apgcStatements) {
        for (const statement of apgcStatements.statements) {
            inputState = this.compileStatement(inputState, statement)
        }
        return inputState;
    }

    generateState() {
        this.id++;
        return "STATE_" + this.id;
    }

    /**
     * @param {string} inputState
     * @param {APGCStatement} statement 
     * @returns {string} outputState
     */
    compileStatement(inputState, statement) {
        if (statement instanceof FunctionCallStatement) {
            if (statement.funcName === 'output') {
                return compileOutput(this, inputState, statement);
            } else {
                throw Error(`unkown function "${statement.funcName}"`);
            }
        } else {
            throw Error('unkown statement ' + statement);
        }
    }
}
