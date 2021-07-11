// @ts-check
import {
    HaltOutAction,
    NopAction,
    Command
} from "../apgc_deps.js";

import { APGCExpressionStatement, APGCProgram, APGCStatement, APGCStatements, FunctionCallExpression, IfZeroStatement } from "../types/apgc_types.js";
import { compileINCU } from "./functions/inc_u.js";
import { compileOutput } from "./functions/output.js";
import { compileTDECU } from "./functions/tdec_u.js";

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
     * @param {FunctionCallExpression} expr 
     * @returns {string} outputState
     */
    compileFunctionCallExpression(inputState, expr) {
        if (expr.name === 'output') {
            return compileOutput(this, inputState, expr);
        } else if (expr.name === 'inc_u') {
            return compileINCU(this, inputState, expr);
        } else if (expr.name=== 'tdec_u') {
            return compileTDECU(this, inputState, expr);
        } else {
            throw Error(`unkown function "${expr.name}"`);
        }
    }

    /**
     * @param {string} inputState
     * @param {APGCStatement} statement 
     * @returns {string} outputState
     */
    compileStatement(inputState, statement) {
        if (statement instanceof APGCExpressionStatement) {
            const expr = statement.expr;
            if (expr instanceof FunctionCallExpression) {
                return this.compileFunctionCallExpression(inputState, expr);
            } else {
                throw Error('only function call expression can be statement');
            }
        } else if (statement instanceof IfZeroStatement) {
            return compileIfZeroStatement(this, inputState, statement);
        } else {
            throw Error('unkown statement ' + statement);
        }
    }
}

/**
 *
 * @param {APGCCompiler} ctx 
 * @param {string} inputState 
 * @param {IfZeroStatement} statement 
 * @returns {string} outputState
 */
function compileIfZeroStatement(ctx, inputState, statement) {
    const expr = statement.expr;
    if (!(expr instanceof FunctionCallExpression)) {
        throw Error('if_zero only accept function call');
    }
    const ifState = ctx.compileFunctionCallExpression(inputState, expr);

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

    const zeroCommandOutputState = ctx.compileStatements(ifZeroState, statement.zeroStatements);
   
    const nonZeroCommandOutputState = ctx.compileStatements(ifNonZeroState, statement.nonZeroStataments);

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
