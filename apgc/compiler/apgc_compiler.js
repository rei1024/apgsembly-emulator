// @ts-check
import {
    URegAction,
    U_TDEC,
    HaltOutAction,
    NopAction,
    Command
} from "../apgc_deps.js";

import { APGCProgram, APGCStatement, APGCStatements, FunctionCallStatement, IfZeroTDECUStatement } from "../types/apgc_types.js";
import { compileINCU } from "./functions/inc_u.js";
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
     * 
     * @param {Command} command 
     */
    addCommand(command) {
        this.commands.push(command);
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
            } else if (statement.funcName === 'inc_u') {
                return compileINCU(this, inputState, statement);
            } else {
                throw Error(`unkown function "${statement.funcName}"`);
            }
        } else if (statement instanceof IfZeroTDECUStatement) {
            return compileIfZeroTDECUStatement(this, inputState, statement);
        } else {
            throw Error('unkown statement ' + statement);
        }
    }
}

/**
 *
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {IfZeroTDECUStatement} statement 
 * @returns {string} outputState
 */
function compileIfZeroTDECUStatement(ctx, inputState, statement) {
    const ifState = ctx.generateState();
    const command = new Command({
        state: inputState,
        input: "*",
        nextState: ifState,
        actions: [new URegAction(U_TDEC, statement.reg.value)]
    });
    ctx.addCommand(command);
    const ifZeroState = ctx.generateState();
    const ifNonZeroState = ctx.generateState();
    const ifCommandZero = new Command({
        state: ifState,
        input: "Z",
        nextState: ifZeroState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandZero)
    const ifCommandNonZero = new Command({
        state: ifState,
        input: "NZ",
        nextState: ifNonZeroState,
        actions: [new NopAction()]
    });
    ctx.addCommand(ifCommandNonZero);

    const zeroCommandOutputState = ctx.compileStatements(ifZeroState, statement.z);
   
    const nonZeroCommandOutputState = ctx.compileStatements(ifNonZeroState, statement.nz);

    const finalState = ctx.generateState();

    const finalCommandZero = new Command({
        state: zeroCommandOutputState,
        input: "*",
        nextState: finalState,
        actions: [new NopAction()]
    });
    ctx.addCommand(finalCommandZero);
    const finalCommandNonZero = new Command({
        state: nonZeroCommandOutputState,
        input: "*",
        nextState: finalState,
        actions: [new NopAction()]
    });
    ctx.addCommand(finalCommandNonZero);
    return finalState;
}
